/**
 * Sabhaym Mascot - Cursor-Tracking & Interactive Chibi Mascot
 * Adapted from page-mascot (Three-by-Three directional & reaction WebP atlases)
 * Featuring tactile audio boops and external reaction API.
 */
(function initMascot() {
  const DIRECTIONS = [
    'up-left', 'up', 'up-right',
    'left', 'center', 'right',
    'down-left', 'down', 'down-right'
  ];

  const REACTIONS = [
    'blink', 'heart', 'sparkle',
    'surprised', 'wink', 'bashful',
    'sleepy', 'dizzy', 'delighted'
  ];

  const CLOCKWISE = [
    'right', 'down-right', 'down', 'down-left',
    'left', 'up-left', 'up', 'up-right'
  ];

  const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
  const HYSTERESIS = 0.12;
  const DEAD_ZONE = 70;

  const PAYOFFS = ['heart', 'sparkle', 'delighted'];
  const BOOP_PAYOFF = 120;
  const BOOP_END = 700;
  const SQUASH_MS = 420;
  const DIZZY_AFTER = 4;
  const DIZZY_WINDOW = 1600;
  const DIZZY_END = 1100;

  const SQUASH = [
    { transform: 'scale(1, 1)', easing: 'ease-in' },
    { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
    { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
    { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
    { transform: 'scale(1, 1)' }
  ];

  function getCellPos(index) {
    const x = (index % 3) * 50;
    const y = Math.floor(index / 3) * 50;
    return `${x}% ${y}%`;
  }

  function wrap(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  // Web Audio boop synthesizer
  function playBoopSound(freq = 560) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  window.createSabhyamMascot = function(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = options.size || 210;
    const directionsUrl = options.directions || 'assets/mascots/sabhyam-directions.webp';
    const reactionsUrl = options.reactions || 'assets/mascots/sabhyam-reactions.webp';

    container.innerHTML = `
      <button type="button" class="mascot-btn" aria-label="Boop Sabhaym Mascot" style="
        position: relative;
        display: inline-block;
        width: ${size}px;
        height: ${size}px;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        user-select: none;
        outline: none;
        filter: drop-shadow(0 14px 28px rgba(31, 24, 61, 0.35));
        transition: transform 0.2s ease;
      ">
        <span class="mascot-squash" style="
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          transform-origin: 50% 78%;
        ">
          <span class="mascot-directions" style="
            position: absolute;
            inset: 0;
            background-image: url('${directionsUrl}');
            background-size: 300% 300%;
            background-repeat: no-repeat;
            background-position: ${getCellPos(4)};
            opacity: 1;
            transition: opacity 0.1s ease;
          "></span>
          <span class="mascot-reactions" style="
            position: absolute;
            inset: 0;
            background-image: url('${reactionsUrl}');
            background-size: 300% 300%;
            background-repeat: no-repeat;
            background-position: ${getCellPos(0)};
            opacity: 0;
            transition: opacity 0.1s ease;
          "></span>
        </span>
      </button>
    `;

    const button = container.querySelector('.mascot-btn');
    const squash = container.querySelector('.mascot-squash');
    const dirLayer = container.querySelector('.mascot-directions');
    const reactLayer = container.querySelector('.mascot-reactions');

    let sector = -1;
    let pointer = null;
    let currentDirection = 'center';
    let currentReaction = null;
    let timers = [];
    const boops = { count: 0, at: 0 };

    function setDir(d) {
      if (currentDirection === d) return;
      currentDirection = d;
      const idx = DIRECTIONS.indexOf(d);
      if (idx !== -1) {
        dirLayer.style.backgroundPosition = getCellPos(idx);
      }
    }

    function setReact(r) {
      currentReaction = r;
      if (r) {
        const idx = REACTIONS.indexOf(r);
        reactLayer.style.backgroundPosition = getCellPos(idx !== -1 ? idx : 0);
        reactLayer.style.opacity = '1';
        dirLayer.style.opacity = '0';
      } else {
        reactLayer.style.opacity = '0';
        dirLayer.style.opacity = '1';
      }
    }

    function aim() {
      if (!pointer || currentReaction) return;
      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDir('center');
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) {
        return;
      }

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDir(CLOCKWISE[sector]);
    }

    window.addEventListener('pointermove', (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      aim();
    }, { passive: true });

    window.addEventListener('scroll', aim, { passive: true });

    function triggerBoop() {
      timers.forEach(clearTimeout);
      timers = [];

      const later = (ms, next) => {
        timers.push(setTimeout(() => setReact(next), ms));
      };

      const now = Date.now();
      boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
      boops.at = now;

      playBoopSound(580 + (boops.count % 4) * 80);

      if (boops.count >= DIZZY_AFTER) {
        boops.count = 0;
        setReact('dizzy');
        later(DIZZY_END, null);
      } else {
        setReact('blink');
        later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
        later(BOOP_END, null);
      }

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        squash.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
      }
    }

    button.addEventListener('click', triggerBoop);

    // Expose reaction trigger
    window.triggerMascotEmotion = function(emotion) {
      timers.forEach(clearTimeout);
      timers = [];
      setReact(emotion);
      playBoopSound(640);
      squash.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
      timers.push(setTimeout(() => setReact(null), 1800));
    };
  };
})();
