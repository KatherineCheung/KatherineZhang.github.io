/* New Year — the coming year written in sparkling particles, fireworks, "Auld Lang Syne". */
(window.CardThemes = window.CardThemes || {}).newyear = {
  id: 'newyear', emoji: '🎆',
  name: { en: 'New Year', zh: '新年' },
  cardName: { en: 'New Year card', zh: '新年贺卡' },
  greet: { en: 'Happy New Year', zh: '新年快乐' },
  occasion: { en: 'New Year surprise', zh: '新年惊喜' },
  letterScript: { en: 'Happy New Year', zh: 'Happy New Year' },
  message: {
    en: 'Here’s to a brand-new year — new adventures, new joys, and more good days with you in them. Happy New Year!',
    zh: '新的一年，愿你所求皆如愿，所行皆坦途。谢谢你出现在我的这一年里，新年快乐！'
  },
  presets: {
    zh: [
      ['温暖', '新的一年，愿你所求皆如愿，所行皆坦途。谢谢你出现在我的这一年里，新年快乐！'],
      ['家人', '新的一年，最大的愿望就是你们身体健康、天天开心。新年快乐，爱你们！'],
      ['朋友', '旧的一年谢谢你的陪伴，新的一年也请多多指教！一起变得更好吧 🎆'],
      ['俏皮', '新年 KPI 已帮你定好：吃好、睡好、玩好、暴富！请查收 ✨']
    ],
    en: [
      ['Warm', 'Here’s to a brand-new year — new adventures, new joys, and more good days with you in them. Happy New Year!'],
      ['Family', 'My biggest wish for the new year: that you stay healthy and happy every single day. Happy New Year, love you!'],
      ['Friend', 'Thanks for being part of my year. Let’s make the next one even better together 🎆'],
      ['Playful', 'Your New Year goals, pre-approved: eat well, sleep well, have fun, get rich ✨']
    ]
  },
  tip: { en: t => `${t ? 'Tap' : 'Click'} the sky to launch a firework`, zh: t => `${t ? '轻点' : '点击'}天空，放一朵烟花` },

  vars: {
    accent: '#f0d08a', 'accent-soft': '#fff1c9', 'accent-rgb': '240,208,138', 'glow-rgb': '255,215,140',
    title: '#f6dc9c', text: '#eef1f8', 'card-dot': '#0c1020', night: '#05070f',
    'paper-a': '#e9e4d8', 'paper-b': '#cfc6b2', 'front-a': '#ddd5c3', 'front-b': '#efe9dc',
    'flap-a': '#f3eee3', 'flap-b': '#d9d0bc', 'flapin-a': '#bdb39d', 'flapin-b': '#aaa08a',
    ink: '#3b4766', 'ink-script': '#2f3d63', 'ink-star': '#c9a650',
    'seal-1': '#6a80c0', 'seal-2': '#2b3c78', 'seal-3': '#17224d', 'seal-4': '#0b1230', 'seal-glow': '140,170,255', 'env-glow': '255,225,160'
  },
  sky: ['#03050c', '#080d1e', '#111530', '#1a1830'],
  glows: [[50, 112, 1100, 620, 'rgba(255,200,110,.18)'], [85, -8, 700, 480, 'rgba(100,130,255,.16)'], [8, 12, 600, 420, 'rgba(200,170,255,.08)']],
  ground: 'radial-gradient(60% 100% at 50% 100%, rgba(255,215,150,.10), transparent 72%)',
  cardFill: 'rgba(12,16,36,.74)',
  sealSvg: `<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round">
      <defs><g id="burst"><path d="M50 16v20M50 64v20M16 50h20M64 50h20M26 26l14 14M60 60l14 14M74 26L60 40M40 60L26 74"/><circle cx="50" cy="50" r="5"/></g></defs>
      <use href="#burst" stroke="rgba(0,0,30,.55)" stroke-width="6" transform="translate(1.2 1.6)"/>
      <use href="#burst" stroke="rgba(255,226,160,.8)" stroke-width="5"/>
    </svg>`,
  fall: { type: 'glitter', colors: ['255,220,140', '235,240,255', '255,240,200'] },
  sparks: ['255,215,130', '230,236,255', '255,240,200', '255,190,110'],
  music: {                                     // "Auld Lang Syne" (traditional), F major, 4/4
    beat: 0.5, pickup: 1, bar: 4,
    melody: [
      ['C5', 1],
      ['F5', 1.5], ['F5', .5], ['F5', 1], ['A5', 1],
      ['G5', 1.5], ['F5', .5], ['G5', 1], ['A5', 1],
      ['F5', 1.5], ['F5', .5], ['A5', 1], ['C6', 1],
      ['D6', 3], ['D6', 1],
      ['C6', 1.5], ['A5', .5], ['A5', 1], ['F5', 1],
      ['G5', 1.5], ['F5', .5], ['G5', 1], ['A5', 1],
      ['F5', 1.5], ['D5', .5], ['D5', 1], ['C5', 1],
      ['F5', 3]
    ],
    chords: [['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['Bb3', 'D4', 'F4'],
             ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['Bb3', 'D4', 'F4'], ['F3', 'A3', 'C4']],
    chime: ['F5', 'A5', 'C6', 'F6', 'A6', 'C7']
  },

  scene(api) {
    const { rand, clamp, easeOut, TAU, glow, reduceMotion } = api;
    const COL = { gold: '255,212,120', champagne: '255,236,190', silver: '225,232,255', white: '255,255,255' };
    const SPR = {}; for (const k in COL) SPR[k] = glow(COL[k]);
    const PAL = [['255,90,90', '255,200,120'], ['120,200,255', '230,240,255'], ['255,215,130', '255,250,230'],
                 ['190,140,255', '255,170,230'], ['120,255,190', '230,255,240']];
    const pick = a => a[(Math.random() * a.length) | 0];
    const d = new Date();
    const YEAR = String(d.getMonth() >= 9 ? d.getFullYear() + 1 : d.getFullYear());   // Oct–Dec: next year
    let parts = [], G = null, nextFw = 2600;

    return {
      build(w, h) {
        const step = Math.max(3, Math.round(Math.min(w, h) / 75));
        const pts = api.textPoints(YEAR, h * .42, `'Cormorant Garamond', Georgia, 'Times New Roman', serif`, w, h, step, w / 2, h * .5, 700);
        let top = h, bottom = 0;
        for (const p of pts) { top = Math.min(top, p.y); bottom = Math.max(bottom, p.y); }
        if (!pts.length) { top = h * .3; bottom = h * .7; }
        parts = pts.map(p => ({ tx: p.x, ty: p.y, sx: w / 2 + rand(-w * .6, w * .6), sy: h + rand(20, 140),
          at: rand(700) + (p.x / w) * 700, size: rand(1, 1.9), col: pick(['gold', 'gold', 'champagne', 'silver']), tw: rand(TAU) }));
        const nLine = Math.round(70 * clamp(w / 380, .6, 1));          // sparkling underline
        for (let i = 0; i < nLine; i++) {
          const t = i / nLine;
          parts.push({ tx: w * (.16 + .68 * t), ty: bottom + h * .08 + Math.sin(t * Math.PI) * -3, sx: w / 2, sy: bottom + h * .08,
            at: 1500 + Math.abs(t - .5) * 900, size: rand(.6, 1.1), col: 'champagne', tw: rand(TAU) });
        }
        G = { cx: w / 2, top, bottom };
      },
      restart() { nextFw = 2600; },
      frame(ctx, el, w, h) {
        ctx.globalCompositeOperation = 'lighter';
        const bg = easeOut(clamp(el / 1800, 0, 1));
        ctx.globalAlpha = .16 * bg;
        ctx.drawImage(SPR.gold, w * .05, G.top - h * .12, w * .9, G.bottom - G.top + h * .24);
        const sweep = ((el * .00032) % 1.8 - .4) * w;                    // shimmer passing across the digits
        for (const p of parts) {
          const kk = clamp((el - p.at) / 1300, 0, 1);
          if (kk <= 0) continue;
          const k = easeOut(kk);
          const x = p.sx + (p.tx - p.sx) * k, y = p.sy + (p.ty - p.sy) * k;
          const tw = .65 + .35 * Math.sin(el * .003 + p.tw);
          const boost = k >= 1 ? Math.max(0, 1 - Math.abs(x - sweep) / 38) : 0;
          const s = p.size * 4.2 * (1 + boost * .7);
          ctx.globalAlpha = Math.min(1, (.35 + .65 * k) * tw + boost * .8);
          ctx.drawImage(SPR[p.col], x - s / 2, y - s / 2, s, s);
        }
        if (el > nextFw) {                                              // fireworks over the whole sky
          nextFw = el + (reduceMotion ? rand(3500, 5500) : rand(1500, 3200));
          const { W, H } = api.viewport();
          api.firework(rand(W * .12, W * .88), rand(H * .08, H * .4), pick(PAL));
        }
      },
      anchor() { return { x: G.cx, y: G.top - 10 }; },
      tap(x, y, inside, px, py) {
        api.firework(px, Math.min(py, api.viewport().H * .8), pick(PAL));
        return true;
      }
    };
  }
};
