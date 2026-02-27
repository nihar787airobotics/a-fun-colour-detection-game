<div align="center">

```
 ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ███╗ █████╗ 
██╔════╝██║  ██║██╔══██╗██╔═══██╗████╗ ████║██╔══██╗
██║     ███████║██████╔╝██║   ██║██╔████╔██║███████║
██║     ██╔══██║██╔══██╗██║   ██║██║╚██╔╝██║██╔══██║
╚██████╗██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝
         ██████╗ ███████╗████████╗███████╗ ██████╗████████╗
         ██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝
         ██║  ██║█████╗     ██║   █████╗  ██║        ██║   
         ██║  ██║██╔══╝     ██║   ██╔══╝  ██║        ██║   
         ██████╔╝███████╗   ██║   ███████╗╚██████╗   ██║   
         ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝ ╚═════╝   ╚═╝   
```

<br />

**◈ AI-Powered Color Detection ◈ HSV Analysis ◈ Real-Time ◈ No Backend ◈**

<br />

[![Learning Project](https://img.shields.io/badge/phase-learning%20%26%20building-00e5cc?style=for-the-badge&labelColor=0a0a0a)](/)
[![Next.js](https://img.shields.io/badge/built%20with-next.js-ffffff?style=for-the-badge&labelColor=0a0a0a)](https://nextjs.org)
[![Computer Vision](https://img.shields.io/badge/powered%20by-HSV%20color%20analysis-ff6ec7?style=for-the-badge&labelColor=0a0a0a)](/)
[![Version](https://img.shields.io/badge/version-1.0.0-ffd166?style=for-the-badge&labelColor=0a0a0a)](/)

<br />

> *"Step one of learning computer vision — teach the machine to see color. This is that step."*

<br />

</div>

---

<br />

## 〔 What is ChromaDetect? 〕

**ChromaDetect** is a real-time, browser-based color detection game. Point your webcam at any object — the app identifies its dominant color using HSV color space analysis, gives you challenges to find specific colors around you, and tracks your score over time.

> 🧪 **This is a beginner / foundational project.** It's the starting point of a longer journey into computer vision, image processing, and AI-powered visual tools. The goal right now is to understand the fundamentals — how HSV works, how to process video frames in the browser, how to build around `getUserMedia()`. The advanced stuff comes later.

<br />

---

<br />

## 〔 How It Works 〕

```
  Webcam Frame
       │
       ▼
  Canvas API  ──────►  Sample center pixel region
                               │
                               ▼
                        Convert RGB → HSV
                    (Hue, Saturation, Value)
                               │
                               ▼
                   Match against color ranges:
                   
        H: 300–360° ──► 🩷 Pink
        H: 80–160°  ──► 💚 Green  
        H: 20–40°   ──► 💛 Yellow
        H: 200–260° ──► 💙 Blue
        S: < 20%    ──► 🤍 White
                               │
                               ▼
                    Display result + update score
```

All processing happens **entirely in your browser**. No images, no video, nothing ever leaves your device.

<br />

---

<br />

## 〔 Features 〕

| | Feature | Description |
|---|---|---|
| 👁️ | **Real-Time Detection** | Analyzes live webcam frames on every tick |
| 🎨 | **5 Color Modes** | Pink, Green, Yellow, Blue, White via HSV range matching |
| ⚡ | **Lightning Fast** | Per-frame HSV analysis with instant feedback |
| 🎯 | **Color Challenges** | Random challenges: "find something Blue" — earn points |
| 📊 | **Detection History** | Full log with timestamps + color distribution stats |
| 🔒 | **100% Private** | Client-side only — camera feed never leaves your device |

<br />

---

<br />

## 〔 Pages 〕

```
  /  ─────────────────────────────────────────────────────────
  Home        Dashboard with live stats, detectable colors,
              and quick-start detection button
  
  /play  ─────────────────────────────────────────────────────
  Play        Live camera feed + real-time color overlay +
              active challenge display
  
  /results  ──────────────────────────────────────────────────
  Results     Detection history table, color distribution
              bars, total detections & score summary
  
  /settings  ─────────────────────────────────────────────────
  Settings    Toggle challenges on/off, camera permissions
              info, about section
```

<br />

---

<br />

## 〔 Getting Started 〕

```bash
# Clone
git clone https://github.com/yourusername/chromadetect.git
cd chromadetect

# Install
npm install

# Run locally
npm run dev

# Open
http://localhost:3000
```

> 💡 Allow camera permissions when prompted. Detection only runs in-browser — nothing is uploaded anywhere.

<br />

---

<br />

## 〔 The Tech Stack 〕

```
  Next.js          ──  Framework & routing
  Canvas 2D API    ──  Frame sampling & pixel processing
  getUserMedia()   ──  Webcam access
  HSV Algorithm    ──  Custom JavaScript color matching
  WebGL (partial)  ──  Visual overlays on detection
```

No external CV libraries. The color detection is hand-written HSV math — which is the whole point.

<br />

---

<br />

## 〔 What I Learned Building This 〕

This project was specifically built to understand:

- **HSV vs RGB** — why hue-based detection is far more robust than raw RGB matching under different lighting conditions
- **`getUserMedia()` API** — requesting, handling, and releasing webcam streams
- **Canvas frame sampling** — drawing video to canvas, reading `ImageData`, extracting pixels
- **Per-frame processing** — building a render loop that doesn't block the main thread
- **Gamification basics** — challenge state, scoring, history persistence

<br />

---

<br />

## 〔 Roadmap — Where This Is Going 〕

This is v1.0. The foundation. Here's what comes next as I go deeper:

```
  v1.0  ✅  HSV color detection, challenges, scoring, history
  
  v1.5  🔜  Expand to full color spectrum (not just 5 colors)
             Better accuracy under variable lighting
             Confidence scores per detection
  
  v2.0  🔮  Object detection — not just color, but WHAT the object is
             Integration with TensorFlow.js / ONNX models
             Bounding boxes drawn on live feed
  
  v3.0  🔮  Custom trained color classifier
             AR overlays on detected objects
             Multi-object simultaneous detection
  
  v∞    🔮  Who knows — this is just the beginning of playing
             with visual AI in the browser
```

<br />

---

<br />

## 〔 Known Limitations 〕

Because this is a learning build, some things are intentionally simple:

- 🌦️ Sensitive to lighting — bright/dim rooms affect HSV thresholds
- 🎨 Only 5 colors — the palette is narrow by design for now
- 📱 Desktop-first — mobile webcam may behave differently
- 💾 History is session-only — no persistence between refreshes
- 🔲 Center-pixel sampling only — doesn't scan the full frame

*These are next experiments, not failures.*

<br />

---

<br />

<div align="center">

**〔 Built to learn. Shared to grow. 〕**

<br />

```
  ◈  Every advanced CV project started with detecting a color.  ◈
  ◈           This is where mine begins.                        ◈
```

<br />

*Fork it. Break it. Improve the HSV thresholds.*
*That's literally what this is here for.*

<br />

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

</div>
