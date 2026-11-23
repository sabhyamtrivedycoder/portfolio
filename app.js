/**
 * Sabhyam Trivedy - 3D Immersive Portfolio Engine
 * Interactive 3D Book Inspector & Mascot Initializer
 */

(function() {
  'use strict';

  const bookData = {
    'steve-jobs': {
      title: 'Steve Jobs',
      author: 'WALTER ISAACSON',
      insight: 'The intersection of technology and liberal arts. Relentless focus on end-to-end integration of hardware, software, and pure aesthetic simplicity.'
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
    },
    'the-mom-test': {
      title: 'The Mom Test',
      author: 'ROB FITZPATRICK',
      insight: 'How to ask genuine customer questions that reveal actual user behavior rather than polite compliments.'
    },
    'refactoring-ui': {
      title: 'Refactoring UI',
      author: 'ADAM WATHAN & STEVE SCHOGER',
      insight: 'Designing with hierarchy, subtle depth, intentional white-space, and tactile craftsmanship rather than default framework components.'
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

  // Initialize Mascot
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.createSabhyamMascot === 'function') {
      window.createSabhyamMascot('sabhyam-mascot-hero', {
        size: 165,
        directions: 'assets/mascots/sabhyam-directions.webp',
        reactions: 'assets/mascots/sabhyam-reactions.webp'
      });
    }
  });

})();
