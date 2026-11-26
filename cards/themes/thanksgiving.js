/* Thanksgiving — an autumn leaf wreath around a candle, falling maple leaves, a warm original tune. */
(window.CardThemes = window.CardThemes || {}).thanksgiving = {
  id: 'thanksgiving', emoji: '🍂',
  name: { en: 'Thanksgiving', zh: '感恩节' },
  cardName: { en: 'Thanksgiving card', zh: '感恩节贺卡' },
  greet: { en: 'Happy Thanksgiving', zh: '感恩节快乐' },
  occasion: { en: 'Thanksgiving card', zh: '感恩节贺卡' },
  letterScript: { en: 'Give Thanks', zh: '感恩有你' },
  message: {
    en: 'Thank you for being someone I’m truly grateful for. Wishing you a warm table, a full heart and a season of good things.',
    zh: '感谢有你，让我的生活多了很多温暖。愿你餐桌丰盛，心里满满，日子一直好好的。'
  },
  presets: {
    zh: [
      ['感谢', '感谢有你，让我的生活多了很多温暖。愿你餐桌丰盛，心里满满，日子一直好好的。'],
      ['家人', '谢谢你们给我的家、给我的爱。今天想好好说一声：有你们真好，感恩节快乐！'],
      ['朋友', '谢谢这一年你的陪伴和帮忙，能认识你真的很幸运。感恩节快乐！'],
      ['俏皮', '今天的火鸡我负责吃，感谢的话我负责说：谢谢你一直这么好 🦃']
    ],
    en: [
      ['Grateful', 'Thank you for being someone I’m truly grateful for. Wishing you a warm table, a full heart and a season of good things.'],
      ['Family', 'Thank you for giving me a home and so much love. Today I just want to say: I’m so lucky to have you. Happy Thanksgiving!'],
      ['Friend', 'Thank you for being there for me this year. I’m really lucky to know you. Happy Thanksgiving!'],
      ['Playful', 'I’ll handle the turkey, you handle being awesome. Thanks for always being you 🦃']
    ]
  },

  vars: {
    accent: '#f0b45a', 'accent-soft': '#ffdca0', 'accent-rgb': '240,180,90', 'glow-rgb': '255,160,70',
    title: '#ffcf7d', text: '#fbefe0', 'card-dot': '#21120a', night: '#140b06',
    'paper-a': '#c9a074', 'paper-b': '#a87d52', 'front-a': '#b88d60', 'front-b': '#d1ab7f',
    'flap-a': '#d9b88c', 'flap-b': '#b78f62', 'flapin-a': '#9a724a', 'flapin-b': '#86613c',
    ink: '#6b3f1d', 'ink-script': '#8a4b1c', 'ink-star': '#c7812e',
    'seal-1': '#d8664a', 'seal-2': '#9a2c1e', 'seal-3': '#621a12', 'seal-4': '#3a0f0a', 'seal-glow': '255,140,70', 'env-glow': '255,170,100'
  },
  sky: ['#0e0709', '#1d0d0c', '#2f160e', '#3a1d0f'],
  glows: [[50, 112, 1100, 620, 'rgba(255,140,60,.28)'], [85, -8, 700, 480, 'rgba(255,170,120,.10)'], [8, 12, 600, 420, 'rgba(170,60,90,.12)']],
  ground: 'radial-gradient(60% 100% at 50% 100%, rgba(255,160,80,.12), transparent 72%)',
  cardFill: 'rgba(34,16,12,.74)',
  sealSvg: `<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <defs><g id="leaf"><path d="M50 18c18 10 26 30 16 48-6 10-16 14-16 14s-10-4-16-14c-10-18-2-38 16-48z"/><path d="M50 28v56M50 46l-9-8M50 56l9-8M50 66l-8-6"/></g></defs>
      <use href="#leaf" stroke="rgba(50,10,0,.55)" stroke-width="5.5" transform="translate(1.2 1.6)"/>
      <use href="#leaf" stroke="rgba(255,214,170,.7)" stroke-width="4.5"/>
    </svg>`,
  fall: { type: 'leaves', colors: ['#d9622b', '#b8401f', '#e8a13a', '#a8461c', '#c9302c'], density: .16 },
  sparks: ['255,170,70', '255,214,120', '255,120,60', '255,236,190'],
  music: {                                     // original warm waltz, G major, 3/4
    beat: 0.5, pickup: 1, bar: 3,
    melody: [
      ['D5', 1],
      ['G5', 1.5], ['A5', .5], ['B5', 1],
      ['A5', 2], ['G5', 1],
      ['E5', 1.5], ['F#5', .5], ['G5', 1],
      ['D5', 2], ['D5', 1],
      ['E5', 1], ['G5', 1], ['B5', 1],
      ['C6', 2], ['B5', 1],
      ['A5', 1.5], ['F#5', .5], ['A5', 1],
      ['G5', 2]
    ],
    chords: [['G3', 'B3', 'D4'], ['D4', 'F#4', 'A4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'],
             ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['D4', 'F#4', 'A4'], ['G3', 'B3', 'D4']],
    chime: ['G5', 'B5', 'D6', 'G6', 'B6', 'D7']
  },

  scene(api) {
    const { rand, clamp, easeOut, TAU, glow, reduceMotion } = api;
    const C = { gold: '255,206,110', amber: '255,160,60', orange: '255,118,45', red: '235,68,45', crimson: '200,40,55', cream: '255,238,205' };
    const SPR = {}; for (const k in C) SPR[k] = glow(C[k]);
    // right half of a maple leaf (unit size, y down), mirrored for the left half
    const HALF = [[0, -1], [.12, -.78], [.26, -.86], [.2, -.5], [.42, -.62], [.5, -.5], [.75, -.6], [.64, -.34], [.95, -.26],
                  [.7, -.1], [.8, .04], [.48, .1], [.56, .3], [.24, .2], [.06, .32]];
    const POLY = [...HALF, ...HALF.slice(1).reverse().map(([x, y]) => [-x, y])];
    const BASE = [0, .3];
    const VEINS = [[0, -.9], [.86, -.25], [-.86, -.25], [.62, -.55], [-.62, -.55], [.5, .23], [-.5, .23]];
    const inside = (px, py) => {
      let c = false;
      for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
        const [xi, yi] = POLY[i], [xj, yj] = POLY[j];
        if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    const pick = a => a[(Math.random() * a.length) | 0];
    let parts = [], fills = [], embers = [], G = null, nextE = 0;

    return {
      build(w, h) {
        parts = []; fills = []; embers = [];
        const S = Math.min(w * .46, h * .43), cx = w / 2, cy = h * .46;
        const dens = clamp((w * h) / (380 * 430), .5, 1) * (reduceMotion ? .6 : 1);
        let total = 0;
        const segs = POLY.map((a, i) => { const b = POLY[(i + 1) % POLY.length]; const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * S; total += len; return [a, b, len]; });
        let acc = 0;                                                          // outline, traced in order
        for (const [a, b, len] of segs) {
          const n = Math.max(1, Math.round(len / 3));
          for (let j = 0; j < n; j++) {
            const t = j / n;
            parts.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, size: rand(1, 1.6), col: Math.random() < .6 ? 'gold' : 'amber', at: (acc + t * len) / total * 1500, tw: rand(TAU) });
          }
          acc += len;
        }
        for (const v of VEINS) {                                              // veins light up next
          const len = Math.hypot(v[0] - BASE[0], v[1] - BASE[1]) * S, n = Math.round(len / 4);
          for (let j = 0; j <= n; j++) {
            const t = j / n;
            parts.push({ x: BASE[0] + (v[0] - BASE[0]) * t, y: BASE[1] + (v[1] - BASE[1]) * t, size: rand(.6, 1), col: 'cream', at: 1400 + t * 700, tw: rand(TAU), dim: .75 });
          }
        }
        for (let j = 0, n = Math.round(.62 * S / 3.5); j <= n; j++) {        // stem
          const t = j / n;
          parts.push({ x: .07 * t * t, y: .3 + .62 * t, size: rand(.8, 1.3), col: 'amber', at: 1500 + t * 400, tw: rand(TAU) });
        }
        const nF = Math.round(900 * dens);                                    // body: gold at the top → crimson at the base
        for (let i = 0; i < nF; i++) {
          let x, y; do { x = rand(-1, 1); y = rand(-1, .34); } while (!inside(x, y));
          const t = clamp((y + 1) / 1.34 + rand(-.15, .15), 0, 1);
          const p = { x, y, size: rand(.7, 1.6), col: t < .28 ? 'gold' : t < .52 ? 'amber' : t < .76 ? 'orange' : pick(['red', 'crimson']), at: 800 + rand(1300), tw: rand(TAU), dim: .85 };
          parts.push(p); fills.push(p);
        }
        G = { cx, cy, S };
      },
      restart() { embers = []; nextE = 0; },
      frame(ctx, el, w, h) {
        const { cx, cy, S } = G;
        const turn = .93 + .07 * Math.cos(el * .00045);                       // slowly turning in the air
        const tilt = .06 * Math.sin(el * .0007), c = Math.cos(tilt), s = Math.sin(tilt);
        const pos = p => { const x0 = p.x * S * turn, y0 = p.y * S; return [cx + x0 * c - y0 * s, cy + x0 * s + y0 * c]; };
        ctx.globalCompositeOperation = 'lighter';
        const bg = easeOut(clamp(el / 1800, 0, 1));
        const gw = Math.min(S * 2.7, w), gh = Math.min(S * 2.7, h);
        ctx.globalAlpha = .32 * bg; ctx.drawImage(SPR.amber, cx - gw / 2, cy - gh / 2, gw, gh);
        const fk = easeOut(clamp((el - 900) / 1600, 0, 1));                  // translucent leaf body under the particles
        if (fk > 0) {
          ctx.save();
          ctx.translate(cx, cy); ctx.rotate(tilt); ctx.scale(S * turn, S);
          ctx.beginPath(); POLY.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
          const lg = ctx.createRadialGradient(0, -.25, 0, 0, -.1, 1.15);
          lg.addColorStop(0, 'rgba(255,214,120,.95)'); lg.addColorStop(.45, 'rgba(255,140,50,.8)'); lg.addColorStop(1, 'rgba(205,45,40,.7)');
          ctx.fillStyle = lg; ctx.globalAlpha = .34 * fk;
          ctx.fill();
          ctx.restore();
        }
        for (const p of parts) {
          const kk = clamp((el - p.at) / 650, 0, 1);
          if (kk <= 0) continue;
          const e = easeOut(kk);
          const [x, y] = pos(p);
          const tw = .66 + .34 * Math.sin(el * .0028 + p.tw), d = p.size * 4.2;
          ctx.globalAlpha = e * tw * (p.dim || 1);
          ctx.drawImage(SPR[p.col], x - d / 2, y - d / 2 + (1 - e) * 10, d, d);
        }
        if (el > 2600 && el > nextE && fills.length) {                        // embers drifting off the leaf
          nextE = el + (reduceMotion ? rand(500, 900) : rand(140, 320));
          const [x, y] = pos(pick(fills));
          embers.push({ x, y, vx: rand(-.25, .25), vy: rand(.25, .6), born: el, life: rand(1600, 2800), ph: rand(TAU), col: pick(['amber', 'orange', 'red', 'gold']) });
        }
        for (let i = embers.length - 1; i >= 0; i--) {
          const m = embers[i], age = el - m.born;
          if (age > m.life) { embers.splice(i, 1); continue; }
          const x = m.x + m.vx * age * .06 + Math.sin(age * .002 + m.ph) * 8, y = m.y + m.vy * age * .06;
          ctx.globalAlpha = (1 - age / m.life) * .85;
          ctx.drawImage(SPR[m.col], x - 3, y - 3, 6, 6);
        }
      },
      anchor() { return { x: G.cx, y: G.cy - G.S - 6 }; }
    };
  }
};
