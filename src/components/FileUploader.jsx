import React, { useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Video, Music, Archive, CheckCircle2, ShieldCheck, HardDrive } from 'lucide-react';

export default function FileUploader({ selectedFile, setSelectedFile, onGenerateQR }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (!file) return <FileText size={32} color="var(--primary-light)" />;
    const type = file.type;
    if (type.startsWith('image/')) return <ImageIcon size={32} color="#06b6d4" />;
    if (type.startsWith('video/')) return <Video size={32} color="#ec4899" />;
    if (type.startsWith('audio/')) return <Music size={32} color="#a855f7" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return <Archive size={32} color="#f59e0b" />;
    return <FileText size={32} color="var(--primary-light)" />;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px', maxWidth: '580px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Select File to Transfer</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Upload any file (No size limit). Scan QR code on your phone to download immediately.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Dropzone */}
      <div
        className={`dropzone ${isDragging ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <Upload size={28} color="var(--primary-light)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '6px', fontWeight: '600' }}>
              Drag & Drop file here or <span style={{ color: 'var(--accent-cyan)' }}>Browse</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Supports PDFs, Images, Videos, Archives, Documents, Audio (Any Size)
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
            <div style={{
              padding: '12px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '14px',
              border: '1px solid var(--border-glass)'
            }}>
              {getFileIcon(selectedFile)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '1.05rem', wordBreak: 'break-all', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedFile.name}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {formatBytes(selectedFile.size)} • {selectedFile.type || 'Binary File'}
              </p>
            </div>
            <CheckCircle2 size={24} color="var(--accent-emerald)" />
          </div>
        )}
      </div>

      {/* Security & Feature Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        margin: '24px 0',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '12px',
        border: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={16} color="var(--accent-emerald)" />
          <span>Peer-to-Peer Encrypted</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <HardDrive size={16} color="var(--accent-cyan)" />
          <span>No Cloud Storage Limit</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onGenerateQR}
        disabled={!selectedFile}
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '14px',
          fontSize: '1rem',
          opacity: selectedFile ? 1 : 0.5,
          cursor: selectedFile ? 'pointer' : 'not-allowed'
        }}
      >
        Generate QR Code & Transfer Link
      </button>
    </div>
  );
}
