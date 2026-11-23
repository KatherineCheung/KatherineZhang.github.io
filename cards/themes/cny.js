/* Lunar New Year (春节) — swinging red lanterns, a golden 福 in a diamond, red-packet envelope, 《新年好》. */
(window.CardThemes = window.CardThemes || {}).cny = {
  id: 'cny', emoji: '🧧',
  name: { en: 'Lunar New Year', zh: '春节' },
  cardName: { en: 'Lunar New Year card', zh: '新春贺卡' },
  greet: { en: 'Happy Lunar New Year', zh: '新春快乐' },
  occasion: { en: 'Lunar New Year surprise', zh: '新春祝福' },
  letterScript: { en: 'Happy New Year', zh: '新春快乐' },
  message: {
    en: 'Happy Lunar New Year! Wishing you good health, good fortune and a year as bright and warm as these lanterns.',
    zh: '新春快乐！愿你新的一年身体健康、万事顺意，日子红红火火，笑容常在。'
  },
  presets: {
    zh: [
      ['吉祥', '新春快乐！愿你新的一年身体健康、万事顺意，日子红红火火，笑容常在。'],
      ['家人', '给最爱的家人拜年啦！祝爸妈身体健康、福寿安康，我们一家团团圆圆！'],
      ['朋友', '新春快乐！祝你新的一年好运连连，钱包鼓鼓，想做的事都能成 🧧'],
      ['俏皮', '红包我就不发了，先送你一个「福」字：新年福气满满，好运加倍！']
    ],
    en: [
      ['Lucky', 'Happy Lunar New Year! Wishing you good health, good fortune and a year as bright and warm as these lanterns.'],
      ['Family', 'Sending New Year wishes to my favorite people: good health, lots of happiness and plenty of time together!'],
      ['Friend', 'Wishing you luck that never runs out, a full wallet and every plan coming true this year 🧧'],
      ['Playful', 'No red envelope this time, but here’s a 福 for you — may luck and joy find you all year!']
    ]
  },
  tip: { en: t => `${t ? 'Tap' : 'Click'} the sky to launch a firework`, zh: t => `${t ? '轻点' : '点击'}天空，放一朵烟花` },

  vars: {
    accent: '#f5c66a', 'accent-soft': '#ffe6a8', 'accent-rgb': '245,198,106', 'glow-rgb': '255,170,90',
    title: '#ffd78a', text: '#fff1e0', 'card-dot': '#2a0a0e', night: '#1a0508',
    'paper-a': '#d8262c', 'paper-b': '#a8141c', 'front-a': '#b9161e', 'front-b': '#d9282e',
    'flap-a': '#e0353a', 'flap-b': '#b51a20', 'flapin-a': '#8e1016', 'flapin-b': '#7a0d12',
    ink: '#8a1c1c', 'ink-script': '#b3262a', 'ink-star': '#d4a03c',
    'seal-1': '#fff0b8', 'seal-2': '#f2c14e', 'seal-3': '#c48a1c', 'seal-4': '#7a520c', 'seal-glow': '255,200,90', 'env-glow': '255,110,70'
  },
  sky: ['#12030a', '#2a0710', '#3a0c12', '#2a0e0e'],
  glows: [[50, 112, 1100, 620, 'rgba(255,90,50,.26)'], [85, -8, 700, 480, 'rgba(255,190,90,.12)'], [8, 12, 600, 420, 'rgba(255,60,80,.10)']],
  ground: 'radial-gradient(60% 100% at 50% 100%, rgba(255,120,60,.14), transparent 72%)',
  cardFill: 'rgba(48,10,14,.74)',
  sealText: '福',
  fall: { type: 'confetti', colors: ['#e8262c', '#ffcf5a', '#ff8a3d', '#c8141a'] },
  sparks: ['255,90,70', '255,200,100', '255,150,60', '255,236,180'],
  confetti: ['#e8262c', '#ffcf5a', '#ff8a3d', '#fff0c0'],
  stars: true,
  music: {                                     // 《新年好》 (traditional melody), C major, 4/4
    beat: 0.4, pickup: 0, bar: 4,
    melody: [
      ['C6', 1], ['C6', 1], ['C6', 1], ['G5', 1],
      ['E6', 1], ['E6', 1], ['E6', 1], ['C6', 1],
      ['C6', 1], ['E6', 1], ['G6', 1], ['G6', 1],
      ['F6', 1], ['E6', 1], ['D6', 2],
      ['D6', 1], ['E6', 1], ['F6', 1], ['F6', 1],
      ['E6', 1], ['D6', 1], ['E6', 1], ['C6', 1],
      ['C6', 1], ['E6', 1], ['D6', 1], ['G5', 1],
      ['B5', 1], ['D6', 1], ['C6', 2]
    ],
    chords: [['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'],
             ['G3', 'B3', 'F4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']],
    chime: ['C6', 'D6', 'E6', 'G6', 'A6', 'C7']
  },

  scene(api) {
    const { rand, clamp, easeOut, TAU, glow, reduceMotion } = api;
    const COL = { gold: '255,206,110', champagne: '255,236,190', red: '255,70,60', orange: '255,140,60' };
    const SPR = {}; for (const k in COL) SPR[k] = glow(COL[k]);
    const LGLOW = glow('255,90,50');
    const PAL = [['255,80,60', '255,210,120'], ['255,200,90', '255,245,210'], ['255,120,60', '255,60,60'], ['255,215,130', '255,90,90']];
    const KAI = `'Kaiti SC','STKaiti','KaiTi','Noto Serif SC','Songti SC','Noto Sans SC','WenQuanYi Zen Hei','PingFang SC','Microsoft YaHei',serif`;
    const pick = a => a[(Math.random() * a.length) | 0];
    let parts = [], G = null, nextFw = 3200;

    function lantern(ctx, L, el, k) {
      const ang = .09 * Math.sin(el * .0015 + L.ph);
      const { rx, ry } = G;
      ctx.save();
      ctx.translate(L.x, -4);
      ctx.rotate(ang);
      ctx.globalAlpha = k;
      const cy = L.len + ry;
      ctx.strokeStyle = 'rgba(230,180,90,.8)'; ctx.lineWidth = 1.2;            // string
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L.len); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';                                 // warm glow
      ctx.globalAlpha = .55 * k * (.85 + .15 * Math.sin(el * .004 + L.ph));
      ctx.drawImage(LGLOW, -rx * 2, cy - ry * 2, rx * 4, ry * 4);   // stays inside the canvas: no clipped edges
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = k;
      const body = ctx.createRadialGradient(-rx * .2, cy - ry * .25, 2, 0, cy, rx * 1.15);
      body.addColorStop(0, '#ffc27a'); body.addColorStop(.45, '#ec3a2c'); body.addColorStop(1, '#8c0c12');
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(0, cy, rx, ry, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(110,8,10,.45)'; ctx.lineWidth = 1;               // ribs
      for (const f of [.38, .72]) { ctx.beginPath(); ctx.ellipse(0, cy, rx * f, ry, 0, 0, TAU); ctx.stroke(); }
      ctx.fillStyle = '#e9b949';                                                // caps
      ctx.fillRect(-rx * .48, cy - ry - ry * .12, rx * .96, ry * .2);
      ctx.fillRect(-rx * .48, cy + ry - ry * .08, rx * .96, ry * .2);
      ctx.strokeStyle = '#e9b949'; ctx.lineWidth = 1.1;                         // tassel
      const ty = cy + ry + ry * .12, sway = Math.sin(el * .002 + L.ph) * 2;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 1.6, ty); ctx.lineTo(i * 2.2 + sway, ty + ry * .7); ctx.stroke(); }
      ctx.restore();
    }

    return {
      build(w, h) {
        parts = [];
        const cx = w / 2, cy = h * .58, D = Math.min(w * .3, h * .33);
        const dens = clamp((w * h) / (380 * 430), .45, 1) * (reduceMotion ? .6 : 1);
        const V = [[0, -D], [D, 0], [0, D], [-D, 0]];
        const nE = Math.round(46 * dens);
        for (let e = 0; e < 4; e++) {                                           // diamond outline (斗方)
          const [ax, ay] = V[e], [bx, by] = V[(e + 1) % 4];
          for (let i = 0; i < nE; i++) {
            const t = i / nE;
            parts.push({ tx: cx + ax + (bx - ax) * t, ty: cy + ay + (by - ay) * t, size: rand(1, 1.7), col: 'gold', at: (e + t) * 380, edge: true, tw: rand(TAU) });
            if (i % 2 === 0) parts.push({ tx: cx + (ax + (bx - ax) * t) * .88, ty: cy + (ay + (by - ay) * t) * .88, size: rand(.6, 1), col: 'champagne', at: 300 + (e + t) * 380, edge: true, tw: rand(TAU) });
          }
        }
        const nF = Math.round(260 * dens);                                      // red glow inside
        for (let i = 0; i < nF; i++) {
          let x, y; do { x = rand(-D, D); y = rand(-D, D); } while (Math.abs(x) + Math.abs(y) > D * .86);
          parts.push({ tx: cx + x, ty: cy + y, size: rand(.8, 1.6), col: Math.random() < .7 ? 'red' : 'orange', at: 600 + rand(900), dim: .45, edge: true, tw: rand(TAU) });
        }
        const step = Math.max(2, Math.round(D / 30));
        const pts = api.textPoints('福', D * 1.12, KAI, w, h, step, cx, cy + D * .04, 700);
        for (const p of pts) {
          parts.push({ tx: p.x, ty: p.y, sx: cx + rand(-w * .6, w * .6), sy: -rand(20, 120), size: rand(1.1, 2), col: Math.random() < .75 ? 'gold' : 'champagne', at: 1200 + rand(900), tw: rand(TAU) });
        }
        const rx = clamp(w * .075, 16, 32);
        G = { cx, cy, D, rx, ry: rx * 1.12, lanterns: [{ x: w * .16, len: h * .16, ph: 0 }, { x: w * .84, len: h * .24, ph: 1.4 }] };
      },
      restart() { nextFw = 3200; },
      frame(ctx, el, w, h) {
        const { cx, cy, D } = G;
        const lk = easeOut(clamp(el / 1100, 0, 1));
        for (const L of G.lanterns) lantern(ctx, L, el, lk);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = .3 * easeOut(clamp(el / 1600, 0, 1));
        ctx.drawImage(SPR.red, cx - D * 1.5, cy - D * 1.5, D * 3, D * 3);
        for (const p of parts) {
          const kk = clamp((el - p.at) / (p.edge ? 600 : 1300), 0, 1);
          if (kk <= 0) continue;
          const k = easeOut(kk);
          const x = p.edge ? p.tx : p.sx + (p.tx - p.sx) * k;
          const y = p.edge ? p.ty + (1 - k) * 8 : p.sy + (p.ty - p.sy) * k;
          const tw = .68 + .32 * Math.sin(el * .003 + p.tw);
          const s = p.size * 4.2;
          ctx.globalAlpha = k * tw * (p.dim || 1);
          ctx.drawImage(SPR[p.col], x - s / 2, y - s / 2, s, s);
        }
        if (el > nextFw) {
          nextFw = el + (reduceMotion ? rand(4000, 6000) : rand(2200, 4200));
          const { W, H } = api.viewport();
          api.firework(rand(W * .12, W * .88), rand(H * .08, H * .38), pick(PAL));
        }
      },
      anchor() { return { x: G.cx, y: G.cy - G.D - 8 }; },
      tap(x, y, inside, px, py) {
        api.firework(px, Math.min(py, api.viewport().H * .8), pick(PAL));
        return true;
      }
    };
  }
};
