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
  sky: ['#160306', '#2c0710', '#470b14', '#2e0709'],
  glows: [[50, 112, 1100, 620, 'rgba(255,100,50,.24)'], [85, -8, 700, 480, 'rgba(255,200,110,.10)'], [8, 12, 600, 420, 'rgba(255,60,90,.08)']],
  ground: 'radial-gradient(60% 100% at 50% 100%, rgba(255,120,60,.14), transparent 72%)',
  cardFill: 'rgba(48,10,14,.74)',
  sealText: '福',
  fall: { type: 'petals', colors: ['#ffd6e0', '#ffc2d1', '#fff1f4', '#f9b7c8'], density: .3 },     // plum blossom
  sparks: ['255,90,70', '255,200,100', '255,150,60', '255,236,180'],
  confetti: ['#e8262c', '#ffcf5a', '#ff8a3d', '#fff0c0'],
  exportBlend: 'source-over',
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
    const { rand, clamp, easeOut, easeBack, TAU, glow, reduceMotion } = api;
    const GOLD = glow('255,206,110'), WARM = glow('255,236,190'), LGLOW = glow('255,110,60'), RED = glow('255,70,50');
    const PAL = [['255,80,60', '255,210,120'], ['255,200,90', '255,245,210'], ['255,215,130', '255,90,90']];
    const KAI = `'Kaiti SC','STKaiti','KaiTi','BiauKai','Noto Serif SC','Songti SC','STSong','Noto Sans SC','WenQuanYi Zen Hei','PingFang SC','Microsoft YaHei',serif`;
    const pick = a => a[(Math.random() * a.length) | 0];
    let G = null, dust = [], nextFw = 3600;

    const goldGrad = (ctx, x0, y0, x1, y1) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, '#8a5a12'); g.addColorStop(.45, '#f7d784'); g.addColorStop(.55, '#ffe9ad'); g.addColorStop(1, '#a8711a');
      return g;
    };
    const rrect = (ctx, x, y, w, h, r) => {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    };
    function tassel(ctx, x, y, len, el, ph) {                     // gold knot + red silk threads
      ctx.fillStyle = goldGrad(ctx, x - 4, 0, x + 4, 0);
      ctx.beginPath(); ctx.arc(x, y + 3, 3.2, 0, TAU); ctx.fill();
      rrect(ctx, x - 3, y + 6, 6, 5, 1.5); ctx.fill();
      const sway = Math.sin(el * .002 + ph) * 2.5;
      ctx.strokeStyle = '#d0202a'; ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(x + i * .8, y + 11);
        ctx.quadraticCurveTo(x + i * 1.2, y + 11 + len * .5, x + i * 1.6 + sway, y + 11 + len); ctx.stroke();
      }
    }
    function lantern(ctx, L, el, k) {                             // palace lantern: gold caps, ribs, gloss, tassel
      const rx = G.rx, ry = rx * .96;
      ctx.save();
      ctx.translate(L.x, -2); ctx.rotate(.06 * Math.sin(el * .0013 + L.ph));
      ctx.globalAlpha = k;
      ctx.strokeStyle = 'rgba(240,195,100,.85)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L.len); ctx.stroke();
      const capW = rx * .72, capH = ry * .22, top = L.len, cy = top + capH * .8 + ry, bot = cy + ry - capH * .2;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = .55 * k * (.85 + .15 * Math.sin(el * .004 + L.ph));
      ctx.drawImage(LGLOW, -rx * 1.7, cy - rx * 1.7, rx * 3.4, rx * 3.4);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = k;
      const body = ctx.createRadialGradient(-rx * .15, cy - ry * .2, rx * .05, 0, cy, rx * 1.05);
      body.addColorStop(0, '#ffe2a0'); body.addColorStop(.3, '#ff8a45'); body.addColorStop(.62, '#e2242b'); body.addColorStop(1, '#7c0810');
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(0, cy, rx, ry, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(110,6,10,.38)'; ctx.lineWidth = 1;
      for (const f of [.28, .58, .84]) { ctx.beginPath(); ctx.ellipse(0, cy, rx * f, ry, 0, 0, TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(0, cy - ry); ctx.lineTo(0, cy + ry); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.13)';
      ctx.beginPath(); ctx.ellipse(-rx * .45, cy - ry * .22, rx * .15, ry * .46, -.18, 0, TAU); ctx.fill();
      ctx.fillStyle = goldGrad(ctx, -capW / 2, 0, capW / 2, 0);
      rrect(ctx, -capW / 2, top, capW, capH, capH * .35); ctx.fill();
      rrect(ctx, -capW / 2, bot, capW, capH, capH * .35); ctx.fill();
      tassel(ctx, 0, bot + capH, ry * .9, el, L.ph);
      ctx.restore();
    }
    function doufang(ctx, el, k) {                                // hanging red diamond with a gold 福
      const { cx, hangY, cy, D } = G;
      const s = D * Math.SQRT2;
      ctx.save();
      ctx.translate(cx, hangY); ctx.rotate(.035 * Math.sin(el * .0011));
      ctx.globalAlpha = k;
      ctx.strokeStyle = 'rgba(240,195,100,.85)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, cy - hangY - D * .98); ctx.stroke();
      ctx.translate(0, cy - hangY);
      const sc = .72 + .28 * easeBack(k); ctx.scale(sc, sc);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = .42 * k; ctx.drawImage(RED, -D * 1.45, -D * 1.45, D * 2.9, D * 2.9);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = k;
      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
      const paper = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
      paper.addColorStop(0, '#ec3a3f'); paper.addColorStop(.5, '#c8141e'); paper.addColorStop(1, '#960b14');
      ctx.fillStyle = paper; ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.strokeStyle = goldGrad(ctx, -s / 2, -s / 2, s / 2, s / 2);
      ctx.lineWidth = Math.max(2, s * .028); ctx.strokeRect(-s * .45, -s * .45, s * .9, s * .9);
      ctx.lineWidth = 1; ctx.strokeRect(-s * .405, -s * .405, s * .81, s * .81);
      ctx.fillStyle = '#f3c76a';
      for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.arc(x * s * .36, y * s * .36, s * .02, 0, TAU); ctx.fill(); }
      ctx.restore();
      const fs = D * 1.02;
      ctx.font = `700 ${fs}px ${KAI}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const fg = ctx.createLinearGradient(0, -fs / 2, 0, fs / 2);
      fg.addColorStop(0, '#fff3c4'); fg.addColorStop(.5, '#f6c95a'); fg.addColorStop(1, '#c58d22');
      ctx.fillStyle = fg; ctx.shadowColor = 'rgba(255,190,80,.6)'; ctx.shadowBlur = 14;
      ctx.fillText('福', 0, fs * .05);
      ctx.shadowBlur = 0;
      tassel(ctx, 0, D * .98, D * .5, el, .7);
      ctx.restore();
    }

    return {
      build(w, h) {
        const D = Math.min(w * .26, h * .26), hangY = h * .04;
        const rx = clamp(w * .07, 15, 28);
        const cy = Math.max(hangY + h * .1 + D, h * .47);                       // centred on tall (desktop) canvases
        G = { cx: w / 2, hangY, D, cy, rx,
              lanterns: [{ x: w * .14, len: h * .16, ph: 0 }, { x: w * .86, len: h * .28, ph: 1.4 }] };
        const dens = clamp((w * h) / (380 * 430), .5, 1) * (reduceMotion ? .5 : 1);
        dust = Array.from({ length: Math.round(80 * dens) }, () => ({
          x: rand(-1.7, 1.7) * D, y: rand(-1.6, 1.6) * D, v: rand(.4, 1.2), size: rand(.6, 1.5), tw: rand(TAU), ph: rand(TAU), warm: Math.random() < .4
        }));
      },
      restart() { nextFw = 3600; },
      frame(ctx, el) {
        const k = easeOut(clamp((el - 200) / 1100, 0, 1));
        for (const L of G.lanterns) lantern(ctx, L, el, easeOut(clamp(el / 1000, 0, 1)));
        doufang(ctx, el, k);
        const { cx, cy, D } = G, span = 3.2 * D;                                   // gold dust drifting up
        ctx.globalCompositeOperation = 'lighter';
        for (const d of dust) {
          let y = d.y - el * d.v * .012;
          y = ((y + 1.6 * D) % span + span) % span - 1.6 * D;
          const x = cx + d.x + Math.sin(el * .001 + d.ph) * 6;
          const fade = 1 - Math.pow(Math.abs(y) / (1.6 * D), 2);
          ctx.globalAlpha = k * fade * (.35 + .65 * Math.abs(Math.sin(el * .002 + d.tw)));
          const s = d.size * 4.2;
          ctx.drawImage(d.warm ? WARM : GOLD, x - s / 2, cy + y - s / 2, s, s);
        }
        if (el > nextFw) {
          nextFw = el + (reduceMotion ? rand(4500, 6500) : rand(2800, 5000));
          const { W, H } = api.viewport();
          api.firework(rand(W * .12, W * .88), rand(H * .08, H * .36), pick(PAL));
        }
      },
      anchor() { return { x: G.cx, y: G.cy - G.D - 4 }; },
      tap(x, y, inside, px, py) {
        api.firework(px, Math.min(py, api.viewport().H * .8), pick(PAL));
        return true;
      }
    };
  }
};
