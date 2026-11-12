/**
 * Dirgahayu Republik Indonesia - Independence Day Interactive Script
 * - Countdown year from 2027 down to 1945 on click
 * - Scattered yellow stars generation with micro-animations & audio chime
 * - Special 1945 Proclamation celebration milestone
 */

document.addEventListener('DOMContentLoaded', () => {
  const yearBtn = document.getElementById('year-btn');
  const yearDisplay = document.getElementById('year-display');
  const starsContainer = document.getElementById('stars-container');
  const starCounter = document.getElementById('star-counter');
  const proclamationBanner = document.getElementById('proclamation-banner');

  let currentYear = 2027;
  const minYear = 1945;
  let totalStars = 0;

  // Web Audio API Synthesizer for pleasant tactile sound feedback
  let audioCtx = null;
  function playChime(freq = 587.33, type = 'sine', duration = 0.28) {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      // Subtle pitch bend upwards
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be muted or blocked by browser policy, gracefully ignore
    }
  }

  // Play celebration chord when 1945 is reached
  function playTriumphantChord() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playChime(freq, 'triangle', 0.5);
      }, idx * 90);
    });
  }

  // Generate 5-pointed yellow star element
  function createStarElement(x, y, size, rotation) {
    const starEl = document.createElement('div');
    starEl.className = 'scatter-star';
    starEl.style.left = `${x}%`;
    starEl.style.top = `${y}%`;
    starEl.style.width = `${size}px`;
    starEl.style.height = `${size}px`;
    starEl.style.setProperty('--star-rot', `${rotation}deg`);

    // SVG star with bright gold gradient
    starEl.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="starGradient-${totalStars}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff59d" />
            <stop offset="45%" stop-color="#ffd700" />
            <stop offset="100%" stop-color="#ffb300" />
          </linearGradient>
        </defs>
        <polygon 
          points="12,1.5 15.3,8.2 22.8,9.3 17.4,14.6 18.7,22.1 12,18.6 5.3,22.1 6.6,14.6 1.2,9.3 8.7,8.2" 
          fill="url(#starGradient-${totalStars})"
        />
      </svg>
    `;

    return starEl;
  }

  // Spawn scattered yellow stars across the UI
  function spawnScatteredStars(count = 4) {
    for (let i = 0; i < count; i++) {
      totalStars++;
      
      // Random coordinates across the sky and scenery (avoiding extreme edges)
      const x = Math.floor(Math.random() * 92) + 4; // 4% to 96%
      const y = Math.floor(Math.random() * 80) + 3; // 3% to 83%

      // Random size: small sparkles (14px) to prominent shining stars (34px)
      const size = Math.floor(Math.random() * 20) + 14;
      const rotation = Math.floor(Math.random() * 360);

      const star = createStarElement(x, y, size, rotation);
      starsContainer.appendChild(star);
    }

    // Update star counter badge
    if (starCounter) {
      starCounter.textContent = totalStars;
    }
  }

  // Trigger year change and interaction
  function handleYearClick() {
    // If already at 1945, still add stars with gentle chime
    if (currentYear <= minYear) {
      spawnScatteredStars(3);
      playChime(784, 'sine', 0.25);
      triggerBounceAnim();
      return;
    }

    currentYear--;
    yearDisplay.textContent = currentYear;
    triggerBounceAnim();

    // Spawn 3 to 5 scattered yellow stars each click
    const starsToSpawn = Math.floor(Math.random() * 3) + 3;
    spawnScatteredStars(starsToSpawn);

    // Audio chime that slightly increases in pitch as we get closer to 1945
    const progress = (2027 - currentYear) / (2027 - 1945);
    const pitch = 440 + progress * 280;
    playChime(pitch, 'sine', 0.22);

    // Check if reached 1945
    if (currentYear === minYear) {
      onReach1945();
    }
  }

  // CSS bounce animation trigger
  function triggerBounceAnim() {
    yearDisplay.classList.remove('year-pop-anim');
    void yearDisplay.offsetWidth; // Force CSS reflow
    yearDisplay.classList.add('year-pop-anim');
  }

  // Historic Milestone: 1945 Reached!
  function onReach1945() {
    proclamationBanner.classList.add('show');
    
    // Celebratory burst of 25 stars!
    spawnScatteredStars(25);
    playTriumphantChord();

    // Highlight year display with golden glow
    yearDisplay.style.filter = 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)) drop-shadow(0 6px 14px rgba(186, 39, 46, 0.4))';
  }

  // Event Listeners
  yearBtn.addEventListener('click', handleYearClick);

  // Keyboard accessibility
  yearBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleYearClick();
    }
  });

  // Initial subtle sparkle of stars in the background for atmospheric beauty
  spawnScatteredStars(2);
});
