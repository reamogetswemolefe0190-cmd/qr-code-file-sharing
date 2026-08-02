import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e8 // 100MB for fallback buffer if needed
});

const PORT = process.env.PORT || 5000;

// Track active rooms and room metadata
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // Create room (Sender)
  socket.on('create-room', ({ roomId, fileMeta }) => {
    socket.join(roomId);
    rooms.set(roomId, {
      senderId: socket.id,
      fileMeta,
      receiverId: null,
      createdAt: Date.now()
    });
    console.log(`[Room ${roomId}] Created by sender ${socket.id}`);
    socket.emit('room-created', { roomId });
  });

  // Join room (Receiver scanning QR)
  socket.on('join-room', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error-msg', { message: 'Transfer session expired or not found.' });
      return;
    }

    socket.join(roomId);
    room.receiverId = socket.id;
    console.log(`[Room ${roomId}] Receiver ${socket.id} joined`);

    // Notify receiver about file metadata
    socket.emit('file-meta', room.fileMeta);

    // Notify sender that receiver joined, ready for WebRTC offer
    io.to(room.senderId).emit('receiver-joined', { receiverId: socket.id });
  });

  // WebRTC Signaling: Offer, Answer, ICE Candidates
  socket.on('signal-offer', ({ roomId, offer }) => {
    const room = rooms.get(roomId);
    if (room && room.receiverId) {
      io.to(room.receiverId).emit('signal-offer', { offer });
    }
  });

  socket.on('signal-answer', ({ roomId, answer }) => {
    const room = rooms.get(roomId);
    if (room && room.senderId) {
      io.to(room.senderId).emit('signal-answer', { answer });
    }
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, sender: socket.id });
  });

  // Relay chunk fallback (if WebRTC direct channel encounters NAT firewall block)
  socket.on('relay-chunk', ({ roomId, chunk, chunkIndex, totalChunks, fileName }) => {
    socket.to(roomId).emit('receive-chunk', { chunk, chunkIndex, totalChunks, fileName });
  });

  // Progress update broadcast
  socket.on('transfer-progress', ({ roomId, progress }) => {
    socket.to(roomId).emit('transfer-progress', { progress });
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    for (const [roomId, room] of rooms.entries()) {
      if (room.senderId === socket.id || room.receiverId === socket.id) {
        socket.to(roomId).emit('peer-disconnected');
        rooms.delete(roomId);
      }
    }
  });
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  const distPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(distPath, (err) => {
    if (err) {
      res.send('QRDrop Server Running. Build frontend with `npm run build` for unified serving.');
    }
  });
});

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

// API endpoint to return server's local network IP addresses
app.get('/api/network-info', (req, res) => {
  const ips = getLocalIpAddresses();
  res.json({ ips, port: PORT });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 QRDrop Signaling Server running!`);
  console.log(`- Local Access:   http://localhost:${PORT}`);
  const localIps = getLocalIpAddresses();
  localIps.forEach(ip => {
    console.log(`- Network Access: http://${ip}:${PORT} (Use this for offline Wi-Fi transfer!)`);
  });
});



