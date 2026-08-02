import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Download, RefreshCw, Check, Smartphone, Wifi, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function QRCodeDisplay({ file, roomId, peerStatus, transferProgress, onReset }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  // Construct sharing pairing link
  useEffect(() => {
    if (roomId) {
      const origin = window.location.origin;
      const fullShareUrl = `${origin}/#room=${roomId}`;
      setQrUrl(fullShareUrl);

      if (canvasRef.current) {
        QRCode.toCanvas(
          canvasRef.current,
          fullShareUrl,
          {
            width: 260,
            margin: 2,
            color: {
              dark: '#0f172a',
              light: '#ffffff',
            },
            errorCorrectionLevel: 'H'
          },
          (error) => {
            if (error) console.error('QR Code render error:', error);
          }
        );
      }
    }
  }, [roomId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrdrop-${file ? file.name : 'qr'}.png`;
      a.click();
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={onReset} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className="pulse-badge">
          <span className="pulse-dot"></span> Session Active
        </span>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Scan QR Code on Phone</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
        Open your phone camera app or any QR reader to instantly receive <strong style={{ color: '#fff' }}>{file?.name}</strong>.
      </p>

      {/* QR Code Container with Glow Card */}
      <div style={{
        background: '#ffffff',
        padding: '20px',
        borderRadius: '20px',
        display: 'inline-block',
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.25)',
        position: 'relative'
      }}>
        <canvas ref={canvasRef} style={{ borderRadius: '8px', display: 'block' }} />
      </div>

      {/* Connection Status Panel */}
      <div style={{
        margin: '24px 0 16px',
        padding: '14px 18px',
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '14px',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        {peerStatus === 'waiting' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
            <Wifi size={18} className="animate-pulse" />
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Waiting for phone scanner...</span>
          </div>
        )}

        {peerStatus === 'connected' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
            <Smartphone size={18} />
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Phone Connected! Initiating Transfer...</span>
          </div>
        )}

        {peerStatus === 'transferring' && (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Streaming File Chunks...</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{transferProgress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${transferProgress}%` }}></div>
            </div>
          </div>
        )}

        {peerStatus === 'complete' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
            <Check size={20} />
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Transfer Complete! Downloaded on target device.</span>
          </div>
        )}
      </div>

      {/* Utility Actions */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={handleCopy} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
          {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
          {copied ? 'Link Copied!' : 'Copy Direct Link'}
        </button>

        <button onClick={handleDownloadQR} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
          <Download size={16} /> Save QR Image
        </button>
      </div>

    </div>
  );
}
