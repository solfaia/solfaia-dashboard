
// ============================================
// DAVID'S COMMAND CENTER - MUSIC SYSTEM v2
// Version B: Web Audio API (procedural ambient)
// ============================================

let audioCtx = null;
let musicEnabled = false;
let currentOscillators = [];

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  showToast(musicEnabled ? '🎵 Music enabled' : '🎵 Music disabled', 'info');
  if (!musicEnabled) {
    stopAllMusic();
  }
}

// Create ambient drone
function playAmbient(type = 'default') {
  if (!musicEnabled) return;
  
  const ctx = initAudio();
  stopAllMusic();
  
  const baseFreq = type === 'angry' ? 80 : type === 'final' ? 120 : 100;
  
  // Main drone
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = baseFreq;
  gain1.gain.value = 0.1;
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start();
  
  // Harmony
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = baseFreq * 1.5;
  gain2.gain.value = 0.05;
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start();
  
  // High shimmer
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = 'sine';
  osc3.frequency.value = baseFreq * 2;
  gain3.gain.value = 0.02;
  osc3.connect(gain3);
  gain3.connect(ctx.destination);
  osc3.start();
  
  currentOscillators = [
    { osc: osc1, gain: gain1 },
    { osc: osc2, gain: gain2 },
    { osc: osc3, gain: gain3 }
  ];
  
  // Fade in
  gain1.gain.setValueAtTime(0, ctx.currentTime);
  gain1.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 2);
}

function playStepMusic(step) {
  if (!musicEnabled) return;
  
  const ctx = initAudio();
  
  // Different music for each step
  switch(step) {
    case 1: // Angry
      playAmbient('angry');
      break;
    case 2: // Let Go
      playAmbient('letgo');
      break;
    case 7: // Final
      playAmbient('final');
      break;
    default: // Release steps
      playAmbient('release');
  }
}

function stopAllMusic() {
  currentOscillators.forEach(item => {
    try {
      item.osc.stop();
    } catch(e) {}
  });
  currentOscillators = [];
}

// For KT Manifestation:
// playStepMusic(1); // Step 1 - angry
// playStepMusic(2); // Step 2 - let go  
// playStepMusic(7); // Step 7 - final

// For Affirmations:
// playAmbient('affirmation');

console.log('🎵 Music system loaded - Version B (Web Audio API)');
