/**
 * Sabhaym Trivedi - 3D Immersive Portfolio Engine
 * Dynamic 3D Cursor Parallax, Interactive 3D Card Tilt,
 * Physical Book Inspector & Mascot Companion Controller.
 */

(function() {
  'use strict';

  // --- Dynamic 3D Mouse Parallax Engine ---
  const balloon = document.querySelector('.floating-balloon');
  const cloudRight = document.querySelector('.cloud-hero-right');
  const cloudLeft = document.querySelector('.cloud-hero-left');
  const heroTitle = document.querySelector('.hero-name-sculpted');
  const speechBubble = document.querySelector('.mascot-speech-bubble');
  const butterflyScene = document.querySelector('.butterfly-3d-scene');

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (balloon) {
      balloon.style.transform = `translate3d(${dx * -45}px, ${dy * -32}px, 0) rotateZ(${dx * 6}deg) rotateY(${dx * 8}deg)`;
    }
    if (cloudRight) {
      cloudRight.style.transform = `translate3d(${dx * -35}px, ${dy * -22}px, 0)`;
    }
    if (cloudLeft) {
      cloudLeft.style.transform = `translate3d(${dx * 30}px, ${dy * 20}px, 0)`;
    }
    if (heroTitle) {
      heroTitle.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(30px)`;
    }
    if (speechBubble) {
      speechBubble.style.transform = `translate3d(${dx * 16}px, ${dy * 10}px, 0)`;
    }
    if (butterflyScene) {
      butterflyScene.style.transform = `perspective(900px) rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg) translateZ(${Math.abs(dx) * 25}px)`;
    }
  });

  // --- Interactive 3D Card Tilt ---
  function apply3DTilt(element, maxAngle = 12) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * 2;

      element.style.transform = `perspective(800px) rotateY(${xPct * maxAngle}deg) rotateX(${-yPct * maxAngle}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  }

  // Apply tilt to consoles, polaroids & world clock cards
  document.querySelectorAll('.pocket-console-chassis').forEach(el => apply3DTilt(el, 8));
  document.querySelectorAll('.polaroid-frame').forEach(el => apply3DTilt(el, 14));
  document.querySelectorAll('.chronometer-hero-card').forEach(el => apply3DTilt(el, 5));
  document.querySelectorAll('.hub-3d-card').forEach(el => apply3DTilt(el, 10));

  // --- 3D World Clock & Tech Hub Time Engine ---
  const HUBS = [
    {
      id: 'india',
      tz: 'Asia/Kolkata',
      digitalEl: 'digital-india-time',
      dateEl: 'digital-india-date',
      hands: { hour: 'hand-india-hour', minute: 'hand-india-minute', second: 'hand-india-second' }
    },
    {
      id: 'sf',
      tz: 'America/Los_Angeles',
      digitalEl: 'digital-sf-time',
      subEl: 'digital-sf-sub',
      hands: { hour: 'hand-sf-hour', minute: 'hand-sf-minute', second: 'hand-sf-second' }
    },
    {
      id: 'nyc',
      tz: 'America/New_York',
      digitalEl: 'digital-nyc-time',
      subEl: 'digital-nyc-sub',
      hands: { hour: 'hand-nyc-hour', minute: 'hand-nyc-minute', second: 'hand-nyc-second' }
    },
    {
      id: 'london',
      tz: 'Europe/London',
      digitalEl: 'digital-london-time',
      subEl: 'digital-london-sub',
      hands: { hour: 'hand-london-hour', minute: 'hand-london-minute', second: 'hand-london-second' }
    },
    {
      id: 'tokyo',
      tz: 'Asia/Tokyo',
      digitalEl: 'digital-tokyo-time',
      subEl: 'digital-tokyo-sub',
      hands: { hour: 'hand-tokyo-hour', minute: 'hand-tokyo-minute', second: 'hand-tokyo-second' }
    },
    {
      id: 'sg',
      tz: 'Asia/Singapore',
      digitalEl: 'digital-sg-time',
      subEl: 'digital-sg-sub',
      hands: { hour: 'hand-sg-hour', minute: 'hand-sg-minute', second: 'hand-sg-second' }
    }
  ];

  function updateClocks() {
    const now = new Date();

    HUBS.forEach(hub => {
      try {
        // Format time in target timezone
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: hub.tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        const parts = timeFormatter.formatToParts(now);
        let h = 0, m = 0, s = 0;
        parts.forEach(p => {
          if (p.type === 'hour') h = parseInt(p.value, 10);
          if (p.type === 'minute') m = parseInt(p.value, 10);
          if (p.type === 'second') s = parseInt(p.value, 10);
        });

        // Update analog hands
        const secDeg = s * 6;
        const minDeg = m * 6 + s * 0.1;
        const hrDeg = (h % 12) * 30 + m * 0.5;

        const handSec = document.getElementById(hub.hands.second);
        const handMin = document.getElementById(hub.hands.minute);
        const handHr = document.getElementById(hub.hands.hour);

        if (handSec) handSec.style.transform = `rotate(${secDeg}deg)`;
        if (handMin) handMin.style.transform = `rotate(${minDeg}deg)`;
        if (handHr) handHr.style.transform = `rotate(${hrDeg}deg)`;

        // Update digital display
        const digEl = document.getElementById(hub.digitalEl);
        if (digEl) {
          if (hub.id === 'india') {
            const pad = n => String(n).padStart(2, '0');
            digEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
          } else {
            const pad = n => String(n).padStart(2, '0');
            digEl.textContent = `${pad(h)}:${pad(m)}`;
          }
        }

        // Update date for India master
        if (hub.dateEl) {
          const dateEl = document.getElementById(hub.dateEl);
          if (dateEl) {
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: hub.tz,
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
            dateEl.textContent = dateFormatter.format(now);
          }
        }
      } catch (e) {
        console.warn(`Timezone update failed for ${hub.id}:`, e);
      }
    });
  }

  // --- Interactive 3D Focus Chronometer (Stopwatch) ---
  let swStartTime = 0;
  let swElapsedTime = 0;
  let swRunning = false;
  let swRafId = null;

  const swHoursEl = document.getElementById('sw-hours');
  const swMinutesEl = document.getElementById('sw-minutes');
  const swSecondsEl = document.getElementById('sw-seconds');
  const swFractionEl = document.getElementById('sw-fraction');
  const swToggleBtn = document.getElementById('btn-sw-toggle');
  const swResetBtn = document.getElementById('btn-sw-reset');

  function renderStopwatch() {
    const totalMs = swRunning ? (swElapsedTime + (performance.now() - swStartTime)) : swElapsedTime;

    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const fraction = Math.floor((totalMs % 1000) / 10);

    const pad = n => String(n).padStart(2, '0');

    if (swHoursEl) swHoursEl.textContent = pad(hours);
    if (swMinutesEl) swMinutesEl.textContent = pad(minutes);
    if (swSecondsEl) swSecondsEl.textContent = pad(seconds);
    if (swFractionEl) swFractionEl.textContent = pad(fraction);

    if (swRunning) {
      swRafId = requestAnimationFrame(renderStopwatch);
    }
  }

  if (swToggleBtn) {
    swToggleBtn.addEventListener('click', () => {
      if (!swRunning) {
        swRunning = true;
        swStartTime = performance.now();
        swToggleBtn.textContent = 'Pause Focus';
        swToggleBtn.classList.add('active');
        swRafId = requestAnimationFrame(renderStopwatch);
      } else {
        swRunning = false;
        swElapsedTime += (performance.now() - swStartTime);
        swToggleBtn.textContent = 'Resume Focus';
        swToggleBtn.classList.remove('active');
        if (swRafId) cancelAnimationFrame(swRafId);
      }
    });
  }

  if (swResetBtn) {
    swResetBtn.addEventListener('click', () => {
      swRunning = false;
      swStartTime = 0;
      swElapsedTime = 0;
      if (swRafId) cancelAnimationFrame(swRafId);
      if (swToggleBtn) {
        swToggleBtn.textContent = 'Start Focus';
        swToggleBtn.classList.remove('active');
      }
      renderStopwatch();
    });
  }

  // Start World Clocks
  updateClocks();
  setInterval(updateClocks, 1000);

  // --- 3 Books Matrix ---
  const bookData = {
    'steve-jobs': {
      title: 'Steve Jobs',
      author: 'WALTER ISAACSON',
      insight: 'The intersection of technology and the liberal arts. Relentless focus on end-to-end integration of hardware, software, and pure aesthetic simplicity.'
    },
    'zero-to-one': {
      title: 'Zero to One: Notes on Startups',
      author: 'PETER THIEL WITH BLAKE MASTERS',
      insight: 'Creating things that have never existed before (0 to 1) rather than copying existing models (1 to n). The core catalyst behind Spark2Ship and my software engineering ventures.'
    },
    'build-dont-talk': {
      title: "Build, Don't Talk",
      author: 'RAJ SHAMANI',
      insight: 'Speed of execution over endless deliberation. Raw building, authentic communication, and learning by putting working software into production.'
    }
  };

  window.openBook = function(key) {
    const data = bookData[key];
    if (!data) return;

    const modal = document.getElementById('book-detail-modal');
    const authorEl = document.getElementById('modal-book-author');
    const titleEl = document.getElementById('modal-book-title');
    const insightEl = document.getElementById('modal-book-insight');

    if (modal && authorEl && titleEl && insightEl) {
      authorEl.textContent = data.author;
      titleEl.textContent = data.title;
      insightEl.textContent = data.insight;
      modal.style.display = 'flex';
    }
  };

  window.closeBook = function() {
    const modal = document.getElementById('book-detail-modal');
    if (modal) modal.style.display = 'none';
  };

  // Helper for mascot emotion buttons
  window.triggerEmotion = function(emotion) {
    if (typeof window.triggerMascotEmotion === 'function') {
      window.triggerMascotEmotion(emotion);
    }
  };

  // Initialize Mascot with enhanced size
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.createSabhyamMascot === 'function') {
      window.createSabhyamMascot('sabhyam-mascot-hero', {
        size: 210,
        directions: 'assets/mascots/sabhyam-directions.webp?v=4.2',
        reactions: 'assets/mascots/sabhyam-reactions.webp?v=4.2'
      });
    }
  });

})();
