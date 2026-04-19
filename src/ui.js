// ui.js — DOM overlays for W2-style UI chrome.
// Dialogue box, title, mission briefing/outro, credits, and fade text.
// Everything is promise-based so mission scripts read like a screenplay:
//
//   await showDialogue({ portrait: 'aida-goth', name: 'Aida', text: '...' });
//   const n = await showChoice({ ... });

import { portraits } from './assets.js';

const uiRoot = document.getElementById('ui');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Progress tracker so cutaway hearts get more prevalent as the story advances.
let campaignProgress = 0;
export function setCampaignProgress(n) {
  campaignProgress = Math.max(0, Math.min(10, n));
}

// Purple hearts only — they frolic in the wind (slow, drifting, soft).
const PURPLE_HEARTS = ['💜', '💜', '💜', '💜']; // same emoji, pure consistency

function renderHearts({ density = 10 } = {}) {
  const count = Math.max(6, density + Math.floor(campaignProgress * 2.5));
  const hearts = Array.from({ length: count })
    .map((_, i) => {
      const left = Math.round(Math.random() * 100);
      const delay = (Math.random() * 14).toFixed(2);
      const duration = (14 + Math.random() * 10).toFixed(2);
      const size = 14 + Math.floor(Math.random() * 22);
      // Randomised sway amplitude + direction per heart.
      const sway = (Math.random() * 60 - 30).toFixed(0); // -30..30px
      const twist = (Math.random() * 28 - 14).toFixed(0); // -14deg..14deg
      const anim = i % 3 === 0
        ? 'heartFrolic'
        : i % 3 === 1
        ? 'heartDrift'
        : 'heartDeflate';
      return `<div class="cutaway-heart" style="left:${left}%; font-size:${size}px; animation-delay:${delay}s; animation-duration:${duration}s; animation-name:${anim}; --sway:${sway}px; --twist:${twist}deg;">💜</div>`;
    })
    .join('');
  return `<div class="cutaway-hearts">${hearts}</div>`;
}

function mkEl(tag, className, parent) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (parent) parent.appendChild(el);
  return el;
}

function drawPortrait(canvas, portraitKey) {
  const src = portraits[portraitKey];
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (src) ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// One-click gating: while modal UI is up, canvas input is blocked by DOM overlay.
// Scenes can also check `isUiBlocking()` before interpreting clicks.
let uiBlocking = 0;
export function isUiBlocking() {
  return uiBlocking > 0;
}
function pushBlock() {
  uiBlocking++;
}
function popBlock() {
  uiBlocking = Math.max(0, uiBlocking - 1);
}

// ---------------------------------------------------------------------------
// TITLE SCREEN
// ---------------------------------------------------------------------------

// The opening "birthday card" — cover you tap to open, then an inside page
// with a handwritten note. Tap the BEGIN button on the inside to start the
// game (at which point the note "becomes" the game).
// The note text lives in content.js as `openingNote` so the author can edit it.
export function showTitle({ hasSave, openingNote } = {}) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'birthday-card-scene', uiRoot);
    wrap.innerHTML = `
      ${renderHearts({ density: 16 })}
      <div class="birthday-card">
        <div class="card-cover">
          <div class="card-border"></div>
          <div class="card-front-inner">
            <div class="card-heart">💜</div>
            <div class="card-cover-title">Happy<br/>Birthday<br/>Aidka</div>
            <div class="card-cover-sub">I wrote you a little note\u2026</div>
            <button class="wc-btn card-open-btn" data-action="open">Open</button>
          </div>
        </div>
        <div class="card-inside">
          <div class="card-inside-border"></div>
          <div class="card-inside-note">${openingNote || DEFAULT_NOTE}</div>
          <div class="card-inside-actions">
            ${hasSave ? `<button class="wc-btn" data-action="continue">Next page \u2192</button>` : ''}
            <button class="wc-btn" data-action="new">${hasSave ? 'Start from the first page' : 'Next page \u2192'}</button>
          </div>
          <div class="card-signature">— David 💜</div>
        </div>
      </div>
    `;
    const card = wrap.querySelector('.birthday-card');
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === 'open') {
        card.classList.add('opened');
        return;
      }
      // Next page — cross-fade into chapter I. The new page's wrap has the
      // same purple backdrop so no black frame between.
      card.classList.add('turning');
      setTimeout(() => {
        popBlock();
        resolve(action);
        setTimeout(() => wrap.remove(), 600);
      }, 240);
    });
  });
}

const DEFAULT_NOTE = `
<p>You are the girl of my dreams and I love you more than the world.</p>
<p>My love grows for you every minute of every day. When I think about
you I feel warm and happy. You are my sunshine.</p>
<p>Meeting you was the best thing that ever happened to me!</p>
<p>And it was a magical time&hellip;</p>
<p class="card-hint">tip &mdash; press <b>spacebar</b> (or click) to turn every page &amp; advance dialogue.</p>
`;

// ---------------------------------------------------------------------------
// CARD PAGE — the framing device for the whole game.
//
// Every briefing and outro is rendered as a page of a handmade birthday card:
// a pixel drawing of the memory in a frame, and a handwritten note from David
// underneath. When the reader turns the page we zoom into the drawing and
// cross-fade into the playable scene — so the scene feels like a memory
// being stepped into. The card itself NEVER acknowledges it's a game.
// ---------------------------------------------------------------------------

// renderCardPage — another page of the same birthday card.
// Uses the SAME dimensions, the SAME pink gradient, and the SAME dashed
// purple border as the card's inside page at the title screen. When the
// reader clicks "Next page", the card rotates on its spine with the SAME
// 3D flip the cover uses when it opens — so turning a story page feels
// like turning a real page of the card.
function renderCardPage({ body, cta = 'Next page \u2192' }) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'birthday-card-scene card-page-scene', uiRoot);
    const paragraphs = (body || '')
      .split(/\n\s*\n/)
      .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`) // preserve single line-breaks
      .join('');
    wrap.innerHTML = `
      <div class="birthday-card opened-flat">
        <div class="card-inside-plain">
          <div class="card-inside-border"></div>
          <div class="card-inside-note">${paragraphs}</div>
          <div class="card-inside-actions">
            <button class="wc-btn" data-action="turn">${cta}</button>
          </div>
        </div>
      </div>
    `;
    const card = wrap.querySelector('.birthday-card');
    const btn = wrap.querySelector('[data-action="turn"]');
    const finish = () => {
      // Simple cross-fade. The next page's wrap mounts on top while this
      // one fades out — both share the purple backdrop so no black frame.
      card.classList.add('turning');
      setTimeout(() => {
        window.removeEventListener('keydown', onKey);
        popBlock();
        resolve();
        // Clean up this wrap after the new page has had time to mount.
        setTimeout(() => wrap.remove(), 600);
      }, 240);
    };
    btn.addEventListener('click', finish);
    const onKey = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      finish();
    };
    window.addEventListener('keydown', onKey);
  });
}

// ---------------------------------------------------------------------------
// MISSION BRIEFING  (card page — David's handwritten note, no drawing)
// ---------------------------------------------------------------------------

export function showBriefing({ chapter, title, when, text, cta, page }) {
  return renderCardPage({
    page,
    heading: when ?? '',
    body: text,
    cta: cta ?? 'Turn the page \u2192'
  });
}

// ---------------------------------------------------------------------------
// MISSION OUTRO  (card page — David's reflection on what just happened)
// ---------------------------------------------------------------------------

export function showOutro({ title = '', text, cta, page }) {
  return renderCardPage({
    page,
    heading: '',
    body: text,
    cta: cta ?? 'Turn the page \u2192'
  });
}

// Final "Happy Birthday" page — the last page of the same card.
export function showFinalCard({ text, cta = 'Close the card' }) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'birthday-card-scene card-page-scene final-page-scene', uiRoot);
    const paragraphs = (text || '')
      .split(/\n\s*\n/)
      .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
    wrap.innerHTML = `
      <div class="birthday-card opened-flat">
        <div class="card-inside-plain final-page">
          <div class="card-inside-border"></div>
          <div class="card-inside-note final-note">${paragraphs}</div>
          <div class="card-inside-actions">
            <button class="wc-btn" data-action="close">${cta}</button>
          </div>
        </div>
      </div>
    `;
    const btn = wrap.querySelector('[data-action="close"]');
    const finish = () => {
      wrap.classList.add('fading');
      setTimeout(() => {
        window.removeEventListener('keydown', onKey);
        wrap.remove();
        popBlock();
        resolve();
      }, 400);
    };
    btn.addEventListener('click', finish);
    const onKey = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      finish();
    };
    window.addEventListener('keydown', onKey);
  });
}

// ---------------------------------------------------------------------------
// DIALOGUE BOX  (portrait + typewriter + click-advance)
// Supports optional choices[] — resolves to the chosen index.
// ---------------------------------------------------------------------------

export function showDialogue({ portrait, name, text, choices }) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'dialogue-overlay', uiRoot);
    wrap.innerHTML = `
      <div class="dialogue-box">
        <div class="dialogue-portrait">
          <canvas width="48" height="48"></canvas>
          <div class="dialogue-name">${name ?? ''}</div>
        </div>
        <div class="dialogue-main">
          <div class="dialogue-text"></div>
          ${
            choices
              ? `<div class="dialogue-choices">
                   ${choices
                     .map(
                       (c, i) =>
                         `<button class="wc-btn small" data-idx="${i}">${c}</button>`
                     )
                     .join('')}
                 </div>`
              : `<div class="dialogue-arrow">▼</div>`
          }
        </div>
      </div>
    `;
    const canvas = wrap.querySelector('canvas');
    drawPortrait(canvas, portrait);
    const textEl = wrap.querySelector('.dialogue-text');
    typewriter(textEl, text, 24);

    if (choices) {
      wrap.querySelectorAll('[data-idx]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx, 10);
          wrap.remove();
          popBlock();
          resolve(idx);
        });
      });
      // tap background still fast-forwards typewriter
      wrap.addEventListener('click', () => fastForwardTypewriter(textEl));
    } else {
      let finished = false;
      wrap.addEventListener('click', () => {
        if (!finished) {
          const done = isTypewriterDone(textEl);
          if (!done) {
            fastForwardTypewriter(textEl);
            finished = true;
            return;
          }
        }
        wrap.remove();
        popBlock();
        resolve();
      });
      // also resolve when typewriter done + user clicks — handled above naturally.
      // Allow Enter / Space to advance too
      const keyHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          wrap.click();
        }
      };
      window.addEventListener('keydown', keyHandler);
      const observer = new MutationObserver(() => {
        if (!wrap.isConnected) {
          window.removeEventListener('keydown', keyHandler);
          observer.disconnect();
        }
      });
      observer.observe(uiRoot, { childList: true });
    }
  });
}

// ---------------------------------------------------------------------------
// MINIGAME BUTTON — a pill-shaped action button that sits low on the screen.
// The player taps it N times (or keeps tapping while a countdown runs).
// Resolves with the number of presses.
//   await showActionButton({ label: '🚬 Puff', target: 3 });
//   await showActionButton({ label: '🥃 Shot', countdownSeconds: 10 });
// ---------------------------------------------------------------------------

export function showActionButton({
  label,
  subtitle = '',
  target = null,           // finish after this many presses
  countdownSeconds = null, // or finish when the clock runs out
  onPress = null
}) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'action-overlay', uiRoot);
    wrap.innerHTML = `
      <div class="action-panel">
        ${countdownSeconds ? `<div class="action-countdown" id="action-clock">${countdownSeconds}</div>` : ''}
        ${subtitle ? `<div class="action-sub">${subtitle}</div>` : ''}
        <button class="action-btn" id="action-btn">${label}</button>
        ${target ? `<div class="action-progress"><span id="action-count">0</span> / ${target}</div>` : ''}
      </div>
    `;
    const btn = wrap.querySelector('#action-btn');
    const countEl = wrap.querySelector('#action-count');
    const clockEl = wrap.querySelector('#action-clock');
    let presses = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (timer) clearInterval(timer);
      window.removeEventListener('keydown', keyHandler);
      wrap.remove();
      popBlock();
      resolve(presses);
    };

    const press = () => {
      if (finished) return;
      presses++;
      if (countEl) countEl.textContent = String(presses);
      btn.classList.remove('pressed');
      // force reflow so the animation restarts each tap
      void btn.offsetWidth;
      btn.classList.add('pressed');
      onPress?.(presses);
      if (target && presses >= target) finish();
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      press();
    });
    const keyHandler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        press();
      }
    };
    window.addEventListener('keydown', keyHandler);

    let timer = null;
    if (countdownSeconds != null) {
      let remaining = countdownSeconds;
      timer = setInterval(() => {
        remaining--;
        if (clockEl) clockEl.textContent = String(Math.max(0, remaining));
        if (remaining <= 0) finish();
      }, 1000);
    }
  });
}

// ---------------------------------------------------------------------------
// NARRATION — scene direction / stage note. Subtle bottom caption, no portrait.
// ---------------------------------------------------------------------------

export function showNarration({ text, choices }) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'narration-scene', uiRoot);
    wrap.innerHTML = `
      <div class="narration-card">
        <div class="narration-text"></div>
        ${
          choices
            ? `<div class="narration-choices">${choices
                .map(
                  (c, i) =>
                    `<button class="wc-btn small" data-idx="${i}">${c}</button>`
                )
                .join('')}</div>`
            : `<div class="narration-arrow">▾</div>`
        }
      </div>
    `;
    const textEl = wrap.querySelector('.narration-text');
    typewriter(textEl, text, 30);

    const onKey = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      wrap.click();
    };
    window.addEventListener('keydown', onKey);
    const cleanup = () => window.removeEventListener('keydown', onKey);
    if (choices) {
      wrap.querySelectorAll('[data-idx]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx, 10);
          cleanup();
          wrap.remove();
          popBlock();
          resolve(idx);
        });
      });
      wrap.addEventListener('click', () => fastForwardTypewriter(textEl));
    } else {
      wrap.addEventListener('click', () => {
        if (!isTypewriterDone(textEl)) {
          fastForwardTypewriter(textEl);
          return;
        }
        cleanup();
        wrap.remove();
        popBlock();
        resolve();
      });
    }
  });
}

// ---------------------------------------------------------------------------
// SPEECH BUBBLE — positioned over the speaking character.
// Pass ix/iy in internal (320×240) coords; it's translated to the stage.
// ---------------------------------------------------------------------------

export function showBubble({
  ix,
  iy,
  name,
  text,
  choices,
  voice,
  thought = false,
  color = 'paper',
  // Optional: a callback that returns the latest { ix, iy } for the speaker.
  // When provided, the bubble re-positions every animation frame so it stays
  // glued over a character who's walking.
  track = null
}) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'bubble-scene', uiRoot);

    // Compute bubble anchor from the current iy (above if speaker is low on
    // the screen, below if they're at the top).  We recompute this every
    // frame so a character that walks UP past the threshold doesn't keep
    // using the old orientation.
    const updatePosition = (ix2, iy2) => {
      const above = iy2 > 64;
      const leftPct = Math.max(6, Math.min(94, (ix2 / 320) * 100));
      const topPct = (iy2 / 240) * 100;
      bubble.style.left = leftPct + '%';
      bubble.style.top = topPct + '%';
      // Swap above/below class if orientation changed.
      bubble.classList.toggle('above', above);
      bubble.classList.toggle('below', !above);
    };

    wrap.innerHTML = `
      <div class="speech-bubble color-${color}${thought ? ' thought' : ''}">
        ${name ? `<div class="speech-name">${name}${thought ? ' \u00b7 thinks' : ''}</div>` : ''}
        <div class="speech-text"></div>
        ${
          choices
            ? `<div class="speech-choices">${choices
                .map(
                  (c, i) =>
                    `<button class="wc-btn small" data-idx="${i}">${c}</button>`
                )
                .join('')}</div>`
            : `<div class="speech-arrow">${thought ? '\u00b7 \u00b7 \u00b7' : '\u25BE'}</div>`
        }
        <div class="speech-tail"></div>
      </div>
    `;
    const bubble = wrap.querySelector('.speech-bubble');
    const textEl = wrap.querySelector('.speech-text');
    updatePosition(ix, iy); // initial placement
    typewriter(textEl, text, 28, voice);

    // If the caller supplied a `track` function, run a rAF loop that keeps
    // the bubble stuck on the (possibly walking) speaker for the whole time
    // the bubble is open.
    let rafId = null;
    if (typeof track === 'function') {
      const tick = () => {
        try {
          const next = track();
          if (next && typeof next.ix === 'number' && typeof next.iy === 'number') {
            updatePosition(next.ix, next.iy);
          }
        } catch { /* ignore — scene may have been torn down */ }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    const onKey = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      wrap.click();
    };
    window.addEventListener('keydown', onKey);
    const cleanup = () => {
      window.removeEventListener('keydown', onKey);
      if (rafId != null) cancelAnimationFrame(rafId);
    };

    if (choices) {
      wrap.querySelectorAll('[data-idx]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx, 10);
          cleanup();
          wrap.remove();
          popBlock();
          resolve(idx);
        });
      });
      wrap.addEventListener('click', () => fastForwardTypewriter(textEl));
    } else {
      wrap.addEventListener('click', () => {
        if (!isTypewriterDone(textEl)) {
          fastForwardTypewriter(textEl);
          return;
        }
        cleanup();
        wrap.remove();
        popBlock();
        resolve();
      });
    }
  });
}

// ---------------------------------------------------------------------------
// PHONE  (text-message overlay — tap to reveal each message)
// messages: [{ side: 'me'|'them', text: string, time?: string, reaction?: string }]
// ---------------------------------------------------------------------------

export function showTextMessages({
  contactName,
  contactEmoji = '🐌',
  meEmoji = '🧃',
  messages,
  closeLabel = 'Put phone down'
}) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'phone-scene', uiRoot);
    // Build floating hearts for the background.
    const heartEmojis = ['💜', '❤️', '💕', '💗', '🩷', '💖'];
    const hearts = Array.from({ length: 14 })
      .map((_, i) => {
        const left = Math.round(Math.random() * 100);
        const delay = (Math.random() * 8).toFixed(2);
        const duration = (8 + Math.random() * 6).toFixed(2);
        const size = 12 + Math.floor(Math.random() * 14);
        const em = heartEmojis[i % heartEmojis.length];
        return `<div class="phone-heart" style="left:${left}%; font-size:${size}px; animation-delay:${delay}s; animation-duration:${duration}s;">${em}</div>`;
      })
      .join('');
    wrap.innerHTML = `
      <div class="phone-hearts">${hearts}</div>
      <div class="phone-body">
        <div class="phone-notch"></div>
        <div class="phone-header">
          <div class="phone-avatar">${contactEmoji}</div>
          <div class="phone-contact">${contactName}</div>
        </div>
        <div class="phone-chat" id="phone-chat"></div>
        <div class="phone-footer">
          <div class="phone-hint">Tap to read on</div>
          <button class="wc-btn small phone-close" style="display:none">${closeLabel}</button>
        </div>
      </div>
    `;
    const chat = wrap.querySelector('#phone-chat');
    const hint = wrap.querySelector('.phone-hint');
    const closeBtn = wrap.querySelector('.phone-close');
    let i = 0;

    const addMessage = (m) => {
      const bubble = document.createElement('div');
      bubble.className = `phone-bubble ${m.side === 'me' ? 'me' : 'them'}`;
      bubble.innerHTML = `
        ${m.side === 'them' ? `<div class="phone-mini-avatar">${contactEmoji}</div>` : ''}
        <div class="phone-bubble-inner">
          <div class="phone-bubble-text">${escapeHtml(m.text)}</div>
          ${m.time ? `<div class="phone-bubble-time">${m.time}</div>` : ''}
        </div>
      `;
      chat.appendChild(bubble);
      chat.scrollTop = chat.scrollHeight;
      // pulse a micro animation
      bubble.classList.add('enter');
      requestAnimationFrame(() => bubble.classList.remove('enter'));
    };

    const advance = () => {
      if (i >= messages.length) {
        hint.style.display = 'none';
        closeBtn.style.display = 'inline-block';
        return;
      }
      addMessage(messages[i]);
      i++;
      if (i >= messages.length) {
        hint.style.display = 'none';
        closeBtn.style.display = 'inline-block';
      }
    };

    // First message appears immediately
    advance();

    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.phone-close')) return;
      advance();
    });

    closeBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      wrap.classList.add('fading');
      await sleep(300);
      wrap.remove();
      popBlock();
      resolve();
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// CREDITS  (slow scroll, then fixed "Happy Birthday, Aida." card)
// ---------------------------------------------------------------------------

export function showCredits({ lines, finalCard = 'Happy Birthday, Aida.' }) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'credits-scene', uiRoot);
    wrap.innerHTML = `
      <div class="credits-scroll">
        ${lines
          .map(
            (l) =>
              `<div class="credits-line ${l.heading ? 'heading' : ''}">${l.text}</div>`
          )
          .join('')}
        <div class="credits-spacer"></div>
        <div class="credits-final">${finalCard}</div>
        <div class="credits-spacer small"></div>
        <button class="wc-btn" data-action="end">The End</button>
      </div>
    `;
    const scroll = wrap.querySelector('.credits-scroll');
    // animate scroll-up
    let offset = 0;
    const startY = wrap.clientHeight;
    scroll.style.transform = `translateY(${startY}px)`;
    const startTime = performance.now();
    const duration = 24000; // 24s scroll
    function step(t) {
      const pct = Math.min(1, (t - startTime) / duration);
      const y = startY - pct * (scroll.scrollHeight + startY);
      scroll.style.transform = `translateY(${y}px)`;
      if (pct < 1 && wrap.isConnected) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    wrap.querySelector('[data-action="end"]').addEventListener('click', () => {
      wrap.remove();
      popBlock();
      resolve();
    });
  });
}

// ---------------------------------------------------------------------------
// FADE TEXT CARD  (for transitions like "Later that night...")
// ---------------------------------------------------------------------------

export function showFadeText(text, { duration = 2600 } = {}) {
  pushBlock();
  return new Promise((resolve) => {
    const wrap = mkEl('div', 'fade-text', uiRoot);
    wrap.innerHTML = `<div class="fade-text-inner">${text}</div>`;
    setTimeout(() => wrap.classList.add('show'), 20);
    setTimeout(() => wrap.classList.remove('show'), duration - 500);
    setTimeout(() => {
      wrap.remove();
      popBlock();
      resolve();
    }, duration);
  });
}

// ---------------------------------------------------------------------------
// MUTE BUTTON  (persistent corner toggle)
// ---------------------------------------------------------------------------

let muteState = false;
let muteListeners = new Set();

export function setMuted(m) {
  muteState = m;
  for (const fn of muteListeners) fn(m);
  localStorage.setItem('aida.muted', m ? '1' : '0');
}
export function isMuted() {
  return muteState;
}
export function onMute(fn) {
  muteListeners.add(fn);
  return () => muteListeners.delete(fn);
}

export function installMuteButton() {
  muteState = localStorage.getItem('aida.muted') === '1';
  const btn = mkEl('button', 'mute-btn', uiRoot);
  btn.textContent = muteState ? '🔇' : '🔊';
  btn.setAttribute('aria-label', 'Toggle sound');
  btn.addEventListener('click', () => {
    setMuted(!muteState);
    btn.textContent = muteState ? '🔇' : '🔊';
  });
  return btn;
}

// ---------------------------------------------------------------------------
// AFFECTION COUNTER (top-left "resource" reskin)
// ---------------------------------------------------------------------------

let affectionEl = null;
export function installAffection(total) {
  if (affectionEl) affectionEl.remove();
  affectionEl = mkEl('div', 'affection-counter', uiRoot);
  affectionEl.innerHTML = `<span class="heart">❤</span><span class="num">0</span> / ${total}`;
  return affectionEl;
}
export function setAffection(n) {
  if (!affectionEl) return;
  affectionEl.querySelector('.num').textContent = n;
  affectionEl.classList.add('pulse');
  setTimeout(() => affectionEl.classList.remove('pulse'), 500);
}

// ---------------------------------------------------------------------------
// TYPEWRITER  (shared between briefing/outro/dialogue)
// ---------------------------------------------------------------------------

const twState = new WeakMap();
// Simlish callback — wired up from main.js so ui.js stays agnostic.
let simlishCb = null;
export function setSimlishHandler(fn) {
  simlishCb = fn;
}

function typewriter(el, text, charsPerSec = 24, voice = null) {
  el.textContent = '';
  const state = { text, i: 0, done: false, timer: null, voice };
  twState.set(el, state);
  const interval = 1000 / charsPerSec;
  function step() {
    if (state.done) return;
    state.i++;
    el.textContent = state.text.slice(0, state.i);
    // Simlish blip — play every 2-3 characters for speech-like cadence.
    if (simlishCb && state.voice && state.i % 3 === 0) {
      const ch = text[state.i - 1];
      if (ch && /[a-zA-Zа-яА-Я]/.test(ch)) simlishCb(state.voice);
    }
    if (state.i >= state.text.length) {
      state.done = true;
      return;
    }
    state.timer = setTimeout(step, interval);
  }
  step();
}

function fastForwardTypewriter(el) {
  const state = twState.get(el);
  if (!state || state.done) return;
  clearTimeout(state.timer);
  state.i = state.text.length;
  el.textContent = state.text;
  state.done = true;
}

function isTypewriterDone(el) {
  const state = twState.get(el);
  return !state || state.done;
}

// ---------------------------------------------------------------------------
// CLEAR ALL (used during scene transitions when we fade to black)
// ---------------------------------------------------------------------------

export function clearUi() {
  // Keep persistent elements (mute, affection); remove modal overlays.
  uiRoot.querySelectorAll(
    '.dialogue-overlay, .briefing-scene, .title-scene, .credits-scene, .fade-text'
  ).forEach((el) => el.remove());
  uiBlocking = 0;
}
