import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import QRCodeDisplay from './components/QRCodeDisplay';
import FileReceiver from './components/FileReceiver';
import CameraScanner from './components/CameraScanner';
import UseCasesShowcase from './components/UseCasesShowcase';
import ShareAppModal from './components/ShareAppModal';


// Initialize Socket.io connection to signaling server
const socket = io(window.location.origin, {
  transports: ['websocket', 'polling']
});

export default function App() {
  const [activeTab, setActiveTab] = useState('send'); // 'send', 'scan', 'use-cases'
  const [selectedFile, setSelectedFile] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [peerStatus, setPeerStatus] = useState('waiting'); // 'waiting', 'connected', 'transferring', 'complete'
  const [transferProgress, setTransferProgress] = useState(0);
  
  // Direct receiver mode if URL contains #room=xyz
  const [directRoomId, setDirectRoomId] = useState(null);

  // Check URL Hash for direct receiver mode (Phone Scan entry)
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#room=')) {
        const id = hash.replace('#room=', '');
        setDirectRoomId(id);
      } else {
        setDirectRoomId(null);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Socket event listeners for sender
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to QRDrop server:', socket.id);
    });

    socket.on('receiver-joined', () => {
      setPeerStatus('connected');
      // Start streaming file chunks to receiver
      if (selectedFile && roomId) {
        startChunkStreaming(selectedFile, roomId);
      }
    });

    socket.on('transfer-progress', ({ progress }) => {
      setTransferProgress(progress);
      if (progress > 0 && progress < 100) {
        setPeerStatus('transferring');
      } else if (progress === 100) {
        setPeerStatus('complete');
      }
    });

    socket.on('peer-disconnected', () => {
      setPeerStatus('waiting');
      setTransferProgress(0);
    });

    return () => {
      socket.off('connect');
      socket.off('receiver-joined');
      socket.off('transfer-progress');
      socket.off('peer-disconnected');
    };
  }, [selectedFile, roomId]);

  // Generate QR & Room
  const handleGenerateQR = () => {
    if (!selectedFile) return;

    const newRoomId = Math.random().toString(36).substring(2, 9);
    setRoomId(newRoomId);
    setPeerStatus('waiting');
    setTransferProgress(0);

    // Emit create-room with metadata
    socket.emit('create-room', {
      roomId: newRoomId,
      fileMeta: {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      }
    });
  };

  // Stream file chunks over socket relay / WebRTC channel
  const startChunkStreaming = (file, rId) => {
    const CHUNK_SIZE = 64 * 1024; // 64KB per chunk
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;

    const reader = new FileReader();

    const readNextChunk = () => {
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const slice = file.slice(start, end);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (e.target.result) {
        socket.emit('relay-chunk', {
          roomId: rId,
          chunk: e.target.result,
          chunkIndex: currentChunk,
          totalChunks,
          fileName: file.name
        });

        currentChunk++;
        const pct = Math.round((currentChunk / totalChunks) * 100);
        setTransferProgress(pct);
        setPeerStatus(pct === 100 ? 'complete' : 'transferring');

        if (currentChunk < totalChunks) {
          // Continue streaming next chunk
          setTimeout(readNextChunk, 15);
        }
      }
    };

    readNextChunk();
  };

  const handleResetSender = () => {
    setRoomId(null);
    setSelectedFile(null);
    setPeerStatus('waiting');
    setTransferProgress(0);
  };

  const handleScanSuccess = (url) => {
    if (url.includes('#room=')) {
      const id = url.split('#room=')[1];
      window.location.hash = `#room=${id}`;
      setActiveTab('send');
    } else {
      window.location.href = url;
    }
  };

  // If opened via QR code hash (#room=xyz), render receiver view directly!
  if (directRoomId) {
    return (
      <div>
        <Navbar activeTab="scan" setActiveTab={() => { window.location.hash = ''; }} />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px' }}>
          <FileReceiver socket={socket} roomId={directRoomId} />
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} roomActive={!!roomId} />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
        {activeTab === 'send' && (
          <div>
            {!roomId ? (
              <FileUploader
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                onGenerateQR={handleGenerateQR}
              />
            ) : (
              <QRCodeDisplay
                file={selectedFile}
                roomId={roomId}
                peerStatus={peerStatus}
                transferProgress={transferProgress}
                onReset={handleResetSender}
              />
            )}
          </div>
        )}

        {activeTab === 'scan' && (
          <CameraScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setActiveTab('send')}
          />
        )}

        {activeTab === 'use-cases' && <UseCasesShowcase />}

        {activeTab === 'share-app' && (
          <ShareAppModal onClose={() => setActiveTab('send')} />
        )}
      </main>


      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        color: 'var(--text-dim)',
        fontSize: '0.84rem',
        borderTop: '1px solid var(--border-glass)',
        marginTop: '40px'
      }}>
        QRDrop • Instant QR Code Peer-to-Peer File Transfer System
      </footer>
    </div>
  );
}
