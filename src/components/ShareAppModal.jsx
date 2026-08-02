import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Wifi, Copy, Check, X, ShieldCheck } from 'lucide-react';

export default function ShareAppModal({ onClose }) {
  const canvasRef = useRef(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data) => {
        setNetworkInfo(data);
        if (data.ips && data.ips.length > 0) {
          const url = `http://${data.ips[0]}:${data.port}`;
          setAppUrl(url);
          renderQR(url);
        } else {
          const url = window.location.origin;
          setAppUrl(url);
          renderQR(url);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch network info:', err);
        const url = window.location.origin;
        setAppUrl(url);
        renderQR(url);
      });
  }, []);

  const renderQR = (url) => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR render error:', error);
        }
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="glass-panel animate-fade-in" style={{ padding: '32px', maxWidth: '480px', width: '100%', textAlign: 'center', position: 'relative' }}>
        
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

        <span className="pulse-badge" style={{ marginBottom: '12px' }}>
          <Wifi size={14} /> Local Network Access
        </span>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Open QRDrop on Mobile</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Scan this QR code with any phone connected to the same Wi-Fi network to launch the web app instantly!
        </p>

        {/* QR Code Container */}
        <div style={{
          background: '#ffffff',
          padding: '16px',
          borderRadius: '18px',
          display: 'inline-block',
          marginBottom: '20px',
          boxShadow: '0 0 30px var(--glow-cyan)'
        }}>
          <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '8px' }} />
        </div>

        {/* URL Display Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
            {appUrl || 'Loading network IP...'}
          </span>
          <button onClick={handleCopy} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="var(--accent-emerald)" /> Works 100% offline on your local Wi-Fi router.
        </p>

      </div>
    </div>
  );
}
