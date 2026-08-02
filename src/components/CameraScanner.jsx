import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CameraScanner({ onScanSuccess, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError('Camera permission denied or camera not found. You can paste the QR URL manually below.');
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '28px', maxWidth: '480px', width: '100%', position: 'relative' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '6px', textAlign: 'center' }}>
          Scan QR Code Camera
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', textAlign: 'center', marginBottom: '20px' }}>
          Position QR code inside frame or paste pairing link below.
        </p>

        {/* Video Camera Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          background: '#000',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '2px solid var(--border-glow)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!error ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--accent-rose)' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontSize: '0.84rem' }}>{error}</p>
            </div>
          )}

          {/* Scanner Overlay Line */}
          {!error && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
              boxShadow: '0 0 15px #06b6d4',
              animation: 'pulse-ring 1.5s infinite'
            }}></div>
          )}
        </div>

        {/* Manual URL Input Fallback */}
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Paste pairing URL (e.g. http://.../#room=123)"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
            Open
          </button>
        </form>

      </div>
    </div>
  );
}
