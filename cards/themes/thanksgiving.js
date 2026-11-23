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
    'seal-1': '#ee8f55', 'seal-2': '#b8461c', 'seal-3': '#7e2a0e', 'seal-4': '#4a1606', 'seal-glow': '255,140,70', 'env-glow': '255,170,100'
  },
  sky: ['#0b0604', '#1a0e07', '#2a1709', '#2e1a0c'],
  glows: [[50, 112, 1100, 620, 'rgba(255,150,60,.24)'], [85, -8, 700, 480, 'rgba(255,190,110,.10)'], [8, 12, 600, 420, 'rgba(200,70,40,.10)']],
  ground: 'radial-gradient(60% 100% at 50% 100%, rgba(255,160,80,.12), transparent 72%)',
  cardFill: 'rgba(36,20,10,.74)',
  sealSvg: `<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <defs><g id="leaf"><path d="M50 18c18 10 26 30 16 48-6 10-16 14-16 14s-10-4-16-14c-10-18-2-38 16-48z"/><path d="M50 28v56M50 46l-9-8M50 56l9-8M50 66l-8-6"/></g></defs>
      <use href="#leaf" stroke="rgba(50,10,0,.55)" stroke-width="5.5" transform="translate(1.2 1.6)"/>
      <use href="#leaf" stroke="rgba(255,214,170,.7)" stroke-width="4.5"/>
    </svg>`,
  fall: { type: 'leaves', colors: ['#e0671c', '#c2410c', '#f59e0b', '#b45309', '#dc2626', '#d97706'] },
  sparks: ['255,170,70', '255,214,120', '255,120,60', '255,236,190'],
  exportBlend: 'source-over',
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
    const LEAVES = ['#e0671c', '#c2410c', '#f59e0b', '#b45309', '#dc2626', '#d97706'].flatMap(c => [api.leafSprite(c, 'oval'), api.leafSprite(c, 'oval'), api.leafSprite(c, 'maple')]);
    const GOLD = glow('255,200,110'), AMBER = glow('255,150,60'), BERRY = glow('230,60,50'), FLAME = glow('255,170,70'), CORE = glow('255,244,210');
    let leaves = [], dots = [], G = null;
    const pick = a => a[(Math.random() * a.length) | 0];

    return {
      build(w, h) {
        leaves = []; dots = [];
        const R = Math.min(w, h) * .34, cx = w / 2, cy = h * .5;
        const dens = clamp((w * h) / (380 * 430), .5, 1) * (reduceMotion ? .7 : 1);
        const n = Math.round(85 * dens) + 20;
        for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
          const ang = (i + layer * .5) / n * TAU + rand(-.04, .04);
          leaves.push({ ang, r: R * (1 + rand(-.13, .13)), rot: ang + Math.PI / 2 + rand(-.8, .8), size: rand(15, 27) * (R / 110),
            spr: pick(LEAVES), at: (i / n) * 1500 + layer * 250 + rand(200), ph: rand(TAU), flip: Math.random() < .5 ? -1 : 1 });
        }
        for (let i = 0; i < Math.round(40 * dens); i++) {                    // berries + gold dots
          dots.push({ ang: rand(TAU), r: R * (1 + rand(-.1, .1)), size: rand(1.4, 2.4), spr: Math.random() < .6 ? BERRY : GOLD, at: 1300 + rand(800), tw: rand(TAU) });
        }
        for (let i = 0; i < Math.round(90 * dens); i++) {                    // inner sparkle ring
          dots.push({ ang: i / 90 * TAU, r: R * .76, size: rand(.5, 1), spr: GOLD, at: 1700 + rand(600), tw: rand(TAU), spin: true });
        }
        G = { cx, cy, R };
      },
      frame(ctx, el, w, h) {
        const { cx, cy, R } = G;
        ctx.globalCompositeOperation = 'lighter';
        const bg = easeOut(clamp(el / 1600, 0, 1));
        ctx.globalAlpha = .35 * bg;
        ctx.drawImage(AMBER, cx - R * 1.4, cy - R * 1.4, R * 2.8, R * 2.8);
        ctx.globalCompositeOperation = 'source-over';
        const sway = Math.sin(el * .0006) * .03;
        for (const l of leaves) {
          const kk = clamp((el - l.at) / 700, 0, 1);
          if (kk <= 0) continue;
          const k = easeOut(kk), a = l.ang + sway;
          const x = cx + Math.cos(a) * l.r, y = cy + Math.sin(a) * l.r + (1 - k) * -10;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(l.rot + .08 * Math.sin(el * .0018 + l.ph));
          ctx.scale(l.flip * k, k);
          ctx.globalAlpha = .95 * k;
          ctx.drawImage(l.spr, -l.size / 2, -l.size / 2, l.size, l.size);
          ctx.restore();
        }
        ctx.globalCompositeOperation = 'lighter';
        for (const d of dots) {
          const kk = clamp((el - d.at) / 600, 0, 1);
          if (kk <= 0) continue;
          const a = d.ang + (d.spin ? el * .00012 : sway);
          const x = cx + Math.cos(a) * d.r, y = cy + Math.sin(a) * d.r, s = d.size * 4.2;
          ctx.globalAlpha = kk * (.6 + .4 * Math.sin(el * .003 + d.tw));
          ctx.drawImage(d.spr, x - s / 2, y - s / 2, s, s);
        }
        const ck = easeOut(clamp((el - 1400) / 900, 0, 1));                 // candle in the middle
        if (ck > 0) {
          const ch = R * .5, cw = R * .2, top = cy + R * .32 - ch;
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = ck;
          const body = ctx.createLinearGradient(cx - cw / 2, 0, cx + cw / 2, 0);
          body.addColorStop(0, '#d9c4a0'); body.addColorStop(.5, '#fff3dc'); body.addColorStop(1, '#c9b08a');
          ctx.fillStyle = body;
          ctx.fillRect(cx - cw / 2, top, cw, ch);
          ctx.fillStyle = 'rgba(255,240,210,.9)';
          ctx.beginPath(); ctx.ellipse(cx, top, cw / 2, cw * .14, 0, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
          const fl = .85 + .15 * Math.sin(el * .021) + .05 * Math.sin(el * .057);
          ctx.globalAlpha = .5 * ck; ctx.drawImage(AMBER, cx - R * .7, top - R * .75, R * 1.4, R * 1.4);
          const s1 = R * .42 * fl, s2 = R * .14;
          ctx.globalAlpha = .95 * ck; ctx.drawImage(FLAME, cx - s1 / 2, top - s1 * .85, s1, s1 * 1.3);
          ctx.globalAlpha = ck; ctx.drawImage(CORE, cx - s2 / 2, top - s2 * 1.1, s2, s2 * 1.4);
        }
      },
      anchor() { return { x: G.cx, y: G.cy - G.R * 1.18 }; }
    };
  }
};
