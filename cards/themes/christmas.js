/* Christmas — glowing particle tree, falling snow, "We Wish You a Merry Christmas". */
(window.CardThemes = window.CardThemes || {}).christmas = {
  id: 'christmas', emoji: '🎄',
  name: { en: 'Christmas', zh: '圣诞节' },
  cardName: { en: 'Christmas card', zh: '圣诞贺卡' },
  greet: { en: 'Merry Christmas', zh: '圣诞快乐' },
  occasion: { en: 'Christmas surprise', zh: '圣诞惊喜' },
  letterScript: { en: 'Merry Christmas', zh: 'Merry Christmas' },
  message: {
    en: 'Thank you for every moment of companionship this year. May your new year be as pure and beautiful as this falling snow.',
    zh: '谢谢你这一年的每一次陪伴。愿你的新年，像这场雪一样干净又美好。'
  },
  presets: {
    zh: [
      ['温暖', '谢谢你这一年的每一次陪伴。愿你的新年，像这场雪一样干净又美好。'],
      ['家人', '一年又一年，最想说的还是：谢谢你们一直在。圣诞快乐，新的一年平安健康！'],
      ['朋友', '这一年辛苦啦！愿你新的一年少点烦恼，多点好运，想见的人都能见到。'],
      ['俏皮', '圣诞老人说他今年太忙，派我来送祝福 🎅 收下这颗星星，新年一定闪闪发光！']
    ],
    en: [
      ['Warm', 'Thank you for every moment of companionship this year. May your new year be as pure and beautiful as this falling snow.'],
      ['Family', 'Another year, and the thing I most want to say is still: thank you for always being there. Merry Christmas, and a healthy, happy new year!'],
      ['Friend', 'You made this year so much better. Here’s to fewer worries, more luck, and more time together in the new year!'],
      ['Playful', 'Santa said he was too busy this year, so he sent me instead 🎅 Keep this star — your new year is going to sparkle!']
    ]
  },
  og: { title: '✦ A Christmas surprise for you', desc: 'Tap to open your Christmas card 🎄' },

  vars: {},                                    // defaults in card.css are the Christmas palette
  sky: ['#050816', '#0a1330', '#171531', '#221a2c'],
  glows: [[50, 112, 1100, 620, 'rgba(255,166,84,.24)'], [85, -8, 700, 480, 'rgba(110,132,255,.16)'], [8, 12, 600, 420, 'rgba(160,110,255,.10)']],
  ground: 'radial-gradient(62% 100% at 26% 100%, rgba(214,226,255,.11), transparent 72%), radial-gradient(58% 86% at 80% 100%, rgba(214,226,255,.08), transparent 72%), radial-gradient(40% 70% at 50% 100%, rgba(255,190,120,.10), transparent 75%)',
  sealSvg: `<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round">
      <defs>
        <g id="arm"><line x1="50" y1="50" x2="50" y2="16"/><line x1="50" y1="30" x2="40" y2="21"/><line x1="50" y1="30" x2="60" y2="21"/></g>
        <g id="flake"><use href="#arm"/><use href="#arm" transform="rotate(60 50 50)"/><use href="#arm" transform="rotate(120 50 50)"/>
          <use href="#arm" transform="rotate(180 50 50)"/><use href="#arm" transform="rotate(240 50 50)"/><use href="#arm" transform="rotate(300 50 50)"/>
          <circle cx="50" cy="50" r="5"/></g>
      </defs>
      <use href="#flake" stroke="rgba(55,0,0,.55)" stroke-width="5.5" transform="translate(1.2 1.6)"/>
      <use href="#flake" stroke="rgba(255,196,176,.55)" stroke-width="4.5"/>
    </svg>`,
  fall: { type: 'snow' },
  sparks: ['255,214,120', '255,236,180', '255,190,92', '255,248,228'],
  music: {                                     // G major, 3/4, pick-up "We"; loops every 24 beats
    beat: 0.47, pickup: 1, bar: 3,
    melody: [
      ['D5', 1],
      ['G5', 1], ['G5', .5], ['A5', .5], ['G5', .5], ['F#5', .5],
      ['E5', 1], ['E5', 1], ['E5', 1],
      ['A5', 1], ['A5', .5], ['B5', .5], ['A5', .5], ['G5', .5],
      ['F#5', 1], ['D5', 1], ['D5', 1],
      ['B5', 1], ['B5', .5], ['C6', .5], ['B5', .5], ['A5', .5],
      ['G5', 1], ['E5', 1], ['D5', .5], ['D5', .5],
      ['E5', 1], ['A5', 1], ['F#5', 1],
      ['G5', 2]
    ],
    chords: [['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['A3', 'C#4', 'E4'], ['D4', 'F#4', 'A4'],
             ['B3', 'D#4', 'F#4'], ['C4', 'E4', 'G4'], ['D4', 'F#4', 'A4'], ['G3', 'B3', 'D4']],
    chime: ['G5', 'B5', 'D6', 'G6', 'B6', 'D7']
  },

  scene(api) {
    const { rand, clamp, easeOut, easeBack, TAU, glow, reduceMotion } = api;
    const COLORS = { gold: '255,204,110', warm: '255,238,205', amber: '255,166,70', green: '150,226,176', rose: '255,118,128', ice: '170,214,255' };
    const SPR = {}; for (const k in COLORS) SPR[k] = glow(COLORS[k]);
    const pick = table => { let r = Math.random(); for (const [k, p] of table) { if ((r -= p) <= 0) return k; } return table[0][0]; };
    let parts = [], G = null;

    function drawTopStar(ctx, x, y, R, el, k) {
      const pulse = 1 + 0.08 * Math.sin(el * 0.003);
      const big = R * 1.1 * k * pulse;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.85 * k;
      ctx.drawImage(SPR.gold, x - big / 2, y - big / 2, big, big);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(el * 0.00025);
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 4);
        const len = R * (i % 2 ? .38 : .62) * k * pulse;
        const g = ctx.createLinearGradient(0, -len, 0, len);
        g.addColorStop(0, 'rgba(255,220,150,0)'); g.addColorStop(.5, 'rgba(255,236,190,.55)'); g.addColorStop(1, 'rgba(255,220,150,0)');
        ctx.fillStyle = g;
        ctx.fillRect(-0.7, -len, 1.4, len * 2);
      }
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
      const ro = Math.max(8, R * 0.1) * easeBack(k), ri = ro * 0.45;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(el * 0.0008) * 0.08);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? ri : ro;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      const sg = ctx.createRadialGradient(0, -ro * .2, 0, 0, 0, ro);
      sg.addColorStop(0, '#fffdf2'); sg.addColorStop(.5, '#ffe29a'); sg.addColorStop(1, '#e9a845');
      ctx.fillStyle = sg;
      ctx.shadowColor = 'rgba(255,200,110,.95)'; ctx.shadowBlur = 18;
      ctx.globalAlpha = clamp(k * 1.2, 0, 1);
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    }

    return {
      build(w, h) {
        parts = [];
        const top = h * 0.15, bottom = h * 0.85, TH = bottom - top;
        const R = Math.min(w * 0.4, TH * 0.42);
        G = { cx: w / 2, top, bottom, TH, R, w };
        const dens = clamp((w * h) / (380 * 430), 0.45, 1) * (reduceMotion ? .6 : 1);
        const nS = Math.round(230 * dens);                       // two golden garland spirals
        for (let s = 0; s < 2; s++) for (let i = 0; i < nS; i++) {
          const t = i / nS;
          parts.push({ ang: t * TAU * 6.5 + s * Math.PI, r: R * t, y: top + t * TH,
            size: rand(1.1, 2), col: s ? 'warm' : 'gold', tw: rand(TAU), ts: rand(1, 3), at: (1 - t) * 1800 + rand(300) });
        }
        const nF = Math.round(620 * dens);                       // body of the tree
        for (let i = 0; i < nF; i++) {
          const t = Math.pow(Math.random(), 0.7);
          parts.push({ ang: rand(TAU), r: R * t * (0.5 + 0.5 * Math.sqrt(Math.random())), y: top + t * TH,
            size: rand(0.7, 1.8), col: pick([['gold', .5], ['warm', .24], ['green', .16], ['amber', .1]]),
            tw: rand(TAU), ts: rand(1, 3.5), at: (1 - t) * 1800 + rand(350) });
        }
        for (let i = 0; i < 40; i++) {                           // ornaments
          const t = rand(0.14, 1);
          parts.push({ ang: rand(TAU), r: R * t * rand(0.9, 1), y: top + t * TH,
            size: rand(2.1, 3.5), col: pick([['rose', .34], ['ice', .26], ['gold', .24], ['amber', .16]]),
            tw: rand(TAU), ts: rand(1.5, 3), orn: true, at: 700 + (1 - t) * 1600 + rand(300) });
        }
        for (let i = 0; i < 24; i++) {                           // trunk
          parts.push({ fixed: true, x: rand(-R * .06, R * .06), y: bottom + rand(TH * .01, TH * .08),
            size: rand(.7, 1.3), col: 'amber', tw: rand(TAU), ts: rand(1, 2), at: rand(300) });
        }
        const nR = Math.round(120 * dens);                       // glowing halo ring on the ground
        for (let i = 0; i < nR; i++) {
          parts.push({ ring: true, ang: (i / nR) * TAU, r: R * 1.18 * rand(0.88, 1.08), y: bottom + TH * 0.075,
            size: rand(0.7, 1.5), col: Math.random() < .6 ? 'gold' : 'warm', tw: rand(TAU), ts: rand(1, 3), at: rand(500) });
        }
      },
      frame(ctx, el) {
        const { cx, top, bottom, TH, R } = G;
        ctx.globalCompositeOperation = 'lighter';
        const bg = easeOut(clamp(el / 1600, 0, 1));
        ctx.globalAlpha = 0.45 * bg;
        const gw = Math.min(R * 3.2, G.w);                                            // glow kept inside the canvas
        ctx.drawImage(SPR.amber, cx - gw / 2, bottom + TH * .075 - R * .34, gw, R * .68);
        ctx.globalAlpha = 0.14 * bg;
        ctx.drawImage(SPR.gold, cx - R * 1.3, top + TH * .15, R * 2.6, TH * .9);
        const rot = el * 0.00034;
        for (const p of parts) {
          const kk = clamp((el - p.at) / 700, 0, 1);
          if (kk <= 0) continue;
          const e = easeOut(kk);
          let x, y, depth;
          if (p.fixed) { x = cx + p.x; y = p.y; depth = .6; }
          else {
            const a = p.ang + (p.ring ? -rot * .6 : rot);
            const sn = Math.sin(a);
            x = cx + Math.cos(a) * p.r;
            y = p.y + sn * p.r * (p.ring ? 0.2 : 0.09);
            depth = (sn + 1) / 2;
          }
          y += (1 - e) * 14;
          const tw = 0.62 + 0.38 * Math.sin(el * 0.002 * p.ts + p.tw);
          const s = p.size * (0.72 + 0.56 * depth) * (p.orn ? 5.6 : 4.2);
          ctx.globalAlpha = e * (0.2 + 0.8 * depth) * tw;
          ctx.drawImage(SPR[p.col], x - s / 2, y - s / 2, s, s);
        }
        const sk = clamp((el - 2050) / 900, 0, 1);
        if (sk > 0) drawTopStar(ctx, cx, top - TH * 0.035, R, el, sk);
      },
      anchor() { return { x: G.cx, y: G.top - G.TH * 0.035 }; }
    };
  }
};
