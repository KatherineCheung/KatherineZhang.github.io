/* ==========================================================================
   Card engine — shared by every holiday theme.

   An entry page (cards/<theme>/index.html) sets <html data-theme="<id>">,
   loads themes/<id>.js (which registers window.CardThemes[id]) and then this
   file. Everything is driven by the link:

     ?t=Mom&f=KZ&m=2&l=zh            (short form, made by cards/index.html)
     ?to=Mom&from=KZ&msg=Hi&lang=zh  (long form, still accepted)
       t | to     recipient name             (optional, max 24 chars)
       f | from   signature                  (optional, max 24 chars)
       s | msg    the message; \n = new line (optional, max 300 chars)
       m          number of a preset message of this theme (1-based) instead of s
       l | lang   en | zh  (optional; defaults to zh when the text contains Chinese)
       rec        1 = recording mode: no buttons, opens by itself after one tap
     A text value starting with "." is base64url-encoded UTF-8: the maker uses
     it when that is shorter than %-escaping (Chinese: ~4 chars per character
     instead of 9).
   ========================================================================== */
(() => {
'use strict';

const TH = (window.CardThemes || {})[document.documentElement.dataset.theme];
if (!TH) { document.body.textContent = 'Unknown card theme.'; return; }

/* ---------------------------------------------------------------- config */
const params = new URLSearchParams(location.search);
const clean = (v, n) => (v || '').replace(/\r\n?/g, '\n').trim().slice(0, n);
const CJK = /[⺀-鿿豈-﫿　-〿＀-￯]/;
function unpack(v) {                               // ".<base64url>" → text; anything else as is
  if (!v || v[0] !== '.') return v || '';
  try {
    const b = v.slice(1).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b + '='.repeat((4 - b.length % 4) % 4));
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  } catch (e) { return v; }
}
const arg = (...names) => { for (const n of names) { const v = params.get(n); if (v != null) return unpack(v); } return ''; };
const rawTo = arg('t', 'to'), rawFrom = arg('f', 'from');
const rawMsg = clean(arg('s', 'msg'), 300);
const langArg = params.get('l') || params.get('lang');
const lang = langArg === 'zh' || langArg === 'en' ? langArg : (CJK.test(rawMsg + rawTo) ? 'zh' : 'en');
const REC = params.get('rec') === '1';
const PREVIEW = params.get('preview') === '1';     // embedded in the maker: no envelope, no music, live text
const pick = o => (o && typeof o === 'object' && (lang in o)) ? o[lang] : o;

const UI = {
  en: {
    hint: touch => `${touch ? 'Tap' : 'Click'} to open`,
    shine: to => `a ${pick(TH.occasion)} for ${to || 'you'}`,
    title: to => to ? `To ${to}, ${pick(TH.greet)}!` : `${pick(TH.greet)}!`,
    letterTop: to => to ? `for ${to}` : 'for you',
    sig: from => `From ${from}`,
    docTitle: to => to ? `${pick(TH.greet)}, ${to}` : `${pick(TH.greet)} ✦`,
    aria: to => `Open the ${pick(TH.occasion)} for ${to || 'you'}`,
    tip: touch => touch ? 'Tap or swipe for stardust' : 'Click or move the mouse for stardust',
    replay: '↺ Read again', save: '⤓ Save image', saving: 'Drawing…',
    saveHint: touch => touch ? 'Press and hold the image to save it' : 'Your card as an image',
    download: '⤓ Download', share: '↗ Share', close: '✕ Close',
    mute: 'Mute music', play: 'Play music',
    recTitle: 'Recording mode',
    recBody: touch => `Start your phone’s screen recording first, come back here, then ${touch ? 'tap' : 'click'} anywhere. The card opens by itself.`,
    recSmall: 'Buttons and hints are hidden so the video stays clean. Trim the start when you’re done.'
  },
  zh: {
    hint: touch => `${touch ? '轻点' : '点击'}信封，打开`,
    shine: to => `${to ? to + '的' : '你的'}${pick(TH.occasion)}`,
    title: to => to ? `${to}，${pick(TH.greet)}！` : `${pick(TH.greet)}！`,
    letterTop: to => to ? `致 ${to}` : '给你的',
    sig: from => `—— ${from}`,
    docTitle: to => to ? `${to}，${pick(TH.greet)}` : `${pick(TH.greet)} ✦`,
    aria: to => `打开给${to || '你'}的${pick(TH.occasion)}`,
    tip: touch => touch ? '轻点或滑动，撒点星光' : '点击或移动鼠标，撒点星光',
    replay: '↺ 再读一遍', save: '⤓ 保存图片', saving: '生成中…',
    saveHint: touch => touch ? '长按图片，保存到相册' : '贺卡图片已生成',
    download: '⤓ 下载', share: '↗ 分享', close: '✕ 关闭',
    mute: '关闭音乐', play: '播放音乐',
    recTitle: '录屏模式',
    recBody: touch => `先打开手机的屏幕录制，回到这里后${touch ? '轻点' : '点击'}任意处，贺卡会自己打开。`,
    recSmall: '按钮和提示都已隐藏，画面更干净。录完后在相册里把开头剪掉就好。'
  }
}[lang];

const presetNo = parseInt(params.get('m'), 10);
const preset = TH.presets && TH.presets[lang] && TH.presets[lang][presetNo - 1];
const CONFIG = {
  to: clean(rawTo, 24),
  from: clean(rawFrom, 24),
  message: rawMsg || (preset ? preset[1] : '') || pick(TH.message)
};

/* ---------------------------------------------------------------- helpers */
const $ = s => document.querySelector(s);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover: none)').matches;
const DPR = Math.min(window.devicePixelRatio || 1, 2);
const TAU = Math.PI * 2;
const rand = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeBack = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pickOne = arr => arr[(Math.random() * arr.length) | 0];

/* ---------------------------------------------------------------- page setup */
const root = document.documentElement;
for (const [k, v] of Object.entries(TH.vars || {})) root.style.setProperty('--' + k, v);
const SKY = TH.sky;                                   // 4 gradient stops, top → bottom
const GLOWS = TH.glows || [];                         // [x%, y%, rx, ry, rgba]
document.body.style.backgroundImage = [
  ...GLOWS.map(([x, y, rx, ry, c]) => `radial-gradient(${rx}px ${ry}px at ${x}% ${y}%, ${c}, transparent 62%)`),
  `linear-gradient(180deg,${SKY[0]} 0%,${SKY[1]} 46%,${SKY[2]} 78%,${SKY[3]} 100%)`
].join(',');
root.lang = lang === 'zh' ? 'zh-CN' : 'en';
if (lang === 'zh') document.body.classList.add('zh');
if (REC) document.body.classList.add('rec');
if (PREVIEW) document.body.classList.add('preview');

const seal = TH.sealText ? `<span class="seal-text">${TH.sealText}</span>` : TH.sealSvg;
document.body.insertAdjacentHTML('afterbegin', `
<canvas id="sky" class="layer" aria-hidden="true"></canvas>
<div class="ground" aria-hidden="true"></div>
<main id="stage">
  <section id="intro" class="intro">
    <button id="envelope" class="envelope" type="button" aria-expanded="false">
      <span class="env-back"></span>
      <span class="letter" aria-hidden="true">
        <span class="l-top" id="letterTop"></span>
        <span class="l-script" id="letterScript"></span>
        <span class="l-star">✦</span>
      </span>
      <span class="env-front"></span>
      <span class="env-flap"><i></i></span>
      <span class="seal" aria-hidden="true">${seal}</span>
    </button>
    <p class="hint"><span class="spark">✦</span> <span id="hintText"></span> <span class="shine" id="hintShine"></span> <span class="spark">✦</span></p>
  </section>
  <section id="scene" class="scene">
    <div id="sceneWrap" class="scene-wrap" aria-hidden="true"><canvas id="sceneCanvas"></canvas></div>
    <article id="card" class="card">
      <p id="srText" class="sr-only"></p>
      <h1 id="title"></h1>
      <div id="divider" class="divider" aria-hidden="true"><span>✦</span></div>
      <p id="message" class="msg"></p>
      <p id="signature" class="sig"></p>
      <div id="actions" class="actions">
        <button id="replay" class="pill" type="button"></button>
        <button id="save" class="pill" type="button"></button>
      </div>
    </article>
  </section>
</main>
<canvas id="fx" class="layer" aria-hidden="true"></canvas>
<button id="sound" class="sound" type="button" hidden><span class="bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button>
<p id="tip" class="tip" aria-hidden="true">✦ <span id="tipText"></span> ✦</p>`);

if (TH.ground) $('.ground').style.background = TH.ground;
document.title = UI.docTitle(CONFIG.to);
$('#letterTop').textContent = UI.letterTop(CONFIG.to);
$('#letterScript').textContent = pick(TH.letterScript || TH.greet);
$('#hintText').textContent = UI.hint(isTouch);
$('#hintShine').textContent = UI.shine(CONFIG.to);
$('#tipText').textContent = TH.tip ? pick(TH.tip)(isTouch) : UI.tip(isTouch);
$('#replay').textContent = UI.replay;
$('#save').textContent = UI.save;
$('#sound').setAttribute('aria-label', UI.mute);
$('#envelope').setAttribute('aria-label', UI.aria(CONFIG.to));

/* ---------------------------------------------------------------- sprites */
function makeSprite(size, stops) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d'), r = size / 2;
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([o, rgb, a]) => grd.addColorStop(o, `rgba(${rgb},${a})`));
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  return c;
}
const glowCache = new Map();
const glow = rgb => {
  if (!glowCache.has(rgb)) glowCache.set(rgb, makeSprite(64, [[0, '255,255,255', 1], [0.14, rgb, 1], [0.4, rgb, 0.32], [1, rgb, 0]]));
  return glowCache.get(rgb);
};
const snowCrisp = makeSprite(32, [[0, '255,255,255', 1], [0.38, '250,252,255', .9], [0.6, '235,242,255', .3], [1, '235,242,255', 0]]);
const snowSoft  = makeSprite(48, [[0, '255,255,255', .9], [0.3, '245,248,255', .55], [1, '235,242,255', 0]]);
const starDot   = makeSprite(16, [[0, '255,255,255', 1], [0.35, '220,230,255', .6], [1, '220,230,255', 0]]);

function shapeSprite(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  return c;
}
const leafSprite = (hex, kind = 'oval') => shapeSprite(48, 48, (g, w, h) => {
  g.translate(w / 2, h / 2);
  const R = 21;
  g.beginPath();
  if (kind === 'maple') {                        // five pointed lobes + notch for the stem
    const P = [[-90, 1], [-62, .45], [-38, .9], [-12, .48], [16, .78], [52, .32], [90, .2]];
    const pts = [...P, ...P.slice(0, -1).reverse().map(([a, r]) => [180 - a, r])];
    pts.forEach(([a, r], i) => {
      const x = Math.cos(a * Math.PI / 180) * R * r, y = Math.sin(a * Math.PI / 180) * R * r;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    });
  } else {                                       // simple oval leaf
    g.moveTo(0, -R);
    g.bezierCurveTo(R * .78, -R * .55, R * .62, R * .5, 0, R * .9);
    g.bezierCurveTo(-R * .62, R * .5, -R * .78, -R * .55, 0, -R);
  }
  g.closePath();
  const grd = g.createRadialGradient(0, -R * .2, 2, 0, 0, R);
  grd.addColorStop(0, hex); grd.addColorStop(1, shade(hex, -.35));
  g.fillStyle = grd; g.fill();
  g.strokeStyle = shade(hex, -.45); g.lineWidth = 1.1; g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, R * .98); g.lineTo(0, -R * .72);                  // stem + midrib
  for (const t of [-.35, .05, .4]) { g.moveTo(0, R * t); g.lineTo(R * .3, R * (t - .22)); g.moveTo(0, R * t); g.lineTo(-R * .3, R * (t - .22)); }
  g.stroke();
});
const petalSprite = hex => shapeSprite(40, 40, (g, w, h) => {
  g.translate(w / 2, h / 2);
  g.beginPath();
  g.moveTo(0, -17); g.bezierCurveTo(15, -12, 12, 12, 0, 17); g.bezierCurveTo(-12, 12, -15, -12, 0, -17);
  const grd = g.createLinearGradient(0, -17, 0, 17);
  grd.addColorStop(0, shade(hex, .35)); grd.addColorStop(1, hex);
  g.fillStyle = grd; g.fill();
});
const rectSprite = hex => shapeSprite(20, 12, (g, w, h) => {
  g.fillStyle = hex; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(0, 0, w, h * .35);
});
const heartSprite = hex => shapeSprite(40, 40, (g, w, h) => {
  g.translate(w / 2, h / 2 + 2);
  g.beginPath();
  for (let i = 0; i <= 60; i++) {
    const t = i / 60 * TAU;
    g.lineTo(16 * Math.pow(Math.sin(t), 3) * 1.05, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 1.05);
  }
  g.fillStyle = hex; g.fill();
});
function shade(hex, k) {                         // k<0 darker, k>0 lighter
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = k < 0 ? 0 : 255, p = Math.abs(k);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return `rgb(${r},${g},${b})`;
}

/* ---------------------------------------------------------------- canvases */
const sky = $('#sky'), skyCtx = sky.getContext('2d');
const fx = $('#fx'), fxCtx = fx.getContext('2d');
let W = 0, H = 0;

/* ---------------------------------------------------------------- falling things
   snow | glitter | leaves | petals | confetti — chosen by the theme */
const FALL = (() => {
  const f = TH.fall || { type: 'snow' };
  const cols = f.colors || [];
  switch (f.type) {
    case 'leaves':   return { sprites: cols.flatMap(c => [leafSprite(c, 'oval'), leafSprite(c, 'maple')]), size: [9, 22], speed: [.35, 1.05], sway: 1.6, spin: true, flip: true, density: .32, alpha: [.55, .95] };
    case 'petals':   return { sprites: cols.map(petalSprite), size: [7, 15], speed: [.3, .9], sway: 1.3, spin: true, flip: true, density: .45, alpha: [.5, .9] };
    case 'confetti': return { sprites: cols.map(rectSprite), size: [5, 10], speed: [.45, 1.2], sway: 1, spin: true, flip: true, density: .38, alpha: [.55, .95] };
    case 'glitter':  return { sprites: cols.map(glow), size: [1.5, 5], speed: [.25, .8], sway: .6, twinkle: true, density: .7, alpha: [.35, 1] };
    default:         return { snow: true, density: 1 };
  }
})();
const flakes = [];
const FRONT = 0.82;
function newFlake(anywhere) {
  const z = Math.pow(Math.random(), 1.7);         // depth: most are far away
  const front = z > FRONT;
  if (FALL.snow) {
    return {
      x: rand(W), y: anywhere ? rand(H) : -12 - rand(50), z,
      r: 0.55 + z * 2.5 + (front ? rand(2.4) : 0),
      vy: 0.2 + z * 1.25 + rand(0.15),
      sw: (0.15 + rand(0.5)) * (0.4 + z), sp: rand(0.4, 1.6), ph: rand(TAU),
      a: 0.2 + z * 0.62
    };
  }
  return {
    x: rand(W), y: anywhere ? rand(H) : -20 - rand(60), z,
    r: FALL.size[0] + (FALL.size[1] - FALL.size[0]) * (0.25 + 0.75 * z),
    vy: FALL.speed[0] + (FALL.speed[1] - FALL.speed[0]) * z + rand(.1),
    sw: (0.2 + rand(0.5)) * FALL.sway * (0.4 + z), sp: rand(0.4, 1.4), ph: rand(TAU),
    a: FALL.alpha[0] + (FALL.alpha[1] - FALL.alpha[0]) * z,
    rot: rand(TAU), vr: rand(-.03, .03), fl: rand(TAU), vf: rand(.02, .06),
    spr: pickOne(FALL.sprites)
  };
}
function initFall() {
  const target = Math.round(clamp(W * H / 6200, 90, 320) * FALL.density * (reduceMotion ? .35 : 1));
  while (flakes.length < target) flakes.push(newFlake(true));
  if (flakes.length > target) flakes.length = target;
}
const stars = Array.from({ length: TH.stars === false ? 0 : 90 }, () => ({
  x: Math.random(), y: Math.pow(Math.random(), 1.35) * 0.72,
  r: rand(0.3, 1.35), ph: rand(TAU), sp: rand(0.5, 2)
}));

function resize() {
  W = innerWidth; H = innerHeight;
  for (const [cv, cx] of [[sky, skyCtx], [fx, fxCtx]]) {
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  initFall();
}
addEventListener('resize', resize);
resize();

function drawStars(t) {
  for (const s of stars) {
    const a = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.sp + s.ph));
    const d = s.r * 4;
    skyCtx.globalAlpha = a;
    skyCtx.drawImage(starDot, s.x * W - d / 2, s.y * H - d / 2, d, d);
  }
}
function drawFall(t, k) {
  const wind = Math.sin(t * 0.00012) * 0.35 + Math.sin(t * 0.00037) * 0.15;
  for (const f of flakes) {
    f.y += f.vy * k;
    f.x += (Math.sin(t * 0.001 * f.sp + f.ph) * f.sw + wind * (0.3 + f.z)) * k;
    if (f.y > H + 24) Object.assign(f, newFlake(false));
    if (f.x > W + 24) f.x = -24; else if (f.x < -24) f.x = W + 24;
    const front = f.z > FRONT;
    const ctx = front ? fxCtx : skyCtx;
    if (FALL.snow) {
      const d = f.r * (front ? 4.2 : 3.2);
      ctx.globalAlpha = front ? f.a * 0.75 : f.a;
      ctx.drawImage(front ? snowSoft : snowCrisp, f.x - d / 2, f.y - d / 2, d, d);
      continue;
    }
    let a = f.a * (front ? .8 : 1);
    if (FALL.twinkle) a *= 0.45 + 0.55 * Math.abs(Math.sin(t * 0.003 * f.sp + f.ph));
    ctx.globalAlpha = a;
    if (FALL.spin) {
      f.rot += f.vr * k; f.fl += f.vf * k;
      const c = Math.cos(f.rot), s = Math.sin(f.rot), sx = FALL.flip ? Math.cos(f.fl) : 1;
      const d = f.r * 2;
      ctx.setTransform(DPR * c * sx, DPR * s * sx, -DPR * s, DPR * c, DPR * f.x, DPR * f.y);
      ctx.drawImage(f.spr, -d / 2, -d / 2 * (f.spr.height / f.spr.width), d, d * (f.spr.height / f.spr.width));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    } else {
      const d = f.r * 4;
      ctx.drawImage(f.spr, f.x - d / 2, f.y - d / 2, d, d);
    }
  }
}

/* ---------------------------------------------------------------- stardust, confetti, fireworks */
const SPARKS = TH.sparks || ['255,214,120', '255,236,180', '255,190,92', '255,248,228'];
const sparks = [], rings = [], bits = [], rockets = [];

function burst(x, y, n = 30, power = 1, colors = SPARKS, opts = {}) {
  for (let i = 0; i < n; i++) {
    const a = rand(TAU), sp = (1.1 + rand(4.6)) * power;
    sparks.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.7 * power,
      age: 0, life: rand(700, 1600) * (opts.life || 1), size: rand(1.4, 4.8) * (opts.size || 1),
      star: Math.random() < 0.45, rot: rand(TAU), vr: rand(-0.12, 0.12),
      rgb: colors[i % colors.length], tw: rand(TAU), g: rand(0.03, 0.07) * (opts.gravity || 1)
    });
  }
  if (opts.ring !== false) rings.push({ x, y, age: 0, life: 700, max: 46 * power + 34, rgb: colors[0] });
  if (sparks.length > 1200) sparks.splice(0, sparks.length - 1200);
}
function confetti(x, y, n = 60, angle = -Math.PI / 2, spread = 0.9, power = 1, colors = TH.confetti || ['#ffd36e', '#ff7aa8', '#7ad7ff', '#b49bff', '#7dffb8']) {
  for (let i = 0; i < n; i++) {
    const a = angle + rand(-spread / 2, spread / 2), sp = rand(7, 15) * power;
    bits.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      w: rand(6, 11), h: rand(3.5, 6), rot: rand(TAU), vr: rand(-.2, .2), fl: rand(TAU), vf: rand(.08, .22),
      color: colors[i % colors.length], age: 0, life: rand(2600, 4200), ph: rand(TAU)
    });
  }
  if (bits.length > 600) bits.splice(0, bits.length - 600);
}
function firework(tx, ty, colors = SPARKS) {
  rockets.push({ sx: clamp(tx + rand(-70, 70), 10, W - 10), sy: H + 10, tx, ty, age: 0, dur: rand(750, 1050), colors, trail: 0 });
}
function star4(ctx, x, y, r, rot) {
  const c = Math.cos(rot), s = Math.sin(rot);
  ctx.setTransform(DPR * c, DPR * s, -DPR * s, DPR * c, DPR * x, DPR * y);
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.quadraticCurveTo(0, 0, 0, r);
  ctx.quadraticCurveTo(0, 0, -r, 0);
  ctx.quadraticCurveTo(0, 0, 0, -r);
  ctx.fill();
}
function drawFx(dt, k) {
  const ctx = fxCtx;
  // rockets climbing to their burst point
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.age += dt;
    const t = clamp(r.age / r.dur, 0, 1), e = easeOut(t);
    const x = r.sx + (r.tx - r.sx) * e, y = r.sy + (r.ty - r.sy) * e;
    r.trail += dt;
    if (r.trail > 22) {
      r.trail = 0;
      sparks.push({ x: x + rand(-1.5, 1.5), y, vx: rand(-.3, .3), vy: rand(.2, .9), age: 0, life: rand(350, 650), size: rand(.8, 1.6),
        star: false, rot: 0, vr: 0, rgb: '255,226,170', tw: rand(TAU), g: .01 });
    }
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 1;
    ctx.drawImage(glow('255,236,200'), x - 7, y - 7, 14, 14);
    if (t >= 1) {
      rockets.splice(i, 1);
      burst(x, y, reduceMotion ? 30 : 80, 1.9, r.colors, { gravity: 1.15, life: 1.15 });
      burst(x, y, reduceMotion ? 8 : 24, .7, ['255,250,235'], { ring: false, size: .6 });
      API.sparkle(.03);
    }
  }
  ctx.globalCompositeOperation = 'lighter';
  const drag = Math.pow(0.955, k);
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i];
    p.age += dt;
    if (p.age >= p.life) { sparks.splice(i, 1); continue; }
    p.vx *= drag; p.vy = p.vy * drag + p.g * k;
    p.x += p.vx * k; p.y += p.vy * k; p.rot += p.vr * k;
    const life = 1 - p.age / p.life;
    const a = Math.pow(life, 1.25) * (0.7 + 0.3 * Math.sin(p.age * 0.03 + p.tw));
    const d = p.size * 6;
    ctx.globalAlpha = a * 0.9;
    ctx.drawImage(glow(p.rgb), p.x - d / 2, p.y - d / 2, d, d);
    if (p.star) {
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${p.rgb})`;
      star4(ctx, p.x, p.y, p.size * 2.3, p.rot);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
  }
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i];
    r.age += dt;
    const t = r.age / r.life;
    if (t >= 1) { rings.splice(i, 1); continue; }
    ctx.globalAlpha = (1 - t) * 0.55;
    ctx.strokeStyle = `rgb(${r.rgb})`;
    ctx.lineWidth = 1.6 * (1 - t) + 0.2;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.max * easeOut(t), 0, TAU); ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';
  // confetti: paper bits with drag, gravity and a fluttering flip
  const cdrag = Math.pow(0.965, k);
  for (let i = bits.length - 1; i >= 0; i--) {
    const b = bits[i];
    b.age += dt;
    if (b.age >= b.life || b.y > H + 30) { bits.splice(i, 1); continue; }
    b.vx = b.vx * cdrag + Math.sin(b.age * 0.006 + b.ph) * 0.04 * k;
    b.vy = b.vy * cdrag + 0.16 * k;
    if (b.vy > 3.2) b.vy = 3.2;
    b.x += b.vx * k; b.y += b.vy * k; b.rot += b.vr * k; b.fl += b.vf * k;
    const c = Math.cos(b.rot), s = Math.sin(b.rot), sy = Math.cos(b.fl);
    ctx.globalAlpha = clamp((b.life - b.age) / 600, 0, 1);
    ctx.fillStyle = b.color;
    ctx.setTransform(DPR * c, DPR * s, -DPR * s * sy, DPR * c * sy, DPR * b.x, DPR * b.y);
    ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
  }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.globalAlpha = 1;
}

/* ---------------------------------------------------------------- music box
   Each theme gives a melody ([note, beats]), a chord per bar and a chime.
   Synthesised live: no audio files needed. */
const MusicBox = (() => {
  const M = TH.music;
  let ctx = null, bus, master, timer = 0, until = 0, loop = 0, muted = false, started = false;
  const BEAT = M.beat, VOL = 0.7;
  const LOOP = M.melody.reduce((s, n) => s + n[1], 0);
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(n) {
    const m = /^([A-G])(#|b)?(\d)$/.exec(n);
    const midi = 12 * (+m[3] + 1) + SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  const PARTIALS = [[1, 1, 1], [2, .3, .55], [3, .1, .3], [4.16, .055, .16]];   // music-box tine
  function impulse(sec = 2.8, decay = 3.2) {
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
  function init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.0001;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3;
    comp.attack.value = 0.003; comp.release.value = 0.25;
    bus = ctx.createGain(); bus.gain.value = 0.9;
    const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 7200;
    const rev = ctx.createConvolver(); rev.buffer = impulse();
    const wet = ctx.createGain(); wet.gain.value = 0.4;
    const dry = ctx.createGain(); dry.gain.value = 0.85;
    bus.connect(tone); tone.connect(dry); tone.connect(rev); rev.connect(wet);
    dry.connect(comp); wet.connect(comp); comp.connect(master); master.connect(ctx.destination);
    return true;
  }
  function note(f, t, vel) {
    const dur = clamp(2.4 * Math.pow(523 / f, 0.45), 1.1, 3.2);
    for (const [ratio, amp, dm] of PARTIALS) {
      const fr = f * ratio;
      if (fr > ctx.sampleRate / 2.2) continue;
      const o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = fr; o.detune.value = rand(-3, 3);
      const g = ctx.createGain();
      const end = t + dur * dm;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vel * amp, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      o.connect(g); g.connect(bus);
      o.start(t); o.stop(end + 0.05);
    }
  }
  function scheduleLoop(t0) {
    let beat = 0;
    for (const [n, d] of M.melody) {
      if (n !== '-') {
        const t = t0 + beat * BEAT + rand(-0.006, 0.006);
        const f = freq(n);
        note(f, t, 0.36);
        if (loop % 2 === 1) note(f * 2, t + 0.004, 0.06);     // sparkly octave on every second pass
      }
      beat += d;
    }
    M.chords.forEach((ch, i) => {
      const b0 = M.pickup + M.bar * i;
      if (b0 >= LOOP) return;
      note(freq(ch[0]), t0 + b0 * BEAT, 0.2);
      for (let b = 1; b < M.bar; b++) {
        if (b0 + b >= LOOP) break;
        note(freq(ch[1]), t0 + (b0 + b) * BEAT, 0.085);
        note(freq(ch[2]), t0 + (b0 + b) * BEAT + 0.012, 0.075);
      }
    });
    until = t0 + LOOP * BEAT;
    loop++;
  }
  function chime(t) {
    M.chime.forEach((n, i) => note(freq(n), t + i * 0.085, 0.17 - i * 0.015));
  }
  return {
    unlock() {                                   // inside a user gesture; music can start later
      if (!ctx && !init()) return;
      if (ctx.state !== 'running') ctx.resume();
    },
    start() {
      if (started) return;
      if (!ctx && !init()) return;
      started = true;
      if (ctx.state !== 'running') ctx.resume();
      const now = ctx.currentTime;
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(VOL, now + 0.9);
      chime(now + 0.05);
      scheduleLoop(now + 1.7);
      timer = setInterval(() => {
        if (ctx.state !== 'running') return;
        if (ctx.currentTime > until - 1.6) scheduleLoop(Math.max(until, ctx.currentTime + 0.1));
      }, 250);
    },
    sparkle(vel = 0.07) {
      if (!started || muted || ctx.state !== 'running') return;
      const hi = M.chime.slice(-4);
      note(freq(pickOne(hi)), ctx.currentTime + 0.01, vel);
    },
    chime() { if (started && !muted && ctx.state === 'running') chime(ctx.currentTime + 0.02); },
    toggle() {
      if (!started) return muted;
      muted = !muted;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      if (muted) {
        master.gain.setTargetAtTime(0.0001, now, 0.12);
        setTimeout(() => { if (muted) ctx.suspend(); }, 600);
      } else {
        ctx.resume().then(() => {
          const n = ctx.currentTime;
          master.gain.cancelScheduledValues(n);
          master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), n);
          master.gain.setTargetAtTime(VOL, n, 0.25);
        });
      }
      return muted;
    },
    visibility(hidden) {
      if (!started) return;
      if (hidden) ctx.suspend();
      else if (!muted) ctx.resume();
    }
  };
})();

/* ---------------------------------------------------------------- API for theme scenes */
// Sample the pixels of some text so particles can form it (e.g. "2027", "福").
function textPoints(text, size, family, w, h, step, cx = w / 2, cy = h / 2, weight = 700) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${weight} ${size}px ${family}`;
  while (g.measureText(text).width > w * .94 && size > 12) { size -= 4; g.font = `${weight} ${size}px ${family}`; }
  g.fillText(text, cx, cy);
  const d = g.getImageData(0, 0, c.width, c.height).data, pts = [];
  for (let y = 0; y < c.height; y += step) for (let x = 0; x < c.width; x += step) {
    if (d[(y * c.width + x) * 4 + 3] > 140) pts.push({ x: x + rand(-step * .3, step * .3), y: y + rand(-step * .3, step * .3) });
  }
  return pts;
}
const API = {
  rand, clamp, easeOut, easeBack, TAU, glow, reduceMotion, isTouch, lang, REC,
  burst, confetti, firework, textPoints, shade, leafSprite, heartSprite,
  sparkle: v => MusicBox.sparkle(v), chime: () => MusicBox.chime(),
  viewport: () => ({ W, H }),
  serif: () => getComputedStyle(root).getPropertyValue('--serif'),
  script: () => getComputedStyle(root).getPropertyValue('--script')
};

/* ---------------------------------------------------------------- the theme's scene */
const Scene = (() => {
  const wrap = $('#sceneWrap'), cv = $('#sceneCanvas'), ctx = cv.getContext('2d');
  const impl = TH.scene(API);
  let w = 0, h = 0, running = false, t0 = 0, built = false;
  function size() {
    const r = wrap.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (Math.abs(r.width - w) < 1 && Math.abs(r.height - h) < 1) return;
    w = r.width; h = r.height;
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    impl.build(w, h);
    built = true;
  }
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(wrap);
  else addEventListener('resize', size);
  return {
    canvas: cv,
    start() { w = h = 0; size(); running = true; t0 = performance.now(); impl.restart && impl.restart(); },
    frame(now) {
      if (!running || !built) return;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      impl.frame(ctx, now - t0, w, h);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
    },
    anchor() {
      if (!built) return null;
      const p = impl.anchor(w, h), r = cv.getBoundingClientRect();
      return { x: r.left + p.x, y: r.top + p.y };
    },
    tap(px, py) {
      if (!running || !built || !impl.tap) return false;
      const r = cv.getBoundingClientRect();
      const inside = px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
      return impl.tap(px - r.left, py - r.top, inside, px, py) === true;
    },
    finale() { return impl.finale ? impl.finale() === true : false; }
  };
})();

/* ---------------------------------------------------------------- comet trail (mouse / finger slide) */
const Trail = (() => {
  let lx = 0, ly = 0, lt = 0, active = false, travelled = 0, lastNote = 0;
  const STEP = reduceMotion ? 18 : 7, POP_EVERY = 150;
  function spark(x, y, dx, dy, speed) {
    const back = 0.12 + Math.min(speed, 3) * 0.08;
    sparks.push({
      x: x + rand(-3, 3), y: y + rand(-3, 3),
      vx: -dx * back + rand(-.55, .55), vy: -dy * back + rand(-.75, .25),
      age: 0, life: rand(500, 1000), size: rand(1, 2.4) + Math.min(speed, 2) * .5,
      star: Math.random() < .3, rot: rand(TAU), vr: rand(-.12, .12),
      rgb: pickOne(SPARKS), tw: rand(TAU), g: 0.018
    });
  }
  return {
    reset() { active = false; },
    move(x, y) {
      const now = performance.now();
      if (!active || now - lt > 180) { active = true; lx = x; ly = y; lt = now; travelled = 0; return; }
      const dx = x - lx, dy = y - ly, dist = Math.hypot(dx, dy);
      if (dist < 2) return;
      const speed = dist / Math.max(1, now - lt);
      const ux = dx / dist, uy = dy / dist;
      const n = Math.min(Math.ceil(dist / STEP), 14);
      for (let i = 1; i <= n; i++) spark(lx + dx * i / n, ly + dy * i / n, ux, uy, speed);
      travelled += dist;
      if (travelled > POP_EVERY) {
        travelled = 0;
        burst(x, y, reduceMotion ? 5 : 10, .45);
        if (now - lastNote > 160) { lastNote = now; MusicBox.sparkle(.035); }
      }
      if (sparks.length > 1200) sparks.splice(0, sparks.length - 1200);
      lx = x; ly = y; lt = now;
    }
  };
})();

/* ---------------------------------------------------------------- typewriter */
// Latin words stay unbroken (.word = nowrap); Chinese characters are left loose
// so a line can wrap between any two of them. Newlines become <br>.
function prepare(el, text) {
  el.textContent = '';
  el.setAttribute('aria-hidden', 'true');
  const chars = [];
  const ch = (parent, c) => {
    const s = document.createElement('span'); s.className = 'ch'; s.textContent = c;
    parent.appendChild(s); chars.push(s);
  };
  for (const tok of text.split(/(\s+)/)) {
    if (!tok) continue;
    if (/^\s+$/.test(tok)) {
      const breaks = (tok.match(/\n/g) || []).length;
      if (breaks) for (let i = 0; i < breaks; i++) el.appendChild(document.createElement('br'));
      else ch(el, ' ');
      continue;
    }
    let wd = null;
    for (const c of tok) {
      if (CJK.test(c)) { wd = null; ch(el, c); }
      else {
        if (!wd) { wd = document.createElement('span'); wd.className = 'word'; el.appendChild(wd); }
        ch(wd, c);
      }
    }
  }
  return chars;
}

const titleEl = $('#title'), msgEl = $('#message'), sigEl = $('#signature');
const divider = $('#divider'), replayBtn = $('#replay'), tip = $('#tip'), actions = $('#actions');
const speedK = reduceMotion ? .45 : 1;
const zhK = lang === 'zh' ? 2.2 : 1;     // one Chinese character ≈ a short word: type it slower
let BLOCKS = [];
function buildBlocks() {
  BLOCKS = [
    { el: titleEl, text: UI.title(CONFIG.to), speed: 88 * (lang === 'zh' ? 1.6 : 1) },
    { el: msgEl, text: CONFIG.message, speed: 44 * zhK },
    CONFIG.from ? { el: sigEl, text: UI.sig(CONFIG.from), speed: 115 } : null
  ].filter(Boolean);
  sigEl.hidden = !CONFIG.from;
  if (!CONFIG.from) sigEl.textContent = '';
  BLOCKS.forEach(b => { b.chars = prepare(b.el, b.text); });
  $('#srText').textContent = BLOCKS.map(b => b.text).join(' ');
}
buildBlocks();

const caret = document.createElement('span');
caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
let typeToken = 0;

async function typeAll() {
  const my = ++typeToken;
  actions.classList.remove('show');
  divider.classList.remove('show');
  caret.classList.remove('done');
  BLOCKS.forEach(b => b.chars.forEach(c => c.classList.remove('on')));
  for (let bi = 0; bi < BLOCKS.length; bi++) {
    const b = BLOCKS[bi];
    b.el.prepend(caret);
    await sleep(bi === 0 ? 200 : 120);
    for (const chEl of b.chars) {
      if (my !== typeToken) return;
      chEl.classList.add('on');
      chEl.after(caret);
      const c = chEl.textContent;
      let d = b.speed * rand(0.6, 1.4);
      if (',;，、；：'.includes(c)) d += 280;
      else if ('.!?。！？…'.includes(c)) d += 520;
      else if (c === ' ') d *= 0.6;
      await sleep(d * speedK);
    }
    if (my !== typeToken) return;
    if (bi === 0) { await sleep(320); divider.classList.add('show'); await sleep(700); }
    else await sleep(520);
  }
  caret.classList.add('done');
  const r = BLOCKS[BLOCKS.length - 1].el.getBoundingClientRect();
  burst(r.right - 40, r.top + r.height / 2, 26, .8);
  if (REC) {                            // closing shot for the video
    await sleep(1600);
    if (my !== typeToken) return;
    if (!Scene.finale()) {
      const s = Scene.anchor();
      if (s) burst(s.x, s.y, 40, 1.1);
    }
    return;
  }
  actions.classList.add('show');
  tip.classList.add('show');
  setTimeout(() => tip.classList.remove('show'), 7500);
}

/* ---------------------------------------------------------------- opening sequence */
const intro = $('#intro'), env = $('#envelope'), scene = $('#scene'), soundBtn = $('#sound');
let opened = false;

function openCard() {
  if (opened) return;
  opened = true;
  MusicBox.start();                         // inside the user gesture, or after MusicBox.unlock()
  env.classList.add('is-opening');
  intro.classList.add('is-opened');
  env.setAttribute('aria-expanded', 'true');
  setTimeout(() => env.classList.add('flap-behind'), 900);
  setTimeout(() => {
    const r = env.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.2, reduceMotion ? 24 : 64, 1.7);
  }, 1450);
  setTimeout(() => intro.classList.add('is-leaving'), 2400);
  setTimeout(() => {
    scene.classList.add('is-visible');
    Scene.start();
    soundBtn.hidden = false;
    requestAnimationFrame(() => soundBtn.classList.add('show'));
  }, 2900);
  setTimeout(() => { intro.hidden = true; }, 3500);
  setTimeout(() => {
    const s = Scene.anchor();
    if (s) burst(s.x, s.y, 22, .7);
  }, 2900 + 2400);
  setTimeout(typeAll, 2900 + 2000);
}
env.addEventListener('click', openCard);

/* ---------------------------------------------------------------- preview mode (inside the maker)
   Skips the envelope and shows the finished card at once. The maker sends
   {type:'card-preview', to, from, msg} with postMessage as the user types. */
if (PREVIEW) {
  opened = true;
  intro.hidden = true;
  scene.classList.add('is-visible');
  Scene.start();
  const showAll = () => { BLOCKS.forEach(b => b.chars.forEach(c => c.classList.add('on'))); divider.classList.add('show'); };
  showAll();
  addEventListener('message', e => {
    if (e.origin !== location.origin || !e.data || e.data.type !== 'card-preview') return;
    CONFIG.to = clean(e.data.to, 24);
    CONFIG.from = clean(e.data.from, 24);
    CONFIG.message = clean(e.data.msg, 300) || pick(TH.message);
    buildBlocks();
    showAll();
  });
}
replayBtn.addEventListener('click', () => { Scene.start(); setTimeout(typeAll, 900); });

soundBtn.addEventListener('click', () => {
  const m = MusicBox.toggle();
  soundBtn.classList.toggle('muted', m);
  soundBtn.setAttribute('aria-label', m ? UI.play : UI.mute);
});
document.addEventListener('visibilitychange', () => MusicBox.visibility(document.hidden));

/* ---------------------------------------------------------------- recording mode */
if (REC) {
  const cover = document.createElement('div');
  cover.className = 'rec-cover';
  const box = document.createElement('div');
  const h = document.createElement('h2'); h.textContent = UI.recTitle;
  const p = document.createElement('p'); p.textContent = UI.recBody(isTouch);
  const sm = document.createElement('small'); sm.textContent = UI.recSmall;
  box.append(h, p, sm); cover.appendChild(box);
  document.body.appendChild(cover);
  cover.addEventListener('click', () => {     // click (not pointerdown): iOS only unlocks audio on touchend/click
    if (cover.classList.contains('gone')) return;
    MusicBox.unlock();
    cover.classList.add('gone');
    setTimeout(() => cover.remove(), 800);
    setTimeout(openCard, 2200);             // ~2s of the sealed envelope as the opening shot
  });
}

/* ---------------------------------------------------------------- taps, mouse, swipes */
addEventListener('pointerdown', e => {
  if (e.target.closest && e.target.closest('.rec-cover, .shot, .sound')) return;
  Trail.reset();
  if (opened && Scene.tap(e.clientX, e.clientY)) return;
  burst(e.clientX, e.clientY, reduceMotion ? 14 : 32, 1);
  MusicBox.sparkle();
}, { passive: true });
// Mouse: every movement. Touch: touchmove keeps firing even when the browser
// treats the gesture as a scroll (pointermove would be cancelled).
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') Trail.move(e.clientX, e.clientY); }, { passive: true });
addEventListener('touchmove', e => { const t = e.touches[0]; if (t) Trail.move(t.clientX, t.clientY); }, { passive: true });
addEventListener('touchend', () => Trail.reset(), { passive: true });
document.addEventListener('mouseleave', () => Trail.reset());

/* ---------------------------------------------------------------- save as image (1080×1920) */
const CardImage = (() => {
  const CW = 1080, CH = 1920;
  const css = name => getComputedStyle(root).getPropertyValue(name).trim();
  const PUNCT_CLOSE = /^[，。、！？；：）》」』”’…,.!?;:)]$/;
  const UNIT = new RegExp(`${CJK.source}|[^\\s${CJK.source.slice(1, -1)}]+|\\s+`, 'g');
  function wrap(g, text, maxW) {
    const lines = [];
    for (const para of text.split('\n')) {
      const units = para.match(UNIT) || [''];
      let line = '';
      for (const u of units) {
        const test = line + u;
        if (line.trim() && !PUNCT_CLOSE.test(u) && g.measureText(test.trimEnd()).width > maxW) {
          lines.push(line.trimEnd());
          line = u.trimStart();
        } else line = test;
      }
      lines.push(line.trimEnd());
    }
    return lines;
  }
  function glowBlob(g, x, y, rx, ry, color, stop = .62) {
    g.save();
    g.translate(x, y); g.scale(1, ry / rx);
    const r = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    r.addColorStop(0, color); r.addColorStop(stop, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(-rx, -rx, rx * 2, rx * 2);
    g.restore();
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  async function render() {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    const SCRIPT = css('--script'), SERIF = css('--serif');
    const ACC = css('--accent-rgb'), GLW = css('--glow-rgb');
    const zh = lang === 'zh';
    const c = document.createElement('canvas'); c.width = CW; c.height = CH;
    const g = c.getContext('2d');

    const bg = g.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, SKY[0]); bg.addColorStop(.46, SKY[1]); bg.addColorStop(.78, SKY[2]); bg.addColorStop(1, SKY[3]);
    g.fillStyle = bg; g.fillRect(0, 0, CW, CH);
    for (const [x, y, rx, ry, col] of GLOWS) glowBlob(g, CW * x / 100, CH * y / 100, rx * 1.1, ry * 1.4, col);
    if (TH.stars !== false) for (let i = 0; i < 150; i++) {
      const d = rand(2, 7);
      g.globalAlpha = rand(.25, .85);
      g.drawImage(starDot, rand(CW) - d / 2, Math.pow(Math.random(), 1.35) * CH * .7 - d / 2, d, d);
    }
    for (let i = 0; i < (FALL.snow ? 170 : 70); i++) {
      const z = Math.pow(Math.random(), 1.7);
      g.globalAlpha = .25 + z * .6;
      if (FALL.snow) {
        const d = (1.4 + z * 6) * 3.2 * (z > .85 ? 1.6 : 1);
        g.drawImage(z > .85 ? snowSoft : snowCrisp, rand(CW) - d / 2, rand(CH) - d / 2, d, d);
      } else {
        const spr = pickOne(FALL.sprites), d = (FALL.size[0] + (FALL.size[1] - FALL.size[0]) * z) * (FALL.twinkle ? 5 : 2.6);
        g.save(); g.translate(rand(CW), rand(CH)); g.rotate(FALL.spin ? rand(TAU) : 0); g.scale(FALL.flip ? rand(.3, 1) : 1, 1);
        g.drawImage(spr, -d / 2, -d / 2 * spr.height / spr.width, d, d * spr.height / spr.width);
        g.restore();
      }
    }
    g.globalAlpha = 1;

    const cardW = 920, padX = 84, innerW = cardW - padX * 2;
    let tSize = zh ? 84 : 100, tLines;
    for (; tSize >= 56; tSize -= 4) {          // long names: shrink the title to fit in two lines
      g.font = `400 ${tSize}px ${SCRIPT}`;
      tLines = wrap(g, UI.title(CONFIG.to), innerW);
      if (tLines.length <= 2) break;
    }
    const tLH = tSize * 1.25;
    let mSize = 48, mLH, mLines;
    for (; mSize >= 32; mSize -= 2) {          // shrink long messages so scene + card still fit
      g.font = `500 ${mSize}px ${SERIF}`;
      mLines = wrap(g, CONFIG.message, innerW);
      mLH = mSize * (zh ? 1.8 : 1.7);
      if (mLines.length * mLH <= 860) break;
    }
    const sSize = zh ? 54 : 78;
    const sigH = CONFIG.from ? 36 + sSize * 1.3 : 0;
    const cardH = 96 + tLines.length * tLH + 96 + mLines.length * mLH + sigH + 84;
    const cardX = (CW - cardW) / 2, cardY = CH - 130 - cardH;

    const tc = Scene.canvas;
    const top = 110, sceneH = Math.max(320, cardY - top - 50);
    if (tc.width && tc.height) {
      const k = Math.min(960 / tc.width, sceneH / tc.height, 1.6);   // cap upscaling to stay sharp
      const w = tc.width * k, h = tc.height * k;
      g.globalCompositeOperation = TH.exportBlend || 'lighter';
      g.drawImage(tc, (CW - w) / 2, top + (sceneH - h) / 2, w, h);
      g.globalCompositeOperation = 'source-over';
    }

    g.save();
    g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 70; g.shadowOffsetY = 26;
    roundRect(g, cardX, cardY, cardW, cardH, 40);
    g.fillStyle = TH.cardFill || 'rgba(16,18,44,.72)'; g.fill();
    g.restore();
    const sheen = g.createLinearGradient(0, cardY, 0, cardY + cardH);
    sheen.addColorStop(0, 'rgba(255,246,230,.10)'); sheen.addColorStop(1, 'rgba(255,246,230,.03)');
    roundRect(g, cardX, cardY, cardW, cardH, 40); g.fillStyle = sheen; g.fill();
    g.lineWidth = 2; g.strokeStyle = `rgba(${ACC},.34)`; g.stroke();
    roundRect(g, cardX + 16, cardY + 16, cardW - 32, cardH - 32, 28);
    g.lineWidth = 1.5; g.strokeStyle = `rgba(${ACC},.15)`; g.stroke();
    g.fillStyle = css('--card-dot'); g.beginPath(); g.arc(CW / 2, cardY, 30, 0, TAU); g.fill();
    g.fillStyle = css('--accent'); g.shadowColor = `rgba(${GLW},.9)`; g.shadowBlur = 20;
    star4(g, CW / 2 / DPR, cardY / DPR, 17 / DPR, 0);   // star4 applies DPR; cancel it out
    g.setTransform(1, 0, 0, 1, 0, 0); g.shadowBlur = 0;

    g.textAlign = 'center'; g.textBaseline = 'middle';
    let y = cardY + 96 + tLH / 2 - 8;
    g.font = `400 ${tSize}px ${SCRIPT}`;
    g.fillStyle = css('--title'); g.shadowColor = `rgba(${GLW},.55)`; g.shadowBlur = 26;
    for (const line of tLines) { g.fillText(line, CW / 2, y); y += tLH; }
    g.shadowBlur = 0;

    y += 4;
    const dw = innerW * .36;
    for (const dir of [-1, 1]) {
      const x0 = CW / 2 + dir * 30, x1 = CW / 2 + dir * (30 + dw);
      const lg = g.createLinearGradient(x0, 0, x1, 0);
      lg.addColorStop(0, `rgba(${ACC},.8)`); lg.addColorStop(1, `rgba(${ACC},0)`);
      g.fillStyle = lg; g.fillRect(Math.min(x0, x1), y - 1, dw, 2);
    }
    g.font = `400 26px ${SERIF}`; g.fillStyle = css('--accent'); g.fillText('✦', CW / 2, y);
    y += 96 - tLH / 2 + mLH / 2 - 10;

    g.font = `500 ${mSize}px ${SERIF}`; g.fillStyle = css('--text');
    for (const line of mLines) { g.fillText(line, CW / 2, y); y += mLH; }

    if (CONFIG.from) {
      y += 36 + sSize * .65 - mLH / 2;
      g.textAlign = 'right';
      g.font = `400 ${sSize}px ${zh ? SERIF : SCRIPT}`;
      g.fillStyle = css('--accent'); g.shadowColor = `rgba(${GLW},.45)`; g.shadowBlur = 18;
      g.fillText(UI.sig(CONFIG.from), cardX + cardW - padX, y);
      g.shadowBlur = 0;
    }
    return c;
  }

  let viewer = null;
  function show(dataUrl, blob) {
    if (viewer) viewer.remove();
    viewer = document.createElement('div');
    viewer.className = 'shot';
    viewer.setAttribute('role', 'dialog');
    const img = new Image(); img.src = dataUrl; img.alt = UI.docTitle(CONFIG.to);
    const p = document.createElement('p'); p.textContent = UI.saveHint(isTouch);
    const btns = document.createElement('div'); btns.className = 'btns';
    const name = `${TH.id}-card${CONFIG.to ? '-' + CONFIG.to : ''}.jpg`;
    if (!isTouch) {
      const a = document.createElement('a'); a.className = 'pill'; a.href = dataUrl; a.download = name; a.textContent = UI.download;
      btns.appendChild(a);
    }
    const file = blob && typeof File === 'function' ? new File([blob], name, { type: 'image/jpeg' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      const s = document.createElement('button'); s.type = 'button'; s.className = 'pill'; s.textContent = UI.share;
      s.addEventListener('click', () => navigator.share({ files: [file] }).catch(() => {}));
      btns.appendChild(s);
    }
    const x = document.createElement('button'); x.type = 'button'; x.className = 'pill'; x.textContent = UI.close;
    x.addEventListener('click', () => { viewer.remove(); viewer = null; });
    btns.appendChild(x);
    viewer.append(img, p, btns);
    document.body.appendChild(viewer);
  }
  return {
    async save(btn) {
      btn.disabled = true; btn.textContent = UI.saving;
      try {
        const c = await render();
        const dataUrl = c.toDataURL('image/jpeg', .92);
        const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', .92));
        show(dataUrl, blob);
      } finally { btn.disabled = false; btn.textContent = UI.save; }
    }
  };
})();
$('#save').addEventListener('click', e => CardImage.save(e.currentTarget));

/* ---------------------------------------------------------------- main loop */
let last = performance.now();
function loop(now) {
  const dt = Math.min(50, now - last); last = now;
  const k = dt / 16.667;
  skyCtx.clearRect(0, 0, W, H);
  fxCtx.clearRect(0, 0, W, H);
  drawStars(now);
  drawFall(now, k);
  skyCtx.globalAlpha = 1; fxCtx.globalAlpha = 1;
  drawFx(dt, k);
  Scene.frame(now);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
