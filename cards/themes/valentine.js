/* Valentine's Day — a beating particle heart, falling petals, rising little hearts, an original love tune. */
(window.CardThemes = window.CardThemes || {}).valentine = {
  id: 'valentine', emoji: '💌',
  name: { en: 'Valentine’s Day', zh: '情人节' },
  cardName: { en: 'Valentine', zh: '情人节贺卡' },
  greet: { en: 'Happy Valentine’s Day', zh: '情人节快乐' },
  occasion: { en: 'little love note', zh: '小心意' },
  letterScript: { en: 'With Love', zh: 'With Love' },
  message: {
    en: 'Every day with you feels a little brighter. Thank you for being you — and for being mine. Happy Valentine’s Day!',
    zh: '和你在一起的每一天，都比昨天更亮一点。谢谢你一直是你，也谢谢你在我身边。情人节快乐！'
  },
  presets: {
    zh: [
      ['甜蜜', '和你在一起的每一天，都比昨天更亮一点。谢谢你一直是你，也谢谢你在我身边。情人节快乐！'],
      ['长情', '从第一次见面到现在，我还是会因为你心动。往后的每一个情人节，都想和你一起过。'],
      ['俏皮', '今日份的心动已送达，请签收 💌 有效期：一辈子。'],
      ['闺蜜', '情人节也要好好爱自己！谢谢你一直都在，你是我最好的 Valentine 💕']
    ],
    en: [
      ['Sweet', 'Every day with you feels a little brighter. Thank you for being you — and for being mine. Happy Valentine’s Day!'],
      ['Forever', 'From the very first day until now, you still make my heart skip. I want to spend every Valentine’s Day with you.'],
      ['Playful', 'Today’s delivery of butterflies has arrived 💌 Valid for: a lifetime.'],
      ['Galentine', 'Love yourself today! Thanks for always being there — you’re my favorite Valentine 💕']
    ]
  },
  tip: { en: t => `${t ? 'Tap' : 'Click'} the heart`, zh: t => `${t ? '轻点' : '点击'}爱心，让它跳得更快` },

  vars: {
    accent: '#f6a6b8', 'accent-soft': '#ffd9e2', 'accent-rgb': '246,166,184', 'glow-rgb': '255,110,150',
    title: '#ffc2cf', text: '#fdeef2', 'card-dot': '#2a0a17', night: '#16060d',
    'paper-a': '#f4d3d9', 'paper-b': '#e0aab5', 'front-a': '#ebc0c9', 'front-b': '#f7dde2',
    'flap-a': '#fae6ea', 'flap-b': '#e7b8c2', 'flapin-a': '#d395a2', 'flapin-b': '#c38291',
    ink: '#8f2f45', 'ink-script': '#b8314f', 'ink-star': '#e0708a',
    'seal-1': '#ff7d8f', 'seal-2': '#d1203f', 'seal-3': '#8f0f26', 'seal-4': '#520716', 'seal-glow': '255,80,110', 'env-glow': '255,140,170'
  },
  sky: ['#0d0408', '#1e0812', '#2e0c1a', '#2e1018'],
  glows: [[50, 112, 1100, 620, 'rgba(255,80,130,.22)'], [85, -8, 700, 480, 'rgba(255,150,190,.12)'], [8, 12, 600, 420, 'rgba(190,90,255,.08)']],
  ground: 'radial-gradient(60% 100% at 50% 100%, rgba(255,120,160,.12), transparent 72%)',
  cardFill: 'rgba(40,10,22,.74)',
  sealSvg: `<svg viewBox="0 0 100 100" fill="none" stroke-linejoin="round">
      <defs><path id="heart" d="M50 78C30 63 20 51 20 39c0-9 7-16 15-16 6 0 11 3 15 9 4-6 9-9 15-9 8 0 15 7 15 16 0 12-10 24-30 39z"/></defs>
      <use href="#heart" stroke="rgba(60,0,10,.55)" stroke-width="6" transform="translate(1.2 1.6)"/>
      <use href="#heart" stroke="rgba(255,205,215,.75)" stroke-width="5"/>
    </svg>`,
  fall: { type: 'petals', colors: ['#ff8fa8', '#ff6b8a', '#ffc2cf', '#e84a6f'] },
  sparks: ['255,120,160', '255,190,210', '255,214,140', '255,90,120'],
  music: {                                     // original tune, F major, 4/4
    beat: 0.5, pickup: 0, bar: 4,
    melody: [
      ['A5', 1], ['C6', 1], ['F6', 2],
      ['E6', 1], ['D6', 1], ['C6', 2],
      ['Bb5', 1], ['D6', 1], ['C6', 1], ['A5', 1],
      ['G5', 4],
      ['A5', 1], ['C6', 1], ['F6', 2],
      ['G6', 1], ['F6', 1], ['E6', 1], ['D6', 1],
      ['C6', 1], ['A5', 1], ['G5', 1], ['E5', 1],
      ['F5', 4]
    ],
    chords: [['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['Bb3', 'D4', 'F4'], ['C4', 'E4', 'G4'],
             ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'], ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4']],
    chime: ['F5', 'A5', 'C6', 'F6', 'A6', 'C7']
  },

  scene(api) {
    const { rand, clamp, easeOut, TAU, glow, reduceMotion } = api;
    const COL = { rose: '255,80,120', pink: '255,150,185', blush: '255,205,220', gold: '255,210,140' };
    const SPR = {}; for (const k in COL) SPR[k] = glow(COL[k]);
    const FLOAT = ['#ff6b8a', '#ff9fb4', '#ffc2cf', '#e84a6f'].map(api.heartSprite);
    const heart = t => [16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))];
    let parts = [], floaters = [], G = null, nextF = 1800, kickAt = -1e9, lastEl = 0;
    const pick = a => a[(Math.random() * a.length) | 0];

    return {
      build(w, h) {
        parts = []; floaters = [];
        const s = Math.min(w, h * 1.15) * .023, cx = w / 2, cy = h * .5 - 2.6 * s;                // heart's visual centre
        const dens = clamp((w * h) / (380 * 430), .45, 1) * (reduceMotion ? .6 : 1);
        const nO = Math.round(220 * dens);
        for (let i = 0; i < nO; i++) {                                      // outline, traced in order
          const [x, y] = heart(i / nO * TAU);
          parts.push({ x: x * s, y: y * s, size: rand(1.2, 2), col: Math.random() < .7 ? 'rose' : 'pink', at: i / nO * 1500, tw: rand(TAU) });
          if (i % 3 === 0) parts.push({ x: x * s * .9, y: y * s * .9, size: rand(.6, 1), col: 'gold', at: 300 + i / nO * 1500, tw: rand(TAU) });
        }
        const poly = Array.from({ length: 120 }, (_, i) => heart(i / 120 * TAU));
        const inside = (px, py) => {                                        // even-odd point-in-polygon
          let c = false;
          for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const [xi, yi] = poly[i], [xj, yj] = poly[j];
            if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c;
          }
          return c;
        };
        const nF = Math.round(460 * dens);
        for (let i = 0; i < nF; i++) {                                      // fill, uniform inside the outline
          let x, y; do { x = rand(-16, 16); y = rand(-12, 17); } while (!inside(x / .92, y / .92));
          parts.push({ x: x * s, y: y * s, size: rand(.7, 1.6), col: pick(['rose', 'pink', 'pink', 'blush']), at: 900 + rand(1200), tw: rand(TAU), dim: .75 });
        }
        G = { cx, cy, s, w, h };
      },
      restart() { nextF = 1800; floaters = []; },
      frame(ctx, el, w, h) {
        lastEl = el;
        const { cx, cy, s } = G;
        const ph = (el % 1100) / 1100;                                      // lub-dub heartbeat
        let beat = 1 + .05 * Math.exp(-Math.pow((ph - .1) / .05, 2)) + .03 * Math.exp(-Math.pow((ph - .3) / .05, 2));
        beat += .12 * Math.exp(-(el - kickAt) / 260) * (el > kickAt ? 1 : 0);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = .35 * easeOut(clamp(el / 1600, 0, 1));
        const gw = Math.min(s * 52 * beat, w), gh = Math.min(s * 46 * beat, h);          // glow kept inside the canvas
        ctx.drawImage(SPR.rose, cx - gw / 2, cy + s * 2.5 - gh / 2, gw, gh);
        for (const p of parts) {
          const kk = clamp((el - p.at) / 650, 0, 1);
          if (kk <= 0) continue;
          const k = easeOut(kk);
          const x = cx + p.x * beat, y = cy + p.y * beat + (1 - k) * 10;
          const tw = .68 + .32 * Math.sin(el * .003 + p.tw), d = p.size * 4.2;
          ctx.globalAlpha = k * tw * (p.dim || 1);
          ctx.drawImage(SPR[p.col], x - d / 2, y - d / 2, d, d);
        }
        if (el > nextF) {                                                   // little hearts rising
          nextF = el + (reduceMotion ? rand(1200, 2000) : rand(380, 900));
          floaters.push({ x: cx + rand(-w * .42, w * .42), y: h + 10, vy: rand(.35, .8), size: rand(8, 15), ph: rand(TAU), spr: pick(FLOAT), born: el });
        }
        ctx.globalCompositeOperation = 'source-over';
        for (let i = floaters.length - 1; i >= 0; i--) {
          const f = floaters[i], age = el - f.born;
          const y = f.y - age * f.vy * .06;
          if (y < -20) { floaters.splice(i, 1); continue; }
          ctx.globalAlpha = clamp(y / h, 0, 1) * .75;
          const x = f.x + Math.sin(age * .002 + f.ph) * 10;
          ctx.drawImage(f.spr, x - f.size / 2, y - f.size / 2, f.size, f.size);
        }
      },
      anchor() { return { x: G.cx, y: G.cy - G.s * 13 }; },
      tap(x, y, inside, px, py) {
        if (!inside || lastEl < 1800) return false;
        kickAt = lastEl;
        api.burst(px, py, 46, 1.3);
        for (let i = 0; i < 6; i++) floaters.push({ x: x + rand(-30, 30), y: y + rand(-10, 20), vy: rand(.8, 1.4), size: rand(10, 18), ph: rand(TAU), spr: pick(FLOAT), born: lastEl });
        api.sparkle(.06);
        return true;
      }
    };
  }
};
