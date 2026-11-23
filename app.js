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

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (balloon) {
      balloon.style.transform = `translate3d(${dx * 35}px, ${dy * 30}px, 0) rotate(${dx * 4}deg)`;
    }
    if (cloudRight) {
      cloudRight.style.transform = `translate3d(${dx * -25}px, ${dy * -18}px, 0)`;
    }
    if (cloudLeft) {
      cloudLeft.style.transform = `translate3d(${dx * 20}px, ${dy * 15}px, 0)`;
    }
    if (heroTitle) {
      heroTitle.style.transform = `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(25px)`;
    }
    if (speechBubble) {
      speechBubble.style.transform = `translate3d(${dx * 12}px, ${dy * 8}px, 0)`;
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

  // Apply tilt to consoles & polaroids
  document.querySelectorAll('.pocket-console-chassis').forEach(el => apply3DTilt(el, 8));
  document.querySelectorAll('.polaroid-frame').forEach(el => apply3DTilt(el, 14));

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
