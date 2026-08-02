import React from 'react';
import { QrCode, Shield, Zap, Sparkles, BookOpen, Smartphone } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, roomActive }) {
  return (
    <header className="glass-panel" style={{ margin: '20px auto 30px', maxWidth: '1200px', width: '92%', padding: '16px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('send')}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            padding: '10px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}>
            <QrCode size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>
                QR<span className="gradient-text">Drop</span>
              </h1>
              <span className="pulse-badge">
                <span className="pulse-dot"></span> P2P WebRTC
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Instant QR File Share • Unlimited Size
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.5)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setActiveTab('send')}
            className={activeTab === 'send' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
          >
            <Zap size={16} /> Send File
          </button>
          
          <button
            onClick={() => setActiveTab('scan')}
            className={activeTab === 'scan' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
          >
            <Smartphone size={16} /> Scan QR
          </button>

          <button
            onClick={() => setActiveTab('use-cases')}
            className={activeTab === 'use-cases' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
          >
            <BookOpen size={16} /> Use Cases
          </button>
        </nav>

        {/* Share App QR Modal Trigger */}
        <button
          onClick={() => setActiveTab('share-app')}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px', borderColor: 'var(--accent-cyan)' }}
        >
          <QrCode size={16} color="var(--accent-cyan)" /> App Wi-Fi Link QR
        </button>

      </div>
    </header>
  );
}

