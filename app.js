/**
 * Sabhaym Trivedi - Portfolio 2026 Engine
 * Audio-Reactive DSP, Interactive Editorial Scrapbook,
 * 3D Hardcover Inspector, and Mascot Companion Bridge.
 */

(function() {
  'use strict';

  // 1. Initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 2. Scroll Reveal Observer
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));

  // 3. Build Vertical Equalizer Segments in Portrait Frame
  const eqStrip = document.getElementById('portrait-eq-strip');
  const EQ_SEGMENTS = 14;
  const eqSegmentEls = [];

  if (eqStrip) {
    for (let i = 0; i < EQ_SEGMENTS; i++) {
      const seg = document.createElement('div');
      seg.className = 'w-full flex-1 rounded-xs transition-all duration-75';
      seg.style.backgroundColor = i >= 10 ? '#FF2E2E' : '#FFFFFF';
      seg.style.opacity = '0.2';
      eqStrip.appendChild(seg);
      eqSegmentEls.push(seg);
    }
  }

  // 4. Live Microphone Voice-Reactive System (Web Audio API)
  let audioCtx = null;
  let analyser = null;
  let micStream = null;
  let freqData = null;
  let isMicLive = false;
  let ambientPhase = 0;

  const micBtnLabel = document.getElementById('mic-btn-label');
  const micStatusDot = document.getElementById('mic-status-dot');
  const micTelemetryTag = document.getElementById('mic-telemetry-tag');
  const headerCutout = document.getElementById('header-avatar-cutout');
  const bannerPopout = document.getElementById('banner-popout-wrapper');
  const geoStar1 = document.getElementById('geo-star-1');
  const geoStar2 = document.getElementById('geo-star-2');
  const geoStar3 = document.getElementById('geo-star-3');

  window.toggleMicrophone = async function() {
    if (isMicLive) {
      if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
        micStream = null;
      }
      isMicLive = false;
      if (micBtnLabel) micBtnLabel.innerText = 'MIC: OFF';
      if (micStatusDot) micStatusDot.className = 'w-2 h-2 rounded-full bg-neutral-400';
      if (micTelemetryTag) micTelemetryTag.innerText = 'AUDIO: AMBIENT';
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API unavailable');
      }
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      freqData = new Uint8Array(analyser.frequencyBinCount);
      isMicLive = true;

      if (micBtnLabel) micBtnLabel.innerText = 'MIC: LIVE';
      if (micStatusDot) micStatusDot.className = 'w-2 h-2 rounded-full bg-[#FF2E2E] animate-ping';
      if (micTelemetryTag) micTelemetryTag.innerText = 'AUDIO: LIVE VOICE';
    } catch (err) {
      // Smooth fallback if permissions blocked
      if (micBtnLabel) micBtnLabel.innerText = 'MIC: DEMO';
      if (micStatusDot) micStatusDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
      if (micTelemetryTag) micTelemetryTag.innerText = 'AUDIO: SIMULATED';
    }
  };

  function animatePortfolioAudio() {
    ambientPhase += 0.06;
    let energy = 0;
    let bass = 0;
    let mid = 0;
    let treble = 0;

    if (isMicLive && analyser && freqData) {
      analyser.getByteFrequencyData(freqData);
      let sum = 0;
      for (let i = 0; i < freqData.length; i++) {
        sum += freqData[i];
      }
      energy = Math.min(1, (sum / freqData.length) / 140);
      bass = (freqData[1] || 0) / 255;
      mid = (freqData[6] || 0) / 255;
      treble = (freqData[12] || 0) / 255;
    } else {
      const demoBoost = (micBtnLabel && micBtnLabel.innerText === 'MIC: DEMO') ? 2.2 : 1.0;
      energy = ((Math.sin(ambientPhase) + 1) * 0.14) * demoBoost;
      bass = ((Math.sin(ambientPhase * 1.1) + 1) * 0.16) * demoBoost;
      mid = ((Math.cos(ambientPhase * 1.4) + 1) * 0.14) * demoBoost;
      treble = ((Math.sin(ambientPhase * 1.8) + 1) * 0.12) * demoBoost;
    }

    // Set CSS custom property for red glow drop-shadow
    document.documentElement.style.setProperty('--mic-energy', energy.toFixed(3));

    // 1. Animate Equalizer Segments
    if (eqSegmentEls.length > 0) {
      const activeLitCount = Math.max(2, Math.round(energy * EQ_SEGMENTS));
      eqSegmentEls.forEach((seg, idx) => {
        seg.style.opacity = idx < activeLitCount ? '0.95' : '0.18';
      });
    }

    // 2. Animate Geometric Vector Stars
    const rot1 = (ambientPhase * 14) + bass * 45;
    const scale1 = 1 + bass * 0.35;
    const scale2 = 1 + mid * 0.38;
    const rot3 = Math.sin(ambientPhase) * 10 + treble * 30;
    const scale3 = 1 + treble * 0.32;

    if (geoStar1) geoStar1.style.transform = `rotate(${rot1}deg) scale(${scale1})`;
    if (geoStar2) geoStar2.style.transform = `scale(${scale2})`;
    if (geoStar3) geoStar3.style.transform = `rotate(${rot3}deg) scale(${scale3})`;

    // 3. Header Cutout & Banner Pop-out Portrait Pulse
    if (headerCutout) {
      headerCutout.style.transform = `scale(${1 + bass * 0.08})`;
    }
    if (bannerPopout) {
      bannerPopout.style.transform = `scale(${1 + energy * 0.06}) translateY(${-energy * 4}px)`;
    }

    requestAnimationFrame(animatePortfolioAudio);
  }
  animatePortfolioAudio();

  // 5. Interactive Idea Notebook Cycler
  const notebookIdeas = [
    {
      title: "IDEA #01: AUTONOMOUS SOFTWARE FACTORY",
      desc: "Spark2Ship engine transforming software specifications into fully deployed cloud architectures with verified CI/CD, DNS provisioning, and load balancing.",
      page: "01 / 04"
    },
    {
      title: "IDEA #02: PROTOCOL IPC BRIDGE",
      desc: "sabhyam-ai-mcp Model Context Protocol server uniting Claude Code, Antigravity, and Codex with shared memory and digital twin orchestration over standard IO.",
      page: "02 / 04"
    },
    {
      title: "IDEA #03: CONTACTLESS rPPG CARDIO PULSE MONITOR",
      desc: "Optical contactless photoplethysmography extracting pulse rate and HRV metrics in real time via cascaded Butterworth biquad IIR bandpass filters and Hanning window FFT.",
      page: "03 / 04"
    },
    {
      title: "IDEA #04: FIRST-PRINCIPLES SPATIAL NEURAL CV LABS",
      desc: "Browser-native 60 FPS computer vision pipelines operating with 468 facial mesh landmarks, 21 hand joints, and Web Audio anime audio synthesis.",
      page: "04 / 04"
    }
  ];
  let currentIdeaIdx = 0;

  window.cycleNotebookIdea = function() {
    currentIdeaIdx = (currentIdeaIdx + 1) % notebookIdeas.length;
    const item = notebookIdeas[currentIdeaIdx];
    const titleEl = document.getElementById('notebook-idea-title');
    const descEl = document.getElementById('notebook-idea-desc');
    const pageEl = document.getElementById('notebook-page-number');

    if (titleEl) titleEl.innerText = item.title;
    if (descEl) descEl.innerText = item.desc;
    if (pageEl) pageEl.innerText = item.page;
  };

  // 6. Direct Email Copy with Toast Notification
  window.copyEmailAddress = function() {
    const email = 'sabhyamtrivedy@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
      }).catch(() => {
        showToast('sabhyamtrivedy@gmail.com');
      });
    } else {
      showToast('sabhyamtrivedy@gmail.com');
    }
  };

  function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 7. Interactive 3D Hardcover Book Details Matrix
  const bookData = {
    'steve-jobs': {
      title: 'Steve Jobs',
      author: 'WALTER ISAACSON',
      insight: 'The intersection of technology and liberal arts. Uncompromising obsession with tactile product elegance, internal system beauty, and creating products that feel alive.'
    },
    'zero-to-one': {
      title: 'Zero to One',
      author: 'PETER THIEL',
      insight: 'Vertical progress and building proprietary technology that is 10x superior. Escaping commoditization through vertical integration and bold contrarian execution.'
    },
    'build-dont-talk': {
      title: "Build, Don't Talk",
      author: 'RAJ SHAMANI',
      insight: 'Speed of execution over endless deliberation. Raw building, authentic communication, and learning by putting working software into production.'
    }
  };

  window.openBook = function(bookKey) {
    const data = bookData[bookKey];
    if (!data) return;

    const modal = document.getElementById('book-detail-modal');
    const authorEl = document.getElementById('modal-book-author');
    const titleEl = document.getElementById('modal-book-title');
    const insightEl = document.getElementById('modal-book-insight');

    if (modal && authorEl && titleEl && insightEl) {
      authorEl.textContent = data.author;
      titleEl.textContent = data.title;
      insightEl.textContent = data.insight;
      modal.classList.add('active');
    }
  };

  window.closeBook = function() {
    const modal = document.getElementById('book-detail-modal');
    if (modal) modal.classList.remove('active');
  };

  window.closeBookOnBackdrop = function(e) {
    if (e.target && e.target.id === 'book-detail-modal') {
      window.closeBook();
    }
  };

  // 8. Interactive Vision Lab In-Page Modal (Zero URL navigation)
  let visionAnimId = null;

  window.openVisionModal = function() {
    const modal = document.getElementById('vision-lab-modal');
    if (!modal) return;
    modal.classList.add('active');
    startVisionCanvasSimulation();
  };

  window.closeVisionModal = function() {
    const modal = document.getElementById('vision-lab-modal');
    if (!modal) return;
    modal.classList.remove('active');
    if (visionAnimId) {
      cancelAnimationFrame(visionAnimId);
      visionAnimId = null;
    }
  };

  window.closeVisionOnBackdrop = function(e) {
    if (e.target && e.target.id === 'vision-lab-modal') {
      window.closeVisionModal();
    }
  };

  function startVisionCanvasSimulation() {
    const canvas = document.getElementById('vision-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    function render() {
      frame++;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw faint HUD grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw simulated facial landmark mesh
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const pulse = Math.sin(frame * 0.05) * 6;

      ctx.strokeStyle = '#10b981';
      ctx.fillStyle = '#34d399';
      ctx.lineWidth = 1.2;

      // Facial oval topology
      ctx.beginPath();
      ctx.ellipse(cx, cy, 80 + pulse, 110, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eye landmarks
      ctx.beginPath();
      ctx.arc(cx - 32, cy - 20, 10, 0, Math.PI * 2);
      ctx.arc(cx + 32, cy - 20, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Optical scanning sweep line
      const scanY = (frame * 3) % canvas.height;
      ctx.strokeStyle = 'rgba(255, 46, 46, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Telemetry readouts
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`FRAME: ${frame} // LATENCY: 16.4ms`, 16, 24);
      ctx.fillText(`LANDMARKS DETECTED: 468`, 16, 40);
      ctx.fillText(`rPPG PULSE: 72 BPM`, 16, 56);

      visionAnimId = requestAnimationFrame(render);
    }

    if (visionAnimId) cancelAnimationFrame(visionAnimId);
    visionAnimId = requestAnimationFrame(render);
  }

  // 9. Mascot Emotion Trigger Bridge
  window.triggerEmotion = function(emotion) {
    if (typeof window.triggerMascotEmotion === 'function') {
      window.triggerMascotEmotion(emotion);
    }
  };

  // 10. Initialize Mascot
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.createSabhyamMascot === 'function') {
      window.createSabhyamMascot('sabhyam-mascot-hero', {
        size: 210,
        directions: 'assets/mascots/sabhyam-directions.webp?v=5.0',
        reactions: 'assets/mascots/sabhyam-reactions.webp?v=5.0'
      });
    }
  });

})();
