# QRDrop — Instant QR Code Peer-to-Peer File Transfer

**QRDrop** is a high-speed, cross-platform web application that lets you send files of **any size** directly between devices (Desktop ↔ Mobile, iPhone ↔ Windows/Android/Mac) simply by scanning a QR code. Built with React, Node.js, Socket.IO, and native browser GZIP stream compression (`CompressionStream`).

---

## ✨ Key Features

- **Unlimited File Size Transfers**: Stream everything from documents and high-res photos to multi-gigabyte videos and archives in 64KB chunks directly between browsers.
- **Lossless Turbo-Compression (GZIP)**: Built-in real-time lossless compression (`CompressionStream` / `DecompressionStream`) shrinks compressible files by up to 80% in transit with **0% quality loss**.
- **100% Local Wi-Fi / Hotspot Offline Support**: Works completely offline when devices share a local Wi-Fi router or mobile hotspot—up to 300x faster than Bluetooth with zero pairing friction.
- **Instant Mobile Download Prompt**: Scanning the QR code opens the mobile receiver interface with live progress tracking and a one-tap download prompt.
- **Built-in Camera QR Scanner**: Includes an in-app camera scanner and manual pairing link input for devices without native camera QR readers.
- **Progressive Web App (PWA)**: Installable directly onto iOS and Android home screens as a standalone app.
- **Industry Use Cases Showcase**: Interactive guide exploring applications across air-gapped cybersecurity, conference keynote sharing, HIPAA-compliant medical imaging, retail e-receipts, and industrial diagnostics.

---

## 🚀 How It Works

1. **Select a File**: Drag and drop or browse to select any file in the web app.
2. **Generate QR Code**: Click **Generate QR Code & Transfer Link** to create an active transfer room and high-contrast QR code.
3. **Scan on Phone**: Point your phone camera at the QR code (or use the in-app **Scan QR** tab).
4. **Download Instantly**: Watch the live chunk stream complete in real time and tap **Download File Now** when the popup appears.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Custom Glassmorphic CSS Design System
- **QR Engine**: `qrcode` (HTML5 Canvas high-error-correction rendering)
- **Compression**: Web-standard `CompressionStream('gzip')` & `DecompressionStream('gzip')`
- **Backend & Signaling**: Node.js, Express, Socket.IO
- **Deployment**: Docker (`Dockerfile`) & Render Blueprint (`render.yaml`)

---

## 💻 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)

### Installation & Startup

```bash
# 1. Clone the repository
git clone https://github.com/reamogetswemolefe0190-cmd/qr-code-file-sharing.git
cd qr-code-file-sharing

# 2. Install dependencies
npm install

# 3. Build the production frontend
npm run build

# 4. Start the server
npm start
```

The server will display both your **Local Access** URL (`http://localhost:5000`) and your **Network Access** URL (e.g., `http://192.168.x.x:5000`) for offline local Wi-Fi transfers.

---

## 🌐 1-Click Cloud Deployment

This repository includes ready-to-use configurations for cloud hosting:
- **Render**: Connect this repository on [Render.com](https://render.com) as a **Web Service** (`render.yaml` is auto-detected).
- **Docker / Railway / Fly.io**: Uses the root `Dockerfile` to build and serve on port `5000`.

---

## 📄 License

MIT License — free to use, modify, and distribute.
