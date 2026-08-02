import React, { useEffect, useState, useRef } from 'react';
import { Download, FileCheck, CheckCircle2, Loader2, HardDrive, ShieldCheck, ArrowDownCircle, AlertCircle } from 'lucide-react';

export default function FileReceiver({ socket, roomId }) {
  const [fileMeta, setFileMeta] = useState(null);
  const [status, setStatus] = useState('connecting'); // connecting, connected, receiving, ready, error
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  
  // Storage for received binary chunks
  const receivedChunks = useRef([]);
  const receivedSize = useRef(0);

  useEffect(() => {
    if (!socket || !roomId) return;

    // Join room
    socket.emit('join-room', { roomId });

    // File metadata received from sender
    socket.on('file-meta', (meta) => {
      setFileMeta(meta);
      setStatus('connected');
    });

    // Error handling
    socket.on('error-msg', ({ message }) => {
      setStatus('error');
      setErrorMessage(message);
    });

    // Receive direct chunk stream
    socket.on('receive-chunk', ({ chunk, chunkIndex, totalChunks, fileName }) => {
      setStatus('receiving');
      receivedChunks.current.push(chunk);
      
      const pct = Math.round(((chunkIndex + 1) / totalChunks) * 100);
      setProgress(pct);

      // Report progress back to sender
      socket.emit('transfer-progress', { roomId, progress: pct });

      // When all chunks arrive
      if (chunkIndex + 1 === totalChunks) {
        assembleFile(metaTypeFromFilename(fileName));
      }
    });

    socket.on('peer-disconnected', () => {
      if (status !== 'ready') {
        setStatus('error');
        setErrorMessage('Sender disconnected before transfer completed.');
      }
    });

    return () => {
      socket.off('file-meta');
      socket.off('error-msg');
      socket.off('receive-chunk');
      socket.off('peer-disconnected');
    };
  }, [socket, roomId]);

  const metaTypeFromFilename = (name) => {
    if (fileMeta && fileMeta.type) return fileMeta.type;
    return 'application/octet-stream';
  };

  const assembleFile = (mimeType) => {
    try {
      const blob = new Blob(receivedChunks.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('ready');
      setProgress(100);
    } catch (err) {
      console.error('File assembly error:', err);
      setStatus('error');
      setErrorMessage('Failed to assemble binary file chunks.');
    }
  };

  const handleDownload = () => {
    if (downloadUrl && fileMeta) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileMeta.name || 'downloaded-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', maxWidth: '520px', margin: '20px auto', textAlign: 'center' }}>
      
      {/* Header Badge */}
      <div style={{ marginBottom: '20px' }}>
        <span className="pulse-badge">
          <span className="pulse-dot"></span> Mobile Receiver Node
        </span>
      </div>

      <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>QR Code File Transfer</h2>

      {/* Connecting state */}
      {status === 'connecting' && (
        <div style={{ padding: '40px 0' }}>
          <Loader2 size={40} color="var(--primary-light)" className="animate-spin" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-muted)' }}>Connecting to peer session...</p>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div style={{ padding: '30px 20px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.3)', margin: '20px 0' }}>
          <AlertCircle size={36} color="var(--accent-rose)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-rose)', marginBottom: '6px' }}>Transfer Unavailable</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{errorMessage || 'The QR transfer session has expired or the sender closed the browser.'}</p>
        </div>
      )}

      {/* Connected / Receiving / Ready state */}
      {(status === 'connected' || status === 'receiving' || status === 'ready') && fileMeta && (
        <div>
          {/* File Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border-glass)',
            margin: '20px 0',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                padding: '14px',
                borderRadius: '14px',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}>
                <FileCheck size={32} color="var(--accent-cyan)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1.1rem', wordBreak: 'break-all', marginBottom: '4px' }}>
                  {fileMeta.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Size: <strong style={{ color: '#fff' }}>{formatBytes(fileMeta.size)}</strong>
                </p>
              </div>
            </div>

            {/* Transfer Progress Bar */}
            {(status === 'receiving' || status === 'ready') && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{status === 'ready' ? 'Complete' : 'Receiving Chunks...'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Download Popup / Action Button */}
          {status === 'ready' ? (
            <div className="animate-fade-in" style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
              padding: '24px',
              borderRadius: '18px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 10px 30px var(--glow-emerald)'
            }}>
              <CheckCircle2 size={42} color="var(--accent-emerald)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', fontWeight: '700' }}>File Ready for Download!</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Click below to save <strong style={{ color: '#fff' }}>{fileMeta.name}</strong> to your device downloads.
              </p>

              <button
                onClick={handleDownload}
                className="btn-emerald"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download size={20} /> Download File Now
              </button>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader2 size={16} className="animate-spin" color="var(--accent-cyan)" />
              Streaming file directly from sender browser...
            </div>
          )}
        </div>
      )}

    </div>
  );
}
