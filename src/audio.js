// audio.js — Web Audio synthesis.
// All sounds are generated on the fly from oscillators + envelopes.
// No audio files shipped, which keeps the bundle tiny and the project legally clean.

import { isMuted, onMute } from './ui.js';

let ctx = null;
let master = null;
let ducked = false;
let activeLoop = null; // { name, stop }
let muffleBus = null;

// ---------------------------------------------------------------------------
// Init — must be called after the first user gesture (AudioContext policy).
// ---------------------------------------------------------------------------

export function initAudio() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = isMuted() ? 0 : 0.7;
  master.connect(ctx.destination);
  onMute((m) => {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(m ? 0 : 0.7, ctx.currentTime + 0.2);
  });
  return ctx;
}

function now() {
  return ctx.currentTime;
}

// ---------------------------------------------------------------------------
// Envelope helper
// ---------------------------------------------------------------------------

function envelope(
  node,
  { a = 0.01, d = 0.15, s = 0.0, r = 0.1, peak = 1 } = {},
  t0 = now()
) {
  const g = node.gain;
  g.cancelScheduledValues(t0);
  g.setValueAtTime(0, t0);
  g.linearRampToValueAtTime(peak, t0 + a);
  g.linearRampToValueAtTime(s * peak, t0 + a + d);
  g.linearRampToValueAtTime(0, t0 + a + d + r);
  return t0 + a + d + r;
}

function mkVoice({ freq, type = 'sine', detune = 0, destination }) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const g = ctx.createGain();
  g.gain.value = 0;
  osc.connect(g);
  g.connect(destination ?? master);
  return { osc, g };
}

// ---------------------------------------------------------------------------
// One-shot SFX
// ---------------------------------------------------------------------------

export function playClick() {
  if (!ctx) return;
  const v = mkVoice({ freq: 1200, type: 'square' });
  v.osc.start();
  const end = envelope(v.g, { a: 0.002, d: 0.05, s: 0, r: 0.02, peak: 0.18 });
  v.osc.stop(end + 0.05);
}

export function playSelect() {
  if (!ctx) return;
  const v = mkVoice({ freq: 680, type: 'triangle' });
  v.osc.start();
  const end = envelope(v.g, { a: 0.002, d: 0.1, s: 0, r: 0.05, peak: 0.22 });
  v.osc.stop(end + 0.05);
  const v2 = mkVoice({ freq: 980, type: 'triangle' });
  v2.osc.start(now() + 0.06);
  const end2 = envelope(
    v2.g,
    { a: 0.002, d: 0.1, s: 0, r: 0.05, peak: 0.18 },
    now() + 0.06
  );
  v2.osc.stop(end2 + 0.05);
}

export function playChime() {
  if (!ctx) return;
  const t0 = now();
  const notes = [880, 1174.66, 1568]; // A5 D6 G6
  notes.forEach((f, i) => {
    const v = mkVoice({ freq: f, type: 'triangle' });
    v.osc.start(t0 + i * 0.08);
    const end = envelope(
      v.g,
      { a: 0.005, d: 0.25, s: 0, r: 0.25, peak: 0.2 },
      t0 + i * 0.08
    );
    v.osc.stop(end + 0.1);
  });
}

export function playBlip() {
  if (!ctx) return;
  const v = mkVoice({ freq: 440 + Math.random() * 80, type: 'square' });
  v.osc.start();
  const end = envelope(v.g, { a: 0.001, d: 0.02, s: 0, r: 0.01, peak: 0.08 });
  v.osc.stop(end + 0.02);
}

export function playHeartPop() {
  if (!ctx) return;
  const t0 = now();
  const v = mkVoice({ freq: 220, type: 'sine' });
  v.osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.25);
  v.osc.start(t0);
  const end = envelope(v.g, { a: 0.005, d: 0.25, s: 0, r: 0.05, peak: 0.3 }, t0);
  v.osc.stop(end + 0.05);
}

export function playMetalRiff() {
  if (!ctx) return;
  const t0 = now();
  const notes = [82.41, 82.41, 98, 82.41]; // E2, E2, G2, E2 — heavy chug
  notes.forEach((f, i) => {
    const v = mkVoice({ freq: f, type: 'sawtooth' });
    const dist = ctx.createWaveShaper();
    // simple distortion curve
    const samples = 256;
    const curve = new Float32Array(samples);
    for (let k = 0; k < samples; k++) {
      const x = (k * 2) / samples - 1;
      curve[k] = (Math.PI * 6 * x) / (Math.PI + 6 * Math.abs(x));
    }
    dist.curve = curve;
    v.osc.disconnect();
    v.osc.connect(dist);
    dist.connect(v.g);
    v.osc.start(t0 + i * 0.18);
    const end = envelope(
      v.g,
      { a: 0.005, d: 0.06, s: 0.3, r: 0.12, peak: 0.3 },
      t0 + i * 0.18
    );
    v.osc.stop(end + 0.1);
  });
}

// ---------------------------------------------------------------------------
// Piano note (for Mission 5)
// ---------------------------------------------------------------------------

const PIANO_FREQ = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392,
  'G#4': 415.3,
  A4: 440,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  'C#5': 554.37,
  D5: 587.33,
  Eb5: 622.25,
  E5: 659.25,
  F5: 698.46,
  'F#5': 739.99,
  G5: 783.99,
  'G#5': 830.61,
  A5: 880,
  Bb5: 932.33,
  B5: 987.77
};

export function playPianoNote(note, duration = 0.6, velocity = 0.25) {
  if (!ctx) return;
  const f = typeof note === 'string' ? PIANO_FREQ[note] : note;
  const t0 = now();
  // two detuned sines + a soft square for attack colour
  const voices = [
    { type: 'sine', det: 0, gain: 1 },
    { type: 'sine', det: 10, gain: 0.6 },
    { type: 'triangle', det: 0, gain: 0.25 }
  ];
  for (const v of voices) {
    const node = mkVoice({ freq: f, type: v.type, detune: v.det });
    node.osc.start(t0);
    const end = envelope(
      node.g,
      {
        a: 0.005,
        d: 0.08,
        s: 0.4,
        r: duration * 0.9,
        peak: velocity * v.gain
      },
      t0
    );
    node.osc.stop(end + 0.05);
  }
}

// Plays a short sequence — used by the piano scene.
export function playPianoPhrase(notes, spacing = 0.34) {
  if (!ctx) return;
  notes.forEach((n, i) => {
    setTimeout(() => playPianoNote(n, 0.8, 0.22), i * spacing * 1000);
  });
}

// Sweet Child O' Mine — iconic arpeggio intro, chiptune-voiced.
// Plays square waves so it reads as "old synth cover of a rock song,"
// not as a literal quote of the record.
const SCOM_INTRO = [
  // Pattern 1 — D string dance
  'D5', 'Bb4', 'G4', 'Bb4', 'D5', 'Bb4', 'G4', 'Bb4',
  // Pattern 2 — shift up to C
  'D5', 'C5', 'A4', 'C5', 'D5', 'C5', 'A4', 'C5',
  // Pattern 3 — reach for the top
  'E5', 'G5', 'D5', 'G5', 'E5', 'G5', 'D5', 'G5',
  // Pattern 4 — back home
  'D5', 'Bb4', 'G4', 'Bb4', 'D5', 'Bb4', 'G4', 'Bb4'
];

// Mills Brothers "Till Then" — opening phrase, chiptune piano voicing.
// "Till then, my darling, please wait for me / Till then, no matter when..."
const TILL_THEN = [
  // "Till then, my darling"
  { n: 'C4', d: 0.5 },
  { n: 'E4', d: 0.5 },
  { n: 'G4', d: 0.5 },
  { n: 'C5', d: 1.0 },
  // "please wait for me"
  { n: 'B4', d: 0.5 },
  { n: 'G4', d: 0.5 },
  { n: 'A4', d: 0.5 },
  { n: 'G4', d: 1.0 },
  // "till then…"
  { n: 'E4', d: 0.5 },
  { n: 'F4', d: 0.5 },
  { n: 'E4', d: 0.5 },
  { n: 'D4', d: 1.5 }
];

export function playTillThen({ tempo = 66 } = {}) {
  if (!ctx) return;
  const beatMs = 60000 / tempo;
  let offsetMs = 0;
  TILL_THEN.forEach(({ n, d }) => {
    setTimeout(() => playPianoNote(n, d * (beatMs / 1000) * 0.95, 0.22), offsetMs);
    offsetMs += d * beatMs;
  });
  return offsetMs;
}

// "I Think I'm in Love with My Best Friend" — soft pop-ballad chiptune,
// evocative of the rising-then-falling hook. Not a literal quote.
const BEST_FRIEND = [
  // "I think I'm in love…"
  { n: 'G4', d: 0.5 },
  { n: 'A4', d: 0.5 },
  { n: 'G4', d: 0.5 },
  { n: 'E4', d: 1.0 },
  // "with my best friend"
  { n: 'G4', d: 0.5 },
  { n: 'A4', d: 0.5 },
  { n: 'C5', d: 0.5 },
  { n: 'B4', d: 1.0 },
  // "I hope I don't lose him"
  { n: 'A4', d: 0.5 },
  { n: 'G4', d: 0.5 },
  { n: 'E4', d: 0.5 },
  { n: 'D4', d: 0.5 },
  { n: 'E4', d: 1.5 }
];

export function playBestFriend({ tempo = 84 } = {}) {
  if (!ctx) return;
  const beatMs = 60000 / tempo;
  let offsetMs = 0;
  BEST_FRIEND.forEach(({ n, d }) => {
    setTimeout(() => playPianoNote(n, d * (beatMs / 1000) * 0.95, 0.2), offsetMs);
    offsetMs += d * beatMs;
  });
  return offsetMs;
}

// Simlish blip — short pitched "mwah" that plays with the typewriter.
const SIMLISH_VOICES = {
  aida:    { base: 480, variance: 120, osc: 'triangle' },
  david:   { base: 220, variance: 80,  osc: 'triangle' },
  lisa:    { base: 380, variance: 110, osc: 'sine' },
  maha:    { base: 180, variance: 60,  osc: 'sawtooth' },
  default: { base: 330, variance: 100, osc: 'sine' }
};

export function playSimlish(voice = 'default') {
  if (!ctx) return;
  const v = SIMLISH_VOICES[voice] ?? SIMLISH_VOICES.default;
  const freq = v.base + Math.random() * v.variance;
  const t0 = now();
  const osc = ctx.createOscillator();
  osc.type = v.osc;
  osc.frequency.value = freq;
  osc.frequency.linearRampToValueAtTime(freq * 1.04, t0 + 0.04);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(0.06, t0 + 0.01);
  g.gain.linearRampToValueAtTime(0, t0 + 0.08);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + 0.1);
}

export function playSweetChildIntro({ tempo = 112 } = {}) {
  if (!ctx) return;
  const noteMs = (60000 / tempo) / 4; // 16th-note grid
  SCOM_INTRO.forEach((note, i) => {
    setTimeout(() => {
      const freq = PIANO_FREQ[note];
      if (!freq) return;
      const t0 = now();
      // Square-wave lead + sine sub for body
      const lead = ctx.createOscillator();
      lead.type = 'square';
      lead.frequency.value = freq;
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = freq / 2;
      const g = ctx.createGain();
      lead.connect(g);
      sub.connect(g);
      g.connect(master);
      // Much quieter — the guitar was blowing out the room.
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.06, t0 + 0.005);
      g.gain.linearRampToValueAtTime(0.025, t0 + 0.12);
      g.gain.linearRampToValueAtTime(0, t0 + 0.2);
      lead.start(t0);
      sub.start(t0);
      lead.stop(t0 + 0.25);
      sub.stop(t0 + 0.25);
    }, i * noteMs);
  });
}

// ---------------------------------------------------------------------------
// Firework boom — low body + crackle.
// ---------------------------------------------------------------------------

// Door knock — three dry thumps.
export function playKnock() {
  if (!ctx) return;
  const t0 = now();
  for (let i = 0; i < 3; i++) {
    const tk = t0 + i * 0.16;
    const bufSize = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let j = 0; j < bufSize; j++) {
      data[j] = (Math.random() * 2 - 1) * (1 - j / bufSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 500;
    const g = ctx.createGain();
    g.gain.value = 0.35;
    noise.connect(lp);
    lp.connect(g);
    g.connect(master);
    noise.start(tk);
    noise.stop(tk + 0.1);
  }
}

// Zombie groan — pitched noise with formant-like filter sweep.
export function playGroan() {
  if (!ctx) return;
  const t0 = now();
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(90, t0);
  osc.frequency.exponentialRampToValueAtTime(60, t0 + 0.6);
  osc.frequency.exponentialRampToValueAtTime(110, t0 + 1.0);
  osc.frequency.exponentialRampToValueAtTime(55, t0 + 1.4);
  const lp = ctx.createBiquadFilter();
  lp.type = 'bandpass';
  lp.frequency.setValueAtTime(300, t0);
  lp.frequency.linearRampToValueAtTime(700, t0 + 0.6);
  lp.frequency.linearRampToValueAtTime(400, t0 + 1.2);
  lp.Q.value = 2.5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(0.2, t0 + 0.1);
  g.gain.linearRampToValueAtTime(0.25, t0 + 0.8);
  g.gain.linearRampToValueAtTime(0, t0 + 1.5);
  osc.connect(lp);
  lp.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + 1.55);
}

// Sword swing — fast whoosh.
export function playSwing() {
  if (!ctx) return;
  const t0 = now();
  const bufSize = Math.floor(ctx.sampleRate * 0.25);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(600, t0);
  bp.frequency.exponentialRampToValueAtTime(2800, t0 + 0.18);
  bp.Q.value = 3;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(0.3, t0 + 0.02);
  g.gain.linearRampToValueAtTime(0, t0 + 0.25);
  noise.connect(bp);
  bp.connect(g);
  g.connect(master);
  noise.start(t0);
  noise.stop(t0 + 0.26);
}

// Hit impact — dull thud + metallic ring.
export function playHit() {
  if (!ctx) return;
  const t0 = now();
  // thud
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, t0);
  osc.frequency.exponentialRampToValueAtTime(60, t0 + 0.2);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(0.4, t0 + 0.005);
  g.gain.linearRampToValueAtTime(0, t0 + 0.25);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + 0.3);
  // ring
  const ring = ctx.createOscillator();
  ring.type = 'triangle';
  ring.frequency.value = 1800;
  const rg = ctx.createGain();
  rg.gain.setValueAtTime(0, t0);
  rg.gain.linearRampToValueAtTime(0.12, t0 + 0.005);
  rg.gain.linearRampToValueAtTime(0, t0 + 0.2);
  ring.connect(rg);
  rg.connect(master);
  ring.start(t0);
  ring.stop(t0 + 0.22);
}

// Angelic violin/harp sting — plays during the "first look" spotlight moment.
// A slow rising arpeggio (I–iii–V–I in C) with sine + triangle voices, soft
// attack and long release. No distortion, no bite — the moment should feel
// suspended, not theatrical.
export function playAngelic() {
  if (!ctx) return;
  const t0 = now();
  // Harp arpeggio (sine, very soft attack).
  const harp = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568.0]; // C5 E5 G5 C6 E6 G6
  harp.forEach((f, i) => {
    const v = mkVoice({ freq: f, type: 'sine' });
    v.osc.start(t0 + i * 0.18);
    const end = envelope(
      v.g,
      { a: 0.08, d: 0.3, s: 0.55, r: 1.4, peak: 0.12 },
      t0 + i * 0.18
    );
    v.osc.stop(end + 0.1);
  });
  // Violin pad on top — two triangle voices, slight detune for shimmer.
  const padFreqs = [523.25, 783.99]; // C5 + G5
  padFreqs.forEach((f, i) => {
    const a = mkVoice({ freq: f, type: 'triangle', detune: -6 });
    const b = mkVoice({ freq: f, type: 'triangle', detune: 6 });
    a.osc.start(t0 + 0.4 + i * 0.2);
    b.osc.start(t0 + 0.4 + i * 0.2);
    const endA = envelope(
      a.g,
      { a: 0.55, d: 0.4, s: 0.5, r: 1.6, peak: 0.09 },
      t0 + 0.4 + i * 0.2
    );
    const endB = envelope(
      b.g,
      { a: 0.55, d: 0.4, s: 0.5, r: 1.6, peak: 0.09 },
      t0 + 0.4 + i * 0.2
    );
    a.osc.stop(endA + 0.1);
    b.osc.stop(endB + 0.1);
  });
  // Final high twinkle (bell-like sine).
  const bell = mkVoice({ freq: 2093, type: 'sine' });
  bell.osc.start(t0 + 1.3);
  const endBell = envelope(
    bell.g,
    { a: 0.02, d: 0.2, s: 0.4, r: 1.0, peak: 0.09 },
    t0 + 1.3
  );
  bell.osc.stop(endBell + 0.1);
}

export function playFireworkBoom() {
  if (!ctx) return;
  const t0 = now();
  // Low boom — sine sweep
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(130, t0);
  osc.frequency.exponentialRampToValueAtTime(42, t0 + 0.45);
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(master);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(0.45, t0 + 0.005);
  g.gain.linearRampToValueAtTime(0, t0 + 0.55);
  osc.start(t0);
  osc.stop(t0 + 0.6);
  // High crackle — filtered noise
  const bufSize = Math.floor(ctx.sampleRate * 0.35);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2600;
  const ng = ctx.createGain();
  noise.connect(hp);
  hp.connect(ng);
  ng.connect(master);
  ng.gain.setValueAtTime(0, t0 + 0.08);
  ng.gain.linearRampToValueAtTime(0.18, t0 + 0.1);
  ng.gain.linearRampToValueAtTime(0, t0 + 0.4);
  noise.start(t0 + 0.08);
  noise.stop(t0 + 0.45);
}

// ---------------------------------------------------------------------------
// Ambient loops — keyed by mission. Simple repeating phrases.
// ---------------------------------------------------------------------------

// Shared lowpass bus for "music heard through a wall" mode.
function getMuffleBus() {
  if (!muffleBus && ctx) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 380;
    lp.Q.value = 1.2;
    const gain = ctx.createGain();
    gain.gain.value = 0.55;
    lp.connect(gain);
    gain.connect(master);
    muffleBus = lp;
  }
  return muffleBus;
}

function schedulePhrase(
  notes,
  { osc = 'sine', interval = 0.45, peak = 0.08, destination = null }
) {
  let stopped = false;
  let i = 0;
  function tick() {
    if (stopped || !ctx) return;
    const note = notes[i % notes.length];
    if (note !== null) {
      const v = mkVoice({ freq: note, type: osc, destination });
      v.osc.start();
      const end = envelope(v.g, {
        a: 0.04,
        d: 0.3,
        s: 0.1,
        r: interval * 0.6,
        peak
      });
      v.osc.stop(end + 0.1);
    }
    i++;
    setTimeout(tick, interval * 1000);
  }
  tick();
  return () => {
    stopped = true;
  };
}

// Four-on-the-floor kick — short low-sine thump
function kick(destination) {
  if (!ctx) return;
  const t0 = now();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, t0);
  osc.frequency.exponentialRampToValueAtTime(45, t0 + 0.15);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(0.35, t0 + 0.005);
  g.gain.linearRampToValueAtTime(0, t0 + 0.18);
  osc.connect(g);
  g.connect(destination ?? master);
  osc.start(t0);
  osc.stop(t0 + 0.2);
}

function hihat(destination) {
  if (!ctx) return;
  const t0 = now();
  const bufSize = Math.floor(ctx.sampleRate * 0.06);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.08, t0);
  g.gain.linearRampToValueAtTime(0, t0 + 0.06);
  noise.connect(hp);
  hp.connect(g);
  g.connect(destination ?? master);
  noise.start(t0);
  noise.stop(t0 + 0.07);
}

const LOOPS = {
  // Club — dark, low synthwave throb. Accepts { muffled } to route through lowpass.
  club: (opts = {}) =>
    schedulePhrase(
      [55, null, 55, 73.42, null, 55, null, 82.41],
      {
        osc: 'sawtooth',
        interval: 0.32,
        peak: opts.muffled ? 0.12 : 0.055,
        destination: opts.muffled ? getMuffleBus() : null
      }
    ),
  // Nightclub — full dance-floor mix: kick + bassline + synth stab + hat.
  nightclub: () => {
    let stoppedKick = false, stoppedBass = false, stoppedStab = false, stoppedHat = false;
    // Kick — every 0.5s (120 BPM)
    let beat = 0;
    function tickKick() {
      if (stoppedKick || !ctx) return;
      kick();
      beat = (beat + 1) % 4;
      setTimeout(tickKick, 500);
    }
    // Off-beat hat
    function tickHat() {
      if (stoppedHat || !ctx) return;
      hihat();
      setTimeout(tickHat, 250);
    }
    // Bassline — eighth notes, A minor pentatonic shape
    const bassNotes = [55, 55, 82.41, 55, 73.42, 55, 82.41, 65.41];
    let bi = 0;
    function tickBass() {
      if (stoppedBass || !ctx) return;
      const v = mkVoice({ freq: bassNotes[bi % bassNotes.length], type: 'sawtooth' });
      v.osc.start();
      const end = envelope(v.g, { a: 0.005, d: 0.1, s: 0.2, r: 0.15, peak: 0.12 });
      v.osc.stop(end + 0.05);
      bi++;
      setTimeout(tickBass, 250);
    }
    // Synth stab — on beat 1 of each bar
    const stabChords = [
      [220, 277, 330],
      [196, 246.94, 293.66],
      [174.61, 220, 261.63],
      [196, 246.94, 293.66]
    ];
    let si = 0;
    function tickStab() {
      if (stoppedStab || !ctx) return;
      const chord = stabChords[si % stabChords.length];
      for (const f of chord) {
        const v = mkVoice({ freq: f, type: 'sawtooth' });
        v.osc.start();
        const end = envelope(v.g, { a: 0.003, d: 0.08, s: 0.1, r: 0.3, peak: 0.045 });
        v.osc.stop(end + 0.05);
      }
      si++;
      setTimeout(tickStab, 2000);
    }
    tickKick();
    setTimeout(tickHat, 250);
    setTimeout(tickBass, 125);
    tickStab();
    return () => { stoppedKick = true; stoppedBass = true; stoppedStab = true; stoppedHat = true; };
  },
  // Restaurant — warm sparse triangle
  restaurant: () =>
    schedulePhrase(
      [261.63, 329.63, 392, null, 523.25, 392, 329.63, null],
      { osc: 'triangle', interval: 0.5, peak: 0.05 }
    ),
  // Sickbed — lonely minor piano-ish
  sickbed: () =>
    schedulePhrase(
      [220, 261.63, 329.63, 261.63, 220, null, null, null],
      { osc: 'triangle', interval: 0.55, peak: 0.04 }
    ),
  // Bar — tavern-ish major with bass pulse
  bar: () =>
    schedulePhrase(
      [293.66, 369.99, 440, 369.99, 293.66, 440, 493.88, 440],
      { osc: 'triangle', interval: 0.4, peak: 0.05 }
    ),
  // Piano room (ambient prior to the kiss attempt) — sparse single notes
  apartment: () =>
    schedulePhrase(
      [261.63, null, 329.63, null, 392, null, 329.63, null],
      { osc: 'sine', interval: 0.6, peak: 0.045 }
    ),
  // Dance — 3/4 swing feel, period-inspired
  dance: () => {
    // Original melody in 3/4 — sentimental, vaguely "Till Then"-flavoured
    // without quoting it. Bass-melody weave.
    const bass = [146.83, 220, 146.83, 174.61, 220, 174.61];
    const mel = [
      659.25,
      587.33,
      523.25,
      523.25,
      493.88,
      523.25,
      587.33,
      523.25,
      440
    ];
    let stoppedBass = false;
    let stoppedMel = false;
    let i = 0;
    function tickBass() {
      if (stoppedBass || !ctx) return;
      const v = mkVoice({ freq: bass[i % bass.length], type: 'sine' });
      v.osc.start();
      const end = envelope(v.g, {
        a: 0.02,
        d: 0.35,
        s: 0.1,
        r: 0.25,
        peak: 0.07
      });
      v.osc.stop(end + 0.1);
      i++;
      setTimeout(tickBass, 420);
    }
    let j = 0;
    function tickMel() {
      if (stoppedMel || !ctx) return;
      const note = mel[j % mel.length];
      if (note !== null) {
        const v = mkVoice({ freq: note, type: 'triangle' });
        v.osc.start();
        const end = envelope(v.g, {
          a: 0.03,
          d: 0.6,
          s: 0.2,
          r: 0.4,
          peak: 0.06
        });
        v.osc.stop(end + 0.1);
      }
      j++;
      setTimeout(tickMel, 560);
    }
    tickBass();
    setTimeout(tickMel, 220);
    return () => {
      stoppedBass = true;
      stoppedMel = true;
    };
  }
};

export function playLoop(name, opts = {}) {
  if (!ctx) return;
  stopLoop();
  const factory = LOOPS[name];
  if (!factory) return;
  activeLoop = { name, stop: factory(opts) };
}

export function stopLoop() {
  if (activeLoop) {
    activeLoop.stop();
    activeLoop = null;
  }
}

export function isLoopActive(name) {
  return activeLoop?.name === name;
}
