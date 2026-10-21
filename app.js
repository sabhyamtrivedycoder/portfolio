/**
 * Sabhyam Trivedy - Flagship Portfolio Application Script
 * Interactive filtering, demo modal previews, smooth navigation, and dynamic telemetry.
 * Author: Sabhyam Trivedy
 */

(function () {
  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cvCards = document.querySelectorAll('.cv-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cvCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Demo Modal System
  const modalOverlay = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalIframe = document.getElementById('modal-iframe');
  const modalClose = document.getElementById('modal-close');
  const modalDirectLink = document.getElementById('modal-direct-link');

  const demoMap = {
    'anime': {
      title: 'Anime Gesture Attacks (MediaPipe Hands & Web Audio FX)',
      path: '../anime-gesture-attacks/index.html'
    },
    'fitness': {
      title: 'CV Fitness Rep Counter (MediaPipe Pose Biomechanics)',
      path: '../cv-fitness-rep-counter/index.html'
    },
    'cardio': {
      title: 'CardioVision Pulse Monitor (rPPG & DSP Engine)',
      path: '../cardiovision-pulse-monitor/index.html'
    },
    'hud': {
      title: 'God\'s Eye AR HUD (Tactical Scene Analyzer & 360° Radar)',
      path: '../gods-eye-vision-hud/index.html'
    }
  };

  document.querySelectorAll('[data-demo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const demoKey = btn.getAttribute('data-demo');
      const info = demoMap[demoKey];
      if (info) {
        modalTitle.textContent = info.title;
        modalIframe.src = info.path;
        modalDirectLink.href = info.path;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalIframe.src = 'about:blank';
    document.body.style.overflow = 'auto';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const msg = document.getElementById('form-msg').value;

      if (!name || !email || !msg) {
        formStatus.textContent = 'Please fill out all fields.';
        formStatus.style.color = '#ff3b30';
        return;
      }

      formStatus.textContent = `Thank you, ${name}! Your transmission has been queued for Sabhyam.`;
      formStatus.style.color = '#34d399';
      contactForm.reset();
      setTimeout(() => {
        formStatus.textContent = '';
      }, 5000);
    });
  }
})();
