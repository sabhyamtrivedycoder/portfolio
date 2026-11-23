/**
 * Sabhyam Trivedy - Flagship Portfolio Interactive Engine
 * Tactile Skeuomorphism, Ambient Audio Synthesizer, Real-time Clock,
 * and Mascot Controller.
 */

(function initPortfolio() {
  'use strict';

  // --- Real-time IST Clock for Floating Dock ---
  function updateDockClock() {
    const clockEl = document.getElementById('dock-clock');
    if (!clockEl) return;
    const now = new Date();
    // Format in IST (UTC+5:30)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockEl.textContent = new Intl.DateTimeFormat('en-GB', options).format(now) + ' IST';
  }
  setInterval(updateDockClock, 1000);
  updateDockClock();

  // --- Ambient Web Audio Flow Synthesizer (William Le Inspired) ---
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let oscNodes = [];

  function initAudioEngine() {
    if (audioCtx) return;
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  function startAmbientFrequencies() {
    initAudioEngine();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Generate warm 432Hz ambient chord (C# minor / deep flow frequencies)
    const freqs = [108, 162, 216, 324];
    oscNodes = freqs.map((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.015 / (i + 1), audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      return { osc, gain };
    });

    isPlaying = true;
    updateSoundCapsuleUI();
  }

  function stopAmbientFrequencies() {
    if (!audioCtx) return;
    oscNodes.forEach(({ osc }) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    oscNodes = [];
    isPlaying = false;
    updateSoundCapsuleUI();
  }

  function toggleSound() {
    if (isPlaying) {
      stopAmbientFrequencies();
    } else {
      startAmbientFrequencies();
    }
  }

  function updateSoundCapsuleUI() {
    const capsule = document.getElementById('sound-capsule');
    const label = document.getElementById('sound-label');
    if (!capsule || !label) return;

    if (isPlaying) {
      capsule.classList.remove('paused');
      label.textContent = 'Flow Synth • Playing';
    } else {
      capsule.classList.add('paused');
      label.textContent = 'Ambient Flow • Sound On';
    }
  }

  const soundBtn = document.getElementById('sound-capsule');
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleSound);
  }

  // --- Interactive Bookshelf Reader Modal / Detail ---
  const bookNotes = {
    'sicp': {
      title: 'Structure and Interpretation of Computer Programs',
      author: 'Harold Abelson & Gerald Jay Sussman',
      insight: 'Taught me that programs must be written for people to read, and only incidentally for machines to execute. Mastered recursive process decomposition and meta-linguistic abstraction.'
    },
    'everyday': {
      title: 'The Design of Everyday Things',
      author: 'Don Norman',
      insight: 'Affordances, signifiers, and mental models. Every software system I architect is built with intuitive feedback loops and tactile clarity.'
    },
    'deep-learning': {
      title: 'Deep Learning',
      author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
      insight: 'The mathematical bedrock behind neural network backpropagation, representation learning, and real-time computer vision DSP pipelines.'
    },
    'zero-to-one': {
      title: 'Zero to One',
      author: 'Peter Thiel',
      insight: 'Building proprietary technology that is 10x better than existing alternatives. The operational catalyst behind founding HoloVerse AI and Spark2Ship.'
    },
    'crafting-interpreters': {
      title: 'Crafting Interpreters',
      author: 'Robert Nystrom',
      insight: 'Architecting bytecode virtual machines, AST evaluation, and lexical parsers from scratch in C and Java.'
    }
  };

  window.inspectBook = function(bookId) {
    const data = bookNotes[bookId];
    if (!data) return;

    const overlay = document.getElementById('book-inspect-modal');
    const titleEl = document.getElementById('modal-book-title');
    const authorEl = document.getElementById('modal-book-author');
    const insightEl = document.getElementById('modal-book-insight');

    if (overlay && titleEl && authorEl && insightEl) {
      titleEl.textContent = data.title;
      authorEl.textContent = 'BY ' + data.author.toUpperCase();
      insightEl.textContent = data.insight;
      overlay.style.display = 'flex';
    }
  };

  window.closeBookModal = function() {
    const overlay = document.getElementById('book-inspect-modal');
    if (overlay) overlay.style.display = 'none';
  };

  // --- Initialize Cursor-Tracking Mascot ---
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.createSabhyamMascot === 'function') {
      window.createSabhyamMascot('sabhyam-mascot-dock', {
        size: 155,
        directions: 'assets/mascots/sabhyam-directions.webp',
        reactions: 'assets/mascots/sabhyam-reactions.webp'
      });
    }
  });

})();
