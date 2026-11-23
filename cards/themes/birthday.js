/* Birthday — a rotating particle cake with candles you can blow out, confetti, "Happy Birthday". */
(window.CardThemes = window.CardThemes || {}).birthday = {
  id: 'birthday', emoji: '🎂',
  name: { en: 'Birthday', zh: '生日' },
  cardName: { en: 'birthday card', zh: '生日贺卡' },
  greet: { en: 'Happy Birthday', zh: '生日快乐' },
  occasion: { en: 'birthday surprise', zh: '生日惊喜' },
  letterScript: { en: 'Happy Birthday', zh: 'Happy Birthday' },
  message: {
    en: 'Happy birthday! May this year bring you everything that makes you smile — and a few wonderful surprises along the way.',
    zh: '生日快乐！愿新的一岁，所有让你开心的事都如约而至，偶尔还有一点小惊喜。'
  },
  presets: {
    zh: [
      ['温暖', '生日快乐！愿新的一岁，所有让你开心的事都如约而至，偶尔还有一点小惊喜。'],
      ['家人', '谢谢你一直以来的照顾和爱。今天轮到我们来宠你啦，生日快乐，永远健康！'],
      ['朋友', '又长大一岁啦！愿你永远有吃不完的蛋糕、用不完的好运，还有我这个朋友 🎂'],
      ['俏皮', '蜡烛交给你吹，愿望我已经帮你许好了：今年的你一定超级棒！']
    ],
    en: [
      ['Warm', 'Happy birthday! May this year bring you everything that makes you smile — and a few wonderful surprises along the way.'],
      ['Family', 'Thank you for all the love and care, always. Today it’s our turn to spoil you. Happy birthday, and stay healthy forever!'],
      ['Friend', 'Another year older, another year more awesome! Wishing you endless cake, endless luck — and me as your friend 🎂'],
      ['Playful', 'You blow out the candles — I already made the wish for you: this is going to be your best year yet!']
    ]
  },
  tip: { en: t => `${t ? 'Tap' : 'Click'} the cake to blow out the candles`, zh: t => `${t ? '轻点' : '点击'}蛋糕，吹灭蜡烛` },

  vars: {
    accent: '#f7b7c8', 'accent-soft': '#ffe0ea', 'accent-rgb': '247,183,200', 'glow-rgb': '255,150,190',
    title: '#ffd6a5', text: '#fbeef2', 'card-dot': '#22102a', night: '#140a1c',
    'paper-a': '#f6dfe3', 'paper-b': '#e8bfc8', 'front-a': '#efcfd6', 'front-b': '#f8e3e7',
    'flap-a': '#fbe9ec', 'flap-b': '#ecc6cf', 'flapin-a': '#dcaab5', 'flapin-b': '#cf97a4',
    ink: '#9b4a63', 'ink-script': '#c0577a', 'ink-star': '#e08aa5',
    'seal-1': '#ff9cbc', 'seal-2': '#e0457a', 'seal-3': '#a81e52', 'seal-4': '#64102f', 'seal-glow': '255,120,170', 'env-glow': '255,170,200'
  },
  sky: ['#0d0716', '#1c0d2a', '#2a1235', '#331a2c'],
  glows: [[50, 112, 1100, 620, 'rgba(255,120,170,.22)'], [85, -8, 700, 480, 'rgba(180,140,255,.16)'], [8, 12, 600, 420, 'rgba(255,200,120,.08)']],
  ground: 'radial-gradient(60% 100% at 50% 100%, rgba(255,150,200,.12), transparent 72%)',
  cardFill: 'rgba(30,14,40,.72)',
  sealSvg: `<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <defs><g id="cake"><path d="M22 80h56M27 80V58h46v22M27 66c6 5 9.5 5 15.3 0s9.5 5 15.3 0 9.5 5 15.4 0"/><path d="M39 58V46M50 58V42M61 58V46"/>
        <path d="M39 38c-3-4 0-7 0-9 0 2 3 5 0 9zM50 34c-3-4 0-7 0-9 0 2 3 5 0 9zM61 38c-3-4 0-7 0-9 0 2 3 5 0 9z"/></g></defs>
      <use href="#cake" stroke="rgba(70,0,30,.5)" stroke-width="6" transform="translate(1.2 1.6)"/>
      <use href="#cake" stroke="rgba(255,220,232,.7)" stroke-width="5"/>
    </svg>`,
  fall: { type: 'confetti', colors: ['#ffd36e', '#ff7aa8', '#7ad7ff', '#b49bff', '#7dffb8'] },
  sparks: ['255,190,210', '255,214,120', '196,165,255', '140,220,255'],
  confetti: ['#ffd36e', '#ff7aa8', '#7ad7ff', '#b49bff', '#7dffb8', '#ffffff'],
  music: {                                     // "Happy Birthday to You" (public domain), C major, 3/4
    beat: 0.42, pickup: 1, bar: 3,
    melody: [
      ['G5', .75], ['G5', .25],
      ['A5', 1], ['G5', 1], ['C6', 1],
      ['B5', 2], ['G5', .75], ['G5', .25],
      ['A5', 1], ['G5', 1], ['D6', 1],
      ['C6', 2], ['G5', .75], ['G5', .25],
      ['G6', 1], ['E6', 1], ['C6', 1],
      ['B5', 1], ['A5', 1], ['F6', .75], ['F6', .25],
      ['E6', 1], ['C6', 1], ['D6', 1],
      ['C6', 2]
    ],
    chords: [['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['G3', 'B3', 'F4'], ['C4', 'E4', 'G4'],
             ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']],
    chime: ['C6', 'E6', 'G6', 'C7', 'E7', 'G7']
  },

  scene(api) {
    const { rand, clamp, easeOut, TAU, glow, reduceMotion } = api;
    const COL = { cream: '255,236,214', pink: '255,160,196', rose: '255,110,160', gold: '255,206,120', lilac: '196,160,255', mint: '150,232,205', sky: '140,210,255' };
    const SPR = {}; for (const k in COL) SPR[k] = glow(COL[k]);
    const FLAME = glow('255,170,70'), CORE = glow('255,244,210'), SMOKE = glow('205,195,215');
    const pickC = arr => arr[(Math.random() * arr.length) | 0];
    let parts = [], candles = [], smoke = [], G = null, lit = true, blownAt = -1e9, litAt = 0, lastEl = 0;

    function blow() {
      if (!lit) return;
      lit = false; blownAt = lastEl;
      for (const c of candles) for (let k = 0; k < 6; k++) {
        smoke.push({ x: c.x, y: c.fy, t0: lastEl + k * 90, life: rand(1300, 2000), rise: rand(40, 70), ph: rand(TAU) });
      }
      const { W, H } = api.viewport();
      api.confetti(0, H * .92, reduceMotion ? 30 : 80, -Math.PI / 3, .7, 1.7);
      api.confetti(W, H * .92, reduceMotion ? 30 : 80, -Math.PI * 2 / 3, .7, 1.7);
      api.chime();
    }

    return {
      build(w, h) {
        parts = []; candles = []; smoke = [];
        const cx = w / 2, base = h * .88;
        const R = Math.min(w * .38, h * .5), tilt = .26;
        const t1 = { y0: base, hgt: h * .2, r: R };
        const t2 = { y0: base - h * .2, hgt: h * .17, r: R * .66 };
        const topY = t2.y0 - t2.hgt;
        G = { cx, base, R, tilt, t1, t2, topY, anchorY: topY - h * .16 };
        const dens = clamp((w * h) / (380 * 430), .45, 1) * (reduceMotion ? .6 : 1);
        const at = y => (base - y) / (base - topY) * 1500 + rand(300);
        [t1, t2].forEach((t, ti) => {
          const nRim = Math.round(t.r * 1.3 * dens) + 20;
          for (let i = 0; i < nRim; i++) {
            const ang = i / nRim * TAU;
            parts.push({ ang, r: t.r, y: t.y0, size: rand(.9, 1.5), col: 'gold', at: at(t.y0) });
            parts.push({ ang, r: t.r, y: t.y0 - t.hgt, size: rand(1, 1.7), col: ti ? 'pink' : 'cream', at: at(t.y0 - t.hgt) });
            const drip = (Math.sin(ang * 7 + ti) * .5 + .5) * t.hgt * .34;            // frosting drips
            parts.push({ ang, r: t.r, y: t.y0 - t.hgt + drip, size: rand(1, 1.6), col: ti ? 'rose' : 'pink', at: at(t.y0 - t.hgt + drip) });
          }
          const nSide = Math.round(t.r * 2.6 * dens);
          for (let i = 0; i < nSide; i++) {
            const y = t.y0 - rand(t.hgt * .75);
            parts.push({ ang: rand(TAU), r: t.r, y, size: rand(.7, 1.4), col: pickC(['cream', 'cream', 'pink', 'gold']), at: at(y) });
          }
          const nTop = Math.round(t.r * 1.4 * dens);
          for (let i = 0; i < nTop; i++) {
            parts.push({ ang: rand(TAU), r: t.r * Math.sqrt(Math.random()) * .96, y: t.y0 - t.hgt, size: rand(.6, 1.2), col: 'cream', at: at(t.y0 - t.hgt) + 200, dim: .5 });
          }
          for (let i = 0; i < Math.round(26 * dens); i++) {                       // sprinkles
            const y = t.y0 - rand(t.hgt * .7);
            parts.push({ ang: rand(TAU), r: t.r, y, size: rand(1.6, 2.4), col: pickC(['lilac', 'mint', 'sky', 'gold', 'rose']), at: at(y) + 300, orn: true });
          }
        });
        const nP = Math.round(120 * dens);                                          // plate
        for (let i = 0; i < nP; i++) {
          parts.push({ ang: i / nP * TAU, r: R * 1.16 * rand(.95, 1.05), y: base + 3, size: rand(.7, 1.4), col: Math.random() < .6 ? 'gold' : 'cream', at: rand(400), ring: true });
        }
        const cols = ['pink', 'lilac', 'mint', 'sky', 'gold'];
        for (let i = 0; i < 5; i++) candles.push({ ang: i / 5 * TAU + .3, r: t2.r * .55, h: h * .085, col: cols[i], ph: rand(TAU), x: cx, fy: topY });
      },
      restart() { lit = true; litAt = 0; blownAt = -1e9; smoke = []; },
      frame(ctx, el) {
        lastEl = el;
        const { cx, tilt, R, base, topY } = G;
        const rot = el * .00026;
        ctx.globalCompositeOperation = 'lighter';
        const bg = easeOut(clamp(el / 1600, 0, 1));
        ctx.globalAlpha = .4 * bg; ctx.drawImage(SPR.rose, cx - R * 1.6, base - R * .3, R * 3.2, R * .6);
        ctx.globalAlpha = .12 * bg; ctx.drawImage(SPR.gold, cx - R * 1.2, topY - R * .2, R * 2.4, base - topY + R * .4);
        for (const p of parts) {
          const kk = clamp((el - p.at) / 700, 0, 1);
          if (kk <= 0) continue;
          const e = easeOut(kk);
          const a = p.ang + (p.ring ? -rot * .6 : rot), sn = Math.sin(a);
          const x = cx + Math.cos(a) * p.r, y = p.y + sn * p.r * tilt + (1 - e) * 12;
          const depth = (sn + 1) / 2;
          const tw = .7 + .3 * Math.sin(el * .002 + p.ang * 5);
          const s = p.size * (.72 + .56 * depth) * (p.orn ? 5 : 4.2);
          ctx.globalAlpha = e * (.15 + .85 * depth) * tw * (p.dim || 1);
          ctx.drawImage(SPR[p.col], x - s / 2, y - s / 2, s, s);
        }
        const ck = clamp((el - 1700) / 800, 0, 1);                                  // candles
        if (ck > 0) {
          const blowK = clamp((el - blownAt) / 320, 0, 1);
          const relight = clamp((el - litAt) / 400, 0, 1);
          for (const c of candles) {
            const a = c.ang + rot, sn = Math.sin(a), depth = (sn + 1) / 2;
            const x = cx + Math.cos(a) * c.r, yb = G.t2.y0 - G.t2.hgt + sn * c.r * tilt;
            for (let j = 0; j < 7; j++) {
              const yy = yb - (j / 6) * c.h * easeOut(ck), s = 3.8 * (.8 + .4 * depth);
              ctx.globalAlpha = (.35 + .65 * depth) * ck;
              ctx.drawImage(SPR[c.col], x - s / 2, yy - s / 2, s, s);
            }
            const fy = yb - c.h - 5;
            c.x = x; c.fy = fy;
            const f = lit ? ck * relight : 1 - blowK;
            if (f > 0) {
              const fl = .82 + .18 * Math.sin(el * .023 + c.ph) + .06 * Math.sin(el * .061 + c.ph * 2);
              const s1 = 30 * f * fl, s2 = 11 * f;
              ctx.globalAlpha = .9; ctx.drawImage(FLAME, x - s1 / 2, fy - s1 * .62, s1, s1 * 1.25);
              ctx.globalAlpha = 1; ctx.drawImage(CORE, x - s2 / 2, fy - s2 / 2, s2, s2 * 1.3);
            }
          }
        }
        for (let i = smoke.length - 1; i >= 0; i--) {                              // smoke after blowing
          const s = smoke[i], t = (el - s.t0) / s.life;
          if (t >= 1) { smoke.splice(i, 1); continue; }
          if (t < 0) continue;
          const x = s.x + Math.sin(t * 6 + s.ph) * 6 * t, y = s.y - t * s.rise, d = 6 + t * 18;
          ctx.globalAlpha = (1 - t) * .35;
          ctx.drawImage(SMOKE, x - d / 2, y - d / 2, d, d);
        }
      },
      anchor() { return { x: G.cx, y: G.anchorY }; },
      tap(x, y, inside, px, py) {
        if (!inside || lastEl < 2400) return false;
        if (lit) blow();
        else { lit = true; litAt = lastEl; api.burst(px, py, 18, .6); api.sparkle(.05); }   // make another wish
        return true;
      },
      finale() { setTimeout(blow, 300); return true; }
    };
  }
};
