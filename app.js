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

  // Apply tilt to consoles, polaroids & 3D gramophone
  document.querySelectorAll('.pocket-console-chassis').forEach(el => apply3DTilt(el, 8));
  document.querySelectorAll('.polaroid-frame').forEach(el => apply3DTilt(el, 14));
  document.querySelectorAll('.gramophone-3d-station').forEach(el => apply3DTilt(el, 12));

  // --- Formative Wisdom & Acoustic History Matrix ---
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
    },
    'gramophone': {
      title: 'Emile Berliner Gramophone (1887)',
      author: 'ACOUSTIC REPRODUCTION & ANALOG DISC RECORDING',
      insight: 'The foundational transition from wax cylinders to flat analog disc records. Pure acoustic amplification through a flared brass horn with zero electrical circuitry, relying entirely on physical groove vibrations, spring-wound governors, and acoustic horn impedance matching.'
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

  // ==========================================================================
  // Interactive Berliner Gramophone Audio & Physics Engine
  // ==========================================================================
  let gramophoneAudioCtx = null;
  let isGramophonePlaying = false;
  let vinylNoiseSource = null;
  let chordTimer = null;
  let noteEmitterTimer = null;
  let masterGain = null;
  let filterNode = null;
  let activeOscillators = [];

  // Nostalgic analog chord progression (vintage warm jazz / lo-fi frequencies)
  const gramophoneChords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7: C4, E4, G4, B4
    [220.00, 261.63, 329.63, 392.00], // Am7:   A3, C4, E4, G4
    [293.66, 349.23, 440.00, 523.25], // Dm7:   D4, F4, A4, C5
    [196.00, 246.94, 293.66, 349.23], // G7:    G3, B3, D4, F4
    [164.81, 246.94, 329.63, 392.00], // Em7:   E3, B3, E4, G4
    [220.00, 277.18, 329.63, 392.00], // A7:    A3, C#4, E4, G4
    [146.83, 220.00, 261.63, 349.23], // Dm9:   D3, A3, C4, F4
    [196.00, 246.94, 329.63, 440.00]  // G13:   G3, B3, E4, A4
  ];
  let currentChordIndex = 0;

  function initGramophoneAudio() {
    if (!gramophoneAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      gramophoneAudioCtx = new AudioCtx();
    }
    if (gramophoneAudioCtx.state === 'suspended') {
      gramophoneAudioCtx.resume();
    }
  }

  // Create authentic vinyl crackle and surface hiss
  function startVinylNoise() {
    if (!gramophoneAudioCtx) return;
    const bufferSize = Math.floor(gramophoneAudioCtx.sampleRate * 2.5);
    const noiseBuffer = gramophoneAudioCtx.createBuffer(1, bufferSize, gramophoneAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      let sample = (Math.random() * 2 - 1) * 0.015;
      if (Math.random() > 0.996) {
        sample += (Math.random() * 2 - 1) * 0.18;
      }
      output[i] = sample;
    }

    vinylNoiseSource = gramophoneAudioCtx.createBufferSource();
    vinylNoiseSource.buffer = noiseBuffer;
    vinylNoiseSource.loop = true;

    const noiseFilter = gramophoneAudioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1600;
    noiseFilter.Q.value = 1.2;

    const noiseGain = gramophoneAudioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.35, gramophoneAudioCtx.currentTime);

    vinylNoiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(gramophoneAudioCtx.destination);

    vinylNoiseSource.start();
  }

  function stopVinylNoise() {
    if (vinylNoiseSource) {
      try {
        vinylNoiseSource.stop();
        vinylNoiseSource.disconnect();
      } catch (err) {}
      vinylNoiseSource = null;
    }
  }

  // Trigger needle drop thump
  function playNeedleDrop() {
    if (!gramophoneAudioCtx) return;
    const osc = gramophoneAudioCtx.createOscillator();
    const gain = gramophoneAudioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, gramophoneAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, gramophoneAudioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.4, gramophoneAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, gramophoneAudioCtx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(gramophoneAudioCtx.destination);

    osc.start();
    osc.stop(gramophoneAudioCtx.currentTime + 0.15);
  }

  // Play next warm chord in progression
  function playNextChord() {
    if (!isGramophonePlaying || !gramophoneAudioCtx) return;
    const now = gramophoneAudioCtx.currentTime;
    const chord = gramophoneChords[currentChordIndex % gramophoneChords.length];
    currentChordIndex++;

    if (!filterNode) {
      filterNode = gramophoneAudioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 1500;
      filterNode.Q.value = 2.0;

      masterGain = gramophoneAudioCtx.createGain();
      masterGain.gain.setValueAtTime(0.22, now);

      filterNode.connect(masterGain);
      masterGain.connect(gramophoneAudioCtx.destination);
    }

    chord.forEach((freq, idx) => {
      const osc = gramophoneAudioCtx.createOscillator();
      const noteGain = gramophoneAudioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const flutter = (Math.random() - 0.5) * 4;
      osc.detune.setValueAtTime(flutter, now);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.08 / chord.length, now + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

      osc.connect(noteGain);
      noteGain.connect(filterNode);

      osc.start(now);
      osc.stop(now + 2.4);
      activeOscillators.push(osc);
    });

    setTimeout(() => {
      activeOscillators = activeOscillators.slice(chord.length);
    }, 2500);
  }

  // Emit floating SVG musical note from horn
  function emitMusicalNote() {
    const emitter = document.getElementById('gramophone-notes');
    if (!emitter || !isGramophonePlaying) return;

    const note = document.createElement('div');
    note.className = 'floating-musical-note';

    const isDouble = Math.random() > 0.5;
    const svgPath = isDouble
      ? '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>'
      : '<path d="M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>';

    note.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">${svgPath}</svg>`;

    const dx = (Math.random() - 0.5) * 20;
    note.style.left = `${dx}px`;

    emitter.appendChild(note);

    setTimeout(() => {
      if (note.parentNode) {
        note.parentNode.removeChild(note);
      }
    }, 2900);
  }

  window.toggleGramophone = function() {
    initGramophoneAudio();

    const station = document.getElementById('gramophone-station');
    const floatBtn = document.getElementById('floating-gramophone-btn');
    const statusText = document.getElementById('gramophone-status-text');
    const floatState = document.getElementById('floating-gramophone-state');
    const manualBtn = document.getElementById('gramophone-manual-btn');
    const manualLabel = document.getElementById('manual-btn-label');

    if (!isGramophonePlaying) {
      isGramophonePlaying = true;
      if (window.Gramophone3D) {
        window.Gramophone3D.setPlaying(true);
      }
      playNeedleDrop();
      startVinylNoise();

      currentChordIndex = 0;
      playNextChord();
      chordTimer = setInterval(playNextChord, 2200);

      emitMusicalNote();
      noteEmitterTimer = setInterval(emitMusicalNote, 1100);

      if (station) station.classList.add('is-playing');
      if (floatBtn) floatBtn.classList.add('is-active');
      if (manualBtn) manualBtn.classList.add('is-active');
      if (manualLabel) manualLabel.textContent = 'PAUSE RECORD';
      if (statusText) statusText.textContent = 'PLAYING • 78 RPM';
      if (floatState) floatState.textContent = 'PLAYING';
    } else {
      isGramophonePlaying = false;
      if (window.Gramophone3D) {
        window.Gramophone3D.setPlaying(false);
      }

      if (chordTimer) {
        clearInterval(chordTimer);
        chordTimer = null;
      }
      if (noteEmitterTimer) {
        clearInterval(noteEmitterTimer);
        noteEmitterTimer = null;
      }

      if (masterGain && gramophoneAudioCtx) {
        masterGain.gain.exponentialRampToValueAtTime(0.0001, gramophoneAudioCtx.currentTime + 0.65);
      }
      activeOscillators.forEach(osc => {
        try {
          osc.detune.linearRampToValueAtTime(-700, gramophoneAudioCtx.currentTime + 0.65);
        } catch (e) {}
      });

      setTimeout(() => {
        stopVinylNoise();
        filterNode = null;
        masterGain = null;
      }, 700);

      if (station) station.classList.remove('is-playing');
      if (floatBtn) floatBtn.classList.remove('is-active');
      if (manualBtn) manualBtn.classList.remove('is-active');
      if (manualLabel) manualLabel.textContent = 'PLAY RECORD';
      if (statusText) statusText.textContent = 'READY • 78 RPM';
      if (floatState) floatState.textContent = 'PAUSED';
    }
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
