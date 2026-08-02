import React from 'react';
import { Shield, Presentation, Stethoscope, ShoppingBag, Cpu, Laptop, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function UseCasesShowcase() {
  const useCases = [
    {
      icon: <Shield size={32} color="#06b6d4" />,
      badge: "Cybersecurity & Air-Gap",
      title: "Air-Gapped Network File Transfer",
      description: "Transfer sensitive cryptographic keys, offline firmware updates, or signed config profiles into air-gapped secure servers without network cables, Bluetooth, or USB ports.",
      points: ["Zero network exposure", "Prevents malware propagation", "Auditable optical handshake"]
    },
    {
      icon: <Presentation size={32} color="#6366f1" />,
      badge: "Events & Education",
      title: "Keynote & Conference Asset Sharing",
      description: "Speakers display dynamic QR codes on auditorium projection screens so hundreds of attendees can instantly download high-res PDFs, slide decks, and whitepapers simultaneously.",
      points: ["Instant mass distribution", "No email signup forms required", "Real-time download stats"]
    },
    {
      icon: <Stethoscope size={32} color="#10b981" />,
      badge: "Healthcare & Privacy",
      title: "Contactless Medical Record Sharing",
      description: "Patients share heavy medical imaging files (X-rays, MRIs, lab diagnostics) from mobile devices directly to clinic diagnostic screens via P2P encrypted streams.",
      points: ["HIPAA/GDPR compliant", "No third-party cloud storage", "Zero physical contact"]
    },
    {
      icon: <ShoppingBag size={32} color="#f43f5e" />,
      badge: "Retail & E-Commerce",
      title: "Point-of-Sale E-Receipts & 3D Media",
      description: "Self-checkout counters generate instant QR codes for customers to receive interactive digital receipts, warranty booklets, or 3D AR product preview models.",
      points: ["Replaces paper waste", "Rich interactive receipts", "Instant offline availability"]
    },
    {
      icon: <Cpu size={32} color="#f59e0b" />,
      badge: "Industrial & Auto",
      title: "Equipment Diagnostic Log Extraction",
      description: "Field technicians scan QR codes on industrial controllers, solar inverters, or vehicle OBD diagnostic ports to extract real-time system logs and diagnostic telematics.",
      points: ["Instant diagnostic pull", "Works in remote locations", "Standard smartphone integration"]
    },
    {
      icon: <Laptop size={32} color="#a855f7" />,
      badge: "Productivity",
      title: "Cross-Device Instant Workspace",
      description: "Seamlessly push high-res photos, videos, or zip archives between desktop workstations, tablets, smartphones, and smart TVs without logging into chat apps or emails.",
      points: ["No login or pairing required", "Unlimited file size support", "Blazing fast local Wi-Fi speeds"]
    }
  ];

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="pulse-badge" style={{ marginBottom: '12px' }}>
          <Zap size={14} /> Technology Applications
        </span>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
          Where Else Can We Use <span className="gradient-text">QR File Transfer</span>?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
          Optical pairing combined with WebRTC direct P2P data streaming opens up groundbreaking applications across security, healthcare, retail, and industrial engineering.
        </p>
      </div>

      {/* Grid of Use Cases */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {useCases.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid var(--border-glass)',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            className="use-case-card"
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{
                  padding: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-glass)'
                }}>
                  {item.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                {item.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              {item.points.map((pt, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  <CheckCircle2 size={14} color="var(--accent-emerald)" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
