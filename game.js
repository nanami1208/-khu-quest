
/* =========================================================
   KHU QUEST — ゲーム本体
   データ：story.js（物語・キャンパス） / notes.js（攻略ノート・保存）
   ========================================================= */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const STORY = window.KHU_STORY;
  /* 背景画像は「前の場面のものを引き継ぐ」：bg を書いていない行は、同じ章の直前の行の背景をそのまま維持する。
     章が変わるか、キャンパス探索をはさむと、リセットされる。背景を消したい行は  bg: ''  と書く。 */
  (() => {
    let cur = null, lastCh = -1;
    STORY.forEach(it => {
      if (it.ch !== lastCh) { cur = null; lastCh = it.ch; }
      if (it.type === 'campus') { cur = null; return; }
      if ('bg' in it) cur = it.bg || null;
      it.bg = cur;
    });
  })();
  let CAMPUS = window.KHU_CAMPUS;                       // 今のキャンパス設定（story.js の type:'campus' の map で切り替え）
  const campusOf = item => (item && item.map && window.KHU_CAMPUSES && window.KHU_CAMPUSES[item.map]) || window.KHU_CAMPUS;
  const NOTES = window.KHU_NOTES, CATS = window.KHU_CATS, Store = window.KHUStore;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const IMG = {
    baby: 'assets/baby-lion.png',
    guide: 'assets/guide-lion.png',
    campus: 'assets/campus-background.png',
    title: 'assets/new-senior-campus-scene.png',        // タイトル画面（サムネ）＋ 物語の通常の背景（ぼかし）
    titleFallback: 'assets/title-background.jpg',        // 上の画像が無いときの代わり
  };
  /* 背景画像：.jpg が無ければ .png / .jpeg / .webp も自動で探す */
  function loadBg(path, targets, cb, fallback) {
    const base = path.replace(/\.[a-z]+$/i, '');
    const tries = [...new Set([base + '.webp', path, ...['.jpg', '.png', '.jpeg', '.JPG', '.PNG'].map(e => base + e)])];
    (function next(i) {
      if (i >= tries.length) { console.warn('[KHU QUEST] 画像が見つかりません:', path); if (fallback) loadBg(fallback, targets, cb); return; }
      const im = new Image();
      im.onload = () => { targets.forEach(id => $(id).style.backgroundImage = `url("${tries[i]}")`); cb && cb(tries[i]); };
      im.onerror = () => next(i + 1);
      im.src = tries[i];
    })(0);
  }
  loadBg(IMG.campus, ['map']);
  let titleUrl = null;
  loadBg(IMG.title, ['titlebg', 'storybg'], u => { titleUrl = u; }, IMG.titleFallback);
  /* ===================== 画像システム =====================
     story.js には「ファイル名（拡張子なし）」だけを書く。
     assets/ から .png → .jpg → .webp … の順で自動的に探す。
     （Windows が拡張子を隠していて lion-talking.png.png になっていても見つかる） */
  const Assets = (() => {
    const EXTS = ['.webp', '.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.png.png', '.jpg.jpg'];   // 軽い .webp があれば、それを先に読む
    const cache = new Map(), dims = new Map();
    function candidates(name) {
      const hasExt = /\.(png|jpe?g|webp)$/i.test(name);
      const base = hasExt ? name.replace(/\.(png|jpe?g|webp)$/i, '') : name;
      const list = hasExt ? ['assets/' + name] : [];
      EXTS.forEach(e => list.push('assets/' + base + e));
      return [...new Set(list)];
    }
    function resolve(name) {
      if (!name) return Promise.resolve(null);
      if (!cache.has(name)) {
        const tries = candidates(name);
        cache.set(name, new Promise(done => {
          (function next(i) {
            if (i >= tries.length) { console.warn('[KHU QUEST] 画像が見つかりません:', name); return done(null); }
            const im = new Image();
            im.onload = () => { dims.set(tries[i], { w: im.naturalWidth, h: im.naturalHeight }); done(tries[i]); };
            im.onerror = () => next(i + 1);
            im.src = tries[i];
          })(0);
        }));
      }
      return cache.get(name);
    }
    /* 横長（幅÷高さ が 1.25 以上）の画像は「一枚絵」、縦長は「立ち絵」として扱う */
    /* 名前が「立ち絵用」の画像（lion-girl-… / lion-boy-…）は、形に関係なく必ず左下の立ち絵にする。
       （横長の画像で作っても、背景と間違えられない） */
    const PORTRAIT_NAME = /^(lion-girl|lion-boy)-/;
    const isArt = (url, name) => { if (name && PORTRAIT_NAME.test(name)) return false; const d = dims.get(url); return !!d && d.w / d.h >= 1.25; };
    return { resolve, isArt, preload: names => { [...new Set(names.filter(Boolean))].forEach(resolve); } };
  })();
  /* ---------- 攻略ノートのアイコン：📘 の代わりに本のイラストを使う ----------
     assets/new-university-notebook を読み込み、まわりの透明な余白を切り詰めて使う。
     画像が無いとき（や、ファイルを直接開いて余白を切れないとき）は、📘 / 余白つきのまま。 */
  Assets.resolve('new-university-notebook').then(url => {
    if (!url) return;
    const im = new Image();
    im.onload = () => {
      let src = url;
      try {
        const L = 320, k = L / Math.max(im.naturalWidth, im.naturalHeight), W = Math.round(im.naturalWidth * k), H = Math.round(im.naturalHeight * k);
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, W, H);
        const d = x.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = -1, y1 = -1;
        for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) if (d[(yy * W + xx) * 4 + 3] > 10) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
        if (x1 > x0 && y1 > y0) {
          const bw = x1 - x0 + 1, bh = y1 - y0 + 1, s = 256 / Math.max(bw, bh);
          const o = document.createElement('canvas'); o.width = Math.round(bw * s); o.height = Math.round(bh * s);
          o.getContext('2d').drawImage(c, x0, y0, bw, bh, 0, 0, o.width, o.height);
          src = o.toDataURL('image/png');
        }
      } catch (e) { /* file:// で開いたときなど：切り詰めずに使う */ }
      document.documentElement.style.setProperty('--nbicon', `url("${src}")`);
      document.body.classList.add('nbimg');
      const fav = document.querySelector('link[rel="icon"]') || document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }));
      fav.href = src;
    };
    im.src = url;
  });
  const sceneAssets = it => it ? [it.pose, it.poseAfter, it.poseGood, it.poseBad, it.bg] : [];
  /* 先の数場面ぶんだけ先読み（全部を最初に読み込むと重いので） */
  function prefetch(from) { for (let k = from + 1; k <= from + 4 && k < STORY.length; k++) Assets.preload(sceneAssets(STORY[k])); }
  function prefetchCampus() {
    const G = CAMPUS.guide || {};
    Assets.preload([CAMPUS.popupBg, G.art, G.donePose, ...(G.poses || []), ...CAMPUS.spots.flatMap(s => [].concat(s.art || [], s.avatar || [], s.poses || []))].flat());
  }

  /* ---------- 立ち絵（左下）：ナレーションのときは何も出さない ---------- */
  const NARRATOR = 'ナレーション';
  const DEFAULT_POSE = { '小ライオン': 'baby-lion', '先輩ライオン': 'guide-lion' };
  let portraitToken = 0;
  function showPortrait(who, pose, sceneBg) {
    const p = $('portrait'), img = $('portraitimg');
    const fallback = who === NARRATOR ? null : (DEFAULT_POSE[who] || null);
    const name = who === NARRATOR ? null : (pose || fallback);
    p.classList.toggle('off', !name);
    const token = ++portraitToken;
    if (!name) return;
    Assets.resolve(name).then(url => {
      if (token !== portraitToken) return;
      if (url && Assets.isArt(url, name)) {            // 横長の画像 → 立ち絵ではなく一枚絵として背景に
        p.classList.add('off'); setStoryBg(name); return;
      }
      setStoryBg(sceneBg);                        // 縦長 → 背景はその場面の指定に戻す
      return (url ? Promise.resolve(url) : Assets.resolve(fallback)).then(u => {
        if (token !== portraitToken) return;
        if (u) { img.classList.remove('missing'); if (!img.src.endsWith(u)) img.src = u; }
        else img.classList.add('missing');        // 画像が無いときは 🦁 の絵文字
      });
    });
    p.classList.remove('talk'); void p.offsetWidth; p.classList.add('talk');
  }

  /* ---------- 物語の背景：一枚絵（くっきり） / 指定なし＝タイトル背景（ぼかし） ---------- */
  const bgA = $('storybg'), bgB = bgA.cloneNode(false);
  bgB.id = 'storybg2'; bgA.after(bgB);
  bgA.classList.add('on');
  const bgLayers = [bgA, bgB];
  let bgFront = 0, bgCurrent = null, bgToken = 0;
  function setStoryBg(name) {
    name = name || null;
    if (name === bgCurrent) return;
    bgCurrent = name;
    const token = ++bgToken;
    Assets.resolve(name).then(url => {
      if (token !== bgToken) return;
      const front = bgLayers[bgFront], back = bgLayers[1 - bgFront];
      const art = !!(name && url);
      back.style.backgroundImage = art ? `url("${url}")` : (titleUrl ? `url("${titleUrl}")` : '');
      back.classList.toggle('art', art);
      back.classList.add('on'); front.classList.remove('on');
      bgFront = 1 - bgFront;
    });
  }

  /* ---------- キャンパス：一枚絵（背景いっぱい）＋立ち絵（左下） ---------- */
  let campusToken = 0;
  function campusReset() {
    campusToken++;
    $('campusart').classList.remove('visible', 'dim');
    $('campuscaption').classList.remove('visible');
    $('campusportrait').classList.remove('visible');
    $('campus').classList.remove('with-portrait');
  }
  function campusScene(meta, i) {
    meta = meta || {};
    const token = ++campusToken, artEl = $('campusart'), pEl = $('campusportrait');
    const pose = (meta.poses && meta.poses[i]) || meta.fallback || null;
    // art は、1枚の名前でも、[候補1, 候補2, …] でもよい。最初に見つかった画像を使う（名前違い・未配置のときの保険）
    const resolveArt = a => Array.isArray(a)
      ? Promise.all(a.map(x => Assets.resolve(x))).then(us => us.find(Boolean) || null)
      : Assets.resolve(a);
    const caption = meta.captions ? (meta.captions[i] || '') : (meta.caption || '');       // captions: セリフごとの大きな文字
    Promise.all([resolveArt(meta.art), Assets.resolve(pose)]).then(([artUrl, poseUrl]) => {
      if (token !== campusToken) return;
      const poseIsArt = !!poseUrl && Assets.isArt(poseUrl, pose);     // 横長 → 一枚絵 / 縦長 → 左下の立ち絵
      const bgUrl = poseIsArt ? poseUrl : artUrl;
      artEl.style.backgroundImage = bgUrl ? `url("${bgUrl}")` : '';
      artEl.classList.toggle('visible', !!bgUrl);                   // 画像が無いときは、暗い幕を出さず、地図をそのまま見せる
      artEl.classList.remove('dim');
      const cap = $('campuscaption');
      cap.textContent = caption;
      cap.classList.toggle('visible', !!caption);
      if (poseUrl && !poseIsArt) { pEl.src = poseUrl; pEl.classList.add('visible'); $('campus').classList.add('with-portrait'); }
      else { pEl.classList.remove('visible'); $('campus').classList.remove('with-portrait'); }
    });
  }

  /* ===================== サウンド（ファイル不要・WebAudio） ===================== */
  const Sound = (() => {
    let ctx = null;
    function ac() {
      if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(freq, dur = .08, type = 'square', vol = .04, when = 0, slide = 0) {
      if (Store.data.muted) return;
      const c = ac(); if (!c) return;
      const t = c.currentTime + when;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(c.destination);
      o.start(t); o.stop(t + dur + .02);
    }
    return {
      wake: ac,
      blip: () => tone(900 + Math.random() * 140, .025, 'square', .012),
      select: () => { tone(660, .06, 'triangle', .05); tone(990, .08, 'triangle', .05, .05); },
      good: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .13, 'triangle', .06, i * .07)),
      bad: () => tone(240, .28, 'sawtooth', .035, 0, 110),
      note: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, .16, 'sine', .07, i * .06)),
      whoosh: () => tone(180, .32, 'sine', .04, 0, 700),
      chapter: () => { tone(392, .5, 'sine', .05); tone(587, .7, 'sine', .04, .12); tone(784, .9, 'sine', .035, .24); },
      fanfare: () => [[523, 0], [523, .12], [523, .24], [659, .36], [784, .6], [659, .78], [784, .9], [1047, 1.1]]
        .forEach(([f, t]) => { tone(f, .24, 'triangle', .07, t); tone(f / 2, .24, 'sine', .05, t); }),
    };
  })();

  /* ===================== 文字送り ===================== */
  let typing = null;
  function typeText(el, text, done) {
    if (typing) { clearTimeout(typing.timer); typing = null; }
    const chars = [...text];
    if (reduced) { el.textContent = text; done && done(); return; }
    let i = 0;
    el.textContent = '';
    typing = { el, text, done, timer: 0 };
    const tick = () => {
      i++;
      el.textContent = chars.slice(0, i).join('');
      if (i % 2 === 0) Sound.blip();
      if (i >= chars.length) { const d = typing.done; typing = null; d && d(); return; }
      const c = chars[i - 1];
      typing.timer = setTimeout(tick, '。！？…!?'.includes(c) ? 150 : '、,'.includes(c) ? 80 : 30);
    };
    typing.timer = setTimeout(tick, 30);
  }
  /* 表示中なら全文を出して true を返す */
  function finishTyping() {
    if (!typing) return false;
    clearTimeout(typing.timer);
    typing.el.textContent = typing.text;
    const d = typing.done; typing = null; d && d();
    return true;
  }

  /* ===================== シーン切り替え ===================== */
  let scene = 'start', busy = false;
  function setScene(s) {
    scene = s;
    document.querySelectorAll('.scene').forEach(e => e.classList.toggle('active', e.id === s));
  }
  function transition(s, mid) {
    if (reduced) { mid && mid(); setScene(s); return; }
    busy = true;
    const w = $('wipe');
    w.className = 'wipe in';
    Sound.whoosh();

    setTimeout(() => {
      setScene(s); mid && mid();
      w.className = 'wipe out';
      setTimeout(() => { w.className = 'wipe'; busy = false; }, 460);
    }, 430);
  }
  function chapterCard(ch, cb, prep, instant) {
    busy = true;
    $('ccnum').textContent = `CHAPTER ${ch + 1}`;
    $('ccen').textContent = window.KHU_CHAPTER_EN[ch];
    $('cctitle').textContent = window.KHU_CHAPTERS[ch];
    const card = $('chaptercard');
    card.classList.toggle('instant', !!instant);            // タイトルからの開始：ワイプが抜けた瞬間から不透明にして、物語の画面が一瞬も見えないようにする
    card.classList.remove('show'); void card.offsetWidth; card.classList.add('show');
    Sound.chapter();
    /* ① カードが完全に不透明な間（0.9秒）に、裏で場面だけ切り替える。古いセリフが見えないよう空にしておく
       ② カードが消え始めてから（1.8秒）、セリフを出し始める → 「フライング」しない */
    setTimeout(() => { setScene('story'); prep && prep(); }, reduced ? 200 : 900);
    setTimeout(() => cb(), reduced ? 300 : 1800);
    setTimeout(() => { card.classList.remove('show'); busy = false; }, reduced ? 400 : 2100);
  }
  function flash() {
    const f = $('flash');
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  }
  function shake(el) {
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  }

  /* ===================== 攻略ノート ===================== */
  const noteById = id => NOTES.find(n => n.id === id);
  const catById = id => CATS.find(c => c.id === id);
  function refreshCounts() {
    $('notecount').textContent = Store.count();
    $('notetotal').textContent = NOTES.length;
    $('howtotal').textContent = NOTES.length;
    const d = Store.data;
    $('titlemeta').innerHTML = (Store.count() || d.clears)
      ? `<i class="nbicon"></i> 攻略ノート <b>${Store.count()}/${NOTES.length}</b>　🏆 クリア <b>${d.clears}</b>回` : '';
  }
  function giveNote(id) {
    const n = noteById(id);
    if (!n) return;
    const isNew = Store.unlock(id);
    const got = runGot[chapter] || (runGot[chapter] = new Map());
    if (!got.has(id)) got.set(id, isNew);
    if (!isNew) return;
    refreshCounts();
    Sound.note();
    const btn = $('notebtn');
    btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse');
    const cat = catById(n.cat);
    const t = document.createElement('button');
    t.className = 'toast';
    t.style.setProperty('--c', cat.color);
    t.innerHTML = `<span class="ticon">${cat.icon}</span><span><small>攻略ノート GET! · ${n.rarity}</small><b>${n.title}</b></span>`;
    t.onclick = () => openDetail(n);
    $('toasts').append(t);
    setTimeout(() => t.classList.add('bye'), 3400);
    setTimeout(() => t.remove(), 3900);
  }

  let nbFilter = 'all', modal = null;
  function openModal(id) { closeModal(); modal = id; $(id).hidden = false; }
  function closeModal() { if (modal) $(modal).hidden = true; modal = null; }
  function openNotebook() { renderNotebook(); openModal('notebook'); }
  function renderNotebook() {
    const pct = Math.round(Store.count() / NOTES.length * 100);
    $('nbpct').textContent = `${Store.count()} / ${NOTES.length}（${pct}%）`;
    $('nbbar').style.width = pct + '%';
    const tabs = [{ id: 'all', label: 'すべて', icon: '✦' }, ...CATS];
    $('nbtabs').innerHTML = '';
    tabs.forEach(c => {
      const b = document.createElement('button');
      const got = NOTES.filter(n => (c.id === 'all' || n.cat === c.id) && Store.has(n.id)).length;
      const all = NOTES.filter(n => c.id === 'all' || n.cat === c.id).length;
      b.className = 'tab' + (nbFilter === c.id ? ' on' : '');
      b.innerHTML = `${c.icon} ${c.label} <small>${got}/${all}</small>`;
      b.onclick = () => { nbFilter = c.id; renderNotebook(); };
      $('nbtabs').append(b);
    });
    $('nbgrid').innerHTML = '';
    NOTES.filter(n => nbFilter === 'all' || n.cat === nbFilter).forEach(n => {
      const cat = catById(n.cat), got = Store.has(n.id);
      const card = document.createElement('button');
      card.className = 'ncard' + (got ? '' : ' locked') + ' r-' + n.rarity;
      card.style.setProperty('--c', cat.color);
      card.innerHTML = got
        ? `<span class="rar">${n.rarity}</span><span class="nicon">${cat.icon}</span><b>${n.title}</b><small>${n.lead}</small>`
        : `<span class="rar">?</span><span class="nicon">🔒</span><b>？？？</b><small>入手方法：${n.how}</small>`;
      if (got) card.onclick = () => openDetail(n);
      else card.disabled = true;
      $('nbgrid').append(card);
    });
  }
  function openDetail(n) {
    const cat = catById(n.cat);
    const back = modal === 'notebook';
    $('ndcard').style.setProperty('--c', cat.color);
    $('ndcard').innerHTML = `
      <button class="close" data-close>✕</button>
      <div class="ndtop"><span class="chip c">${cat.icon} ${cat.label}</span><span class="rar big">${n.rarity}</span></div>
      <h2>${n.title}</h2>
      <p class="lead">${n.lead}</p>
      <ul>${n.body.map(b => `<li>${b}</li>`).join('')}</ul>
      <div class="tip">💡 ${n.tip}</div>
      ${n.check ? '<div class="check">⚠ 制度・条件は年度で変わります。最新の公式募集要項で確認してください。</div>' : ''}
      ${n.link ? `<p><a class="cl-link" href="${n.link.url}" target="_blank" rel="noopener">🔗 ${n.link.label}</a></p>` : ''}
      ${back ? '<button class="btn ghost small" id="ndback">← ノート一覧へ</button>' : ''}`;
    openModal('notedetail');
    if (back) $('ndback').onclick = openNotebook;
  }
  document.addEventListener('click', e => {
    if (e.target.closest('[data-close]') || e.target.classList.contains('modal')) closeModal();
  });

  /* ===================== 物語 ===================== */
  const quizTotal = STORY.filter(s => s.quiz).length;
  let step = 0, chapter = -1, correct = 0, waitingChoice = false;
  let quizResults = {};
  let runGot = {};
  let clearedFor = -1;
  const pad = n => String(n).padStart(2, '0');

  /* 各章で手に入るノートの一覧（story.js から自動で集計） */
  const chapterNotes = window.KHU_CHAPTERS.map(() => new Set());
  STORY.forEach(s => {
    if (s.ch === undefined) return;
    [s.note, s.goodNote, s.quiz && s.quiz.note].forEach(id => id && chapterNotes[s.ch].add(id));
    if (s.type === 'campus') {
      const C = campusOf(s);
      if (C.guide && C.guide.note) chapterNotes[s.ch].add(C.guide.note);
      C.spots.forEach(sp => sp.note && chapterNotes[s.ch].add(sp.note));
    }
  });
  const chapterStart = ch => STORY.findIndex(s => s.ch === ch);

  function startGame() {
    if (busy) return;
    Sound.wake(); Sound.select();
    Store.data.plays++; Store.save();
    step = 0; chapter = -1; correct = 0; quizResults = {}; runGot = {}; clearedFor = -1;
    transition('story', () => { $('storybox').classList.add('hidden'); showStep(); });
  }
  function updateChapterUI() {
    $('progress').textContent = `CHAPTER ${chapter + 1} / ${window.KHU_CHAPTERS.length}`;
    $('chaptertag').textContent = `CHAPTER ${chapter + 1} · ${window.KHU_CHAPTERS[chapter]}`;
    $('chapterbar').innerHTML = window.KHU_CHAPTERS.map((_, i) =>
      `<i class="${i < chapter ? 'done' : i === chapter ? 'now' : ''}"></i>`).join('');
  }
  function showStep() {
    const item = STORY[step];
    const atEnd = !item || item.type === 'end';
    if (chapter !== -1 && clearedFor !== chapter && (atEnd || item.ch !== chapter)) {
      clearedFor = chapter;
      return showChapterClear(chapter);
    }
    if (atEnd) return finish();
    if (item.type === 'campus') return transition('campus', () => enterCampus(item));
    if (item.ch !== chapter) {
      const first = chapter === -1;
      chapter = item.ch; updateChapterUI();
      return chapterCard(chapter, () => renderStep(item), () => prepareStory(item), first);
    }
    if (scene !== 'story') return transition('story', () => renderStep(item));
    if (item.dream) return dreamWake(item);
    renderStep(item);
  }
  /* ---------- 夢オチの演出：暗転 → 「……」 → 白い光とともに目が覚める ----------
     story.js で dream: true を付けた行の直前に、間をあける。長さは下の数字（ミリ秒）で調整できる */
  const DREAM = { black: 1000, dots: 1700, wake: 800, reveal: 700, end: 1000 };
  function dreamWake(item) {
    if (reduced) { renderStep(item); return; }
    busy = true;
    const fx = $('dreamfx');
    fx.className = 'dreamfx'; void fx.offsetWidth; fx.classList.add('on');          // ① ゆっくり暗転
    $('storybox').classList.add('hidden');
    Sound.whoosh();
    let t = DREAM.black;
    setTimeout(() => fx.classList.add('dots'), t);                                // ② 「……」が浮かぶ（夢の終わりの余韻）
    t += DREAM.dots;
    setTimeout(() => { fx.classList.add('wake'); Sound.wake(); prepareStory(item); }, t);   // ③ 白く光る：その裏で背景を切り替える
    t += DREAM.wake;
    setTimeout(() => { fx.classList.add('off'); renderStep(item); }, t);          // ④ 光が引いて、目が覚めた場面とセリフ
    setTimeout(() => { fx.className = 'dreamfx'; busy = false; }, t + DREAM.end);
  }
  /* 章カードの裏で行う下準備：古いセリフ・立ち絵を消し、背景だけ先に決めておく */
  function prepareStory(item) {
    $('storybox').classList.add('hidden');
    $('storyline').textContent = '';
    $('choices').innerHTML = '';
    showPortrait(NARRATOR, null);
    setStoryBg(item.bg);
  }
  function renderStep(item) {
    const box = $('storybox');
    box.classList.remove('hidden');
    box.classList.toggle('narration', item.who === 'ナレーション');
    box.classList.toggle('big', !!item.big);
    box.classList.remove('ready');
    $('speaker').textContent = item.who === NARRATOR ? '' : item.who;
    setStoryBg(item.bg);
    showPortrait(item.who, item.pose, item.bg);
    prefetch(step);
    $('choices').innerHTML = '';
    waitingChoice = false;
    if (item.big) { flash(); Sound.fanfare(); burst(120); }
    typeText($('storyline'), item.text, () => {
      if (item.note) giveNote(item.note);   // 文字送りの完了時に付与（素早く送っても取りこぼさない）
      if (item.choices) showChoices(item); else box.classList.add('ready');
    });
  }
  function showChoices(item) {
    waitingChoice = true;
    item.choices.forEach(([label, good], i) => {
      const b = document.createElement('button');
      b.className = 'choice';
      b.style.animationDelay = i * 0.08 + 's';
      b.innerHTML = `<kbd>${i + 1}</kbd>${label}`;
      b.onclick = () => pickChoice(item, good);
      $('choices').append(b);
    });
  }
  function pickChoice(item, good) {
    if (!waitingChoice) return;
    waitingChoice = false;
    $('choices').innerHTML = '';
    if (good === true) Sound.good();
    else if (good === false) { Sound.bad(); shake($('storybox')); }
    else Sound.select();
    if (good === true && item.goodNote) setTimeout(() => giveNote(item.goodNote), 300);
    if (item.reveal) flash();
    const extra = good === true ? item.afterGood : good === false ? item.afterBad : item.after;
    const aw = item.whoAfter || item.who;                       // 選んだあとの話者
    $('speaker').textContent = aw === NARRATOR ? '' : aw;
    $('storybox').classList.toggle('narration', aw === NARRATOR);
    showPortrait(aw, (good === true ? item.poseGood : good === false ? item.poseBad : item.poseAfter) || (item.whoAfter ? null : item.pose), item.bg);
    typeText($('storyline'), extra || item.text, () => $('storybox').classList.add('ready'));
  }
  function advanceStory() {
    if (busy || modal) return;
    if (finishTyping()) return;
    if (waitingChoice) return;
    const item = STORY[step];
    if (item && item.quiz) return transition('quiz', () => renderQuiz(item.quiz));
    Sound.select();
    step++; showStep();
  }
  $('storybox').addEventListener('click', e => { if (!e.target.closest('.choice')) advanceStory(); });

  /* ===================== クイズ ===================== */
  let curQuiz = null, answered = false;
  function renderQuiz(q) {
    curQuiz = q; answered = false;
    const quizNo = STORY.filter((s, i) => s.quiz && i <= step).length;
    $('qtag').textContent = `CHAPTER ${chapter + 1} · MINI QUIZ ${quizNo}/${quizTotal}`;
    $('question').textContent = q.q;
    $('feedback').textContent = '';
    $('feedback').className = 'feedback';
    $('quiznext').hidden = true;
    $('answers').innerHTML = '';
    q.a.forEach((a, i) => {
      const b = document.createElement('button');
      b.className = 'answer';
      b.style.animationDelay = i * 0.08 + 's';
      b.innerHTML = `<kbd>${'ABC'[i]}</kbd>${a}`;
      b.onclick = () => answerQuiz(i);
      $('answers').append(b);
    });
  }
  function answerQuiz(i) {
    if (answered) return;
    answered = true;
    const q = curQuiz, ok = i === q.c;
    quizResults[step] = ok;
    correct = Object.values(quizResults).filter(Boolean).length;
    if (ok) { Sound.good(); } else { Sound.bad(); shake($('answers')); }
    [...$('answers').children].forEach((b, j) => {
      b.disabled = true;
      if (j === q.c) b.classList.add('correct'); else if (j === i) b.classList.add('wrong');
    });
    $('feedback').textContent = (ok ? '⭕ 正解！ ' : '❌ おしい！ ') + q.ex;
    $('feedback').className = 'feedback ' + (ok ? 'ok' : 'ng');
    $('quiznext').hidden = false;
    if (q.note) setTimeout(() => giveNote(q.note), 500);
  }
  $('quiznext').onclick = () => {
    if (!answered || busy) return;
    Sound.select(); step++; showStep();
  };

  /* ===================== キャンパス探索 ===================== */
  let pos = { x: 0, y: 0 }, guideDone = false, spotsDone = new Set(), talk = null, facing = 1;
  let spotsTotal = CAMPUS.spots.length;
  const spotOpen = s => !s.req || spotsDone.has(s.req);          // req（先に調べるスポット）を終えるまで、光らない・調べられない

  function enterCampus(item) {
    CAMPUS = campusOf(item);
    spotsTotal = CAMPUS.spots.length;
    $('spottotal').textContent = spotsTotal;
    $('campustitle').textContent = CAMPUS.title || '🏫 慶熙大学 ソウルキャンパス';
    pos = { ...CAMPUS.start };
    spotsDone = new Set(); talk = null;
    guideDone = !CAMPUS.guide;                                   // 案内役がいない場面は、最初から「話しかけ済み」
    $('dialog').classList.remove('show');
    campusReset(); prefetchCampus();
    $('leavebtn').classList.remove('show');
    $('spots').innerHTML = CAMPUS.spots.map(s =>
      `<div class="spot ${s.req ? 'locked' : ''}" id="spot-${s.id}" style="left:${s.x}%;top:${s.y}%"><i>✦</i><span>${s.name}</span></div>`).join('');
    const gd = $('guide');
    gd.hidden = !CAMPUS.guide;
    if (CAMPUS.guide) { gd.style.left = CAMPUS.guide.x + '%'; gd.style.top = CAMPUS.guide.y + '%'; gd.classList.add('wants'); }
    updateCampusHud();
    draw();
  }
  function updateCampusHud() {
    $('spotcount').textContent = spotsDone.size;
    const M = CAMPUS.mission || {};
    $('mission').textContent = !guideDone
      ? (M.start || 'MISSION · 先輩ライオンに話しかけよう')
      : spotsDone.size < spotsTotal
        ? (CAMPUS.guide ? 'CLEAR！ ✦ を調べるか「次へ進む」を押そう' : (M.going || '光っている場所（✦）を調べよう'))
        : (M.done || '全部調べた！ PERFECT 🎉 「次へ進む」を押そう');
    // 案内役がいない場面は、全部調べ終わったら「次へ進む」を出す
    if (!CAMPUS.guide && spotsDone.size >= spotsTotal) $('leavebtn').classList.add('show');
  }
  const dist = (a, b) => Math.hypot((a.x - b.x) * 1.6, a.y - b.y);
  function nearest() {
    const list = [...(CAMPUS.guide ? [{ kind: 'guide', ...CAMPUS.guide }] : []),
      ...CAMPUS.spots.filter(s => !spotsDone.has(s.id) && spotOpen(s)).map(s => ({ kind: 'spot', ...s }))];
    let best = null, bd = 14;
    list.forEach(o => { const d = dist(pos, o); if (d < bd) { bd = d; best = o; } });
    return best;
  }
  function draw() {
    const b = $('baby');
    b.style.left = pos.x + '%'; b.style.top = pos.y + '%';
    b.style.zIndex = pos.y > (CAMPUS.guide ? CAMPUS.guide.y : 0) ? 4 : 2;
    b.querySelector('.lion-image').style.transform = `scaleX(${facing})`;
    // カメラ：マップが画面より横長のとき（スマホ縦向き）は主人公を追いかける
    const world = $('world'), view = $('campus').clientWidth, ww = world.clientWidth;
    if (ww > view + 1) {
      const off = Math.max(0, Math.min(ww - view, ww * pos.x / 100 - view / 2));
      world.style.transform = `translateX(${-off}px)`;
    } else world.style.transform = '';
    const n = talk ? null : nearest(), h = $('hint');
    if (n) {
      h.textContent = n.kind === 'guide' ? 'E で話しかける' : `E で調べる：${n.name}`;
      h.style.left = n.x + '%'; h.style.top = (n.y - (n.kind === 'guide' ? 13 : 6)) + '%';
      h.classList.add('show');
    } else h.classList.remove('show');
  }
  function startTalk(who, lines, onEnd, meta) {
    talk = { lines, i: 0, onEnd, meta };
    $('dialogwho').textContent = who;
    $('dialog').classList.add('show');
    $('campus').classList.add('talking');
    $('hint').classList.remove('show');
    Sound.select();
    campusScene(meta, 0);
    typeText($('dialogline'), lines[0]);
  }
  /* ---------- 学科の紹介ポップアップ：全部の内容を一気に見せる。アバターは最後まで同じ人 ---------- */
  function openDeptPopup(n, onEnd) {
    talk = { popup: true, onEnd };
    $('hint').classList.remove('show');
    $('campus').classList.add('talking');
    $('depttitle').textContent = n.name;
    $('deptbody').innerHTML = n.lines.map(l => {
      const m = /^【(.+?)】([\s\S]*)$/.exec(l);
      return m ? `<section><h4>${m[1]}</h4><p>${m[2]}</p></section>` : `<section><p>${l}</p></section>`;
    }).join('');
    $('deptcard').scrollTop = 0;
    const av = $('deptavatar');
    $('deptwho').textContent = n.avatarName || '';
    $('deptwhonote').textContent = n.avatarNote || '';
    $('deptchar').hidden = true; av.removeAttribute('src');
    Assets.resolve(n.avatar).then(url => { if (url && talk && talk.popup) { av.src = url; $('deptchar').hidden = false; } });
    const pop = $('deptpop');
    pop.style.backgroundImage = '';
    Assets.resolve(CAMPUS.popupBg).then(url => {                         // 学科紹介の後ろに、坂の上の一枚絵を敷く（暗くして、文字が読めるように）
      if (url && talk && talk.popup) pop.style.backgroundImage = `linear-gradient(#0b0710a6, #0b0710d6), url("${url}")`;
    });
    $('deptpop').hidden = false;
    Sound.select();
  }
  function closeDeptPopup() {
    const end = talk && talk.onEnd; talk = null;
    $('deptpop').hidden = true;
    $('campus').classList.remove('talking');
    Sound.good();
    end && end(); draw();
  }
  function advanceTalk() {
    if (talk && talk.popup) return closeDeptPopup();
    if (finishTyping()) return;
    talk.i++;
    if (talk.i >= talk.lines.length) {
      const end = talk.onEnd; talk = null;
      $('dialog').classList.remove('show');
      campusReset();
      $('campus').classList.remove('talking');
      end && end(); draw();
    } else { Sound.blip(); campusScene(talk.meta, talk.i); typeText($('dialogline'), talk.lines[talk.i]); }
  }
  function interact() {
    if (scene !== 'campus' || busy || modal) return;
    if (talk) return advanceTalk();
    const n = nearest();
    if (!n) return;
    if (n.kind === 'guide') {
      startTalk('🦁 先輩ライオン', guideDone ? ['気になる場所は調べられたかな？ 準備ができたら次へ進もう！'] : CAMPUS.guide.lines, () => {
        if (!guideDone) {
          guideDone = true;
          $('guide').classList.remove('wants');
          giveNote(CAMPUS.guide.note);
          $('leavebtn').classList.add('show');
          Sound.good();
        }
        updateCampusHud();
      }, { art: CAMPUS.guide.art, poses: guideDone ? [CAMPUS.guide.donePose] : CAMPUS.guide.poses });
    } else {
      const finishSpot = () => {
        spotsDone.add(n.id);
        $('spot-' + n.id).classList.add('done');
        CAMPUS.spots.forEach(s => { if (s.req === n.id) { const el = $('spot-' + s.id); el.classList.remove('locked'); el.classList.add('unlocked'); } });
        n.note && giveNote(n.note);
        updateCampusHud();
      };
      if (n.popup) return openDeptPopup(n, finishSpot);
      startTalk(n.who || `🔍 ${n.name}`, n.lines, finishSpot, { art: n.art, poses: n.poses, fallback: n.fallback || 'baby-lion', caption: n.caption, captions: n.captions });
    }
  }
  $('talk').onclick = interact;
  $('deptok').onclick = () => talk && talk.popup && closeDeptPopup();
  $('deptclose').onclick = () => talk && talk.popup && closeDeptPopup();
  /* 座標ピッカー：URLの末尾に ?pick を付けて開き、キャンパス画面で地図をクリックすると、x / y（%）が表示される */
  if (/[?&]pick\b/.test(location.search)) {
    $('map').addEventListener('click', e => {
      const r = $('world').getBoundingClientRect();
      const x = Math.round((e.clientX - r.left) / r.width * 100), y = Math.round((e.clientY - r.top) / r.height * 100);
      const h = $('hint'); h.textContent = `x: ${x}, y: ${y}`; h.style.left = x + '%'; h.style.top = y + '%'; h.classList.add('show');
      console.log(`x: ${x}, y: ${y}`);
    });
  }

  $('dialog').onclick = () => talk && advanceTalk();
  $('leavebtn').onclick = () => {
    if (!guideDone || busy || talk) return;
    Sound.select(); step++; showStep();
  };

  /* ===================== チャプタークリア ===================== */
  function showChapterClear(ch) {
    const info = window.KHU_CHAPTER_CLEAR[ch] || {};
    const got = runGot[ch] || new Map();
    const all = [...chapterNotes[ch]];
    const last = ch === window.KHU_CHAPTERS.length - 1;
    $('cltag').textContent = `CHAPTER ${pad(ch + 1)} CLEAR!`;
    $('clhead').textContent = info.head || window.KHU_CHAPTERS[ch];
    $('clmsg').textContent = info.msg || '';
    $('clcount').textContent = `この章のノート ${all.filter(id => Store.has(id)).length} / ${all.length}`;
    const list = NOTES.filter(n => got.has(n.id));
    $('clnotes').innerHTML = list.length ? list.map(n => {
      const cat = catById(n.cat);
      return `<div class="cl-note" style="--c:${cat.color}">
        <button class="cl-title" data-note="${n.id}">
          <span class="cl-no">留学攻略ノート ${pad(NOTES.indexOf(n) + 1)}
            <span class="cl-badges">${got.get(n.id) ? '<em class="new">NEW</em>' : ''}<span class="rar">${n.rarity}</span></span></span>
          ${n.title}
        </button>
        <ul>${(n.points || []).map(p => `<li>${p}</li>`).join('')}</ul>
        ${n.link ? `<a class="cl-link" href="${n.link.url}" target="_blank" rel="noopener">🔗 ${n.link.label}</a>` : ''}
      </div>`;
    }).join('') : '<p class="cl-none">この章では、まだノートを手に入れていません。</p>';
    $('clnotes').querySelectorAll('[data-note]').forEach(b => b.onclick = () => openDetail(noteById(b.dataset.note)));
    const missing = all.filter(id => !Store.has(id)).length;
    $('clmiss').innerHTML = missing
      ? `🔍 まだ見つけていないノートが <b>${missing}枚</b> あります。「この章をもう一度」で探してみよう！`
      : '✨ この章のノートはコンプリート！';
    $('clmiss').className = 'cl-miss' + (missing ? '' : ' perfect');
    $('clnext').textContent = last ? 'ストーリークリアへ →' : '次の章へ →';
    $('progress').textContent = `CHAPTER ${ch + 1} CLEAR`;
    transition('clear', () => { Sound.good(); burst(70); });
  }
  $('clnext').onclick = () => { if (busy) return; Sound.select(); showStep(); };
  $('clreplay').onclick = () => {
    if (busy) return;
    const ch = clearedFor;
    Sound.select();
    runGot[ch] = new Map();
    step = chapterStart(ch); chapter = -1; clearedFor = -1;
    showStep();
  };

  /* ===================== STORY CLEAR（エンディング） ===================== */
  function finish() {
    const d = Store.data;
    d.clears++;
    d.bestScore = Math.max(d.bestScore ?? 0, correct);
    d.quizMax = quizTotal;
    Store.save();
    refreshCounts();
    const st = window.KHU_STORIES[0], next = window.KHU_STORIES[1];
    $('storytag').textContent = `STORY ${st.no} CLEAR!`;
    $('storyhead').textContent = st.clearHead;
    $('storymsg').textContent = st.clearMsg;
    const ratio = (quizTotal ? correct / quizTotal : 1) * 0.5 + (Store.count() / NOTES.length) * 0.5;
    const rank = ratio >= .95 ? 'S' : ratio >= .75 ? 'A' : ratio >= .5 ? 'B' : 'C';
    $('score').textContent = `${correct}/${quizTotal}`;
    $('endnotes').textContent = `${Store.count()}/${NOTES.length}`;
    $('rank').textContent = rank;
    $('rank').className = 'rank-' + rank;
    $('nextstory').innerHTML = next
      ? (next.locked
        ? `<span class="lock">🔒</span><div><small>NEXT STORY</small><b>STORY ${next.no}「${next.title}」</b></div><em>COMING SOON</em>`
        : `<span class="lock">🔓</span><div><small>NEXT STORY</small><b>STORY ${next.no}「${next.title}」解放！</b></div>`)
      : '';
    const endLion = $('endlion');
    Assets.resolve(st.pose).then(url => { if (url) { endLion.src = url; endLion.hidden = false; } else endLion.hidden = true; });
    $('progress').textContent = `STORY ${st.no} CLEAR`;
    transition('end', () => { Sound.fanfare(); burst(160); });
  }

  /* ===================== 桜の花びら（canvas） ===================== */
  const cv = $('fx'), cx = cv.getContext('2d');
  let petals = [], W = 0, H = 0;
  function resize() {
    const r = $('game').getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  /* 桜はクリアしたときだけ、上から降らせる */
  function petal() {
    return {
      x: Math.random() * W * 1.1 - W * 0.1,
      y: -20 - Math.random() * H * 0.5,
      vx: 10 + Math.random() * 30,
      vy: 70 + Math.random() * 50,
      r: 4 + Math.random() * 5, a: Math.random() * 6.28, va: (Math.random() - .5) * 4,
      sway: Math.random() * 6.28, temp: false,
      hue: Math.random() < .2 ? '#fff4f6' : Math.random() < .5 ? '#ffc6d3' : '#f9a8bd',
    };
  }
  function burst(n) { if (reduced) return; for (let i = 0; i < n; i++) petals.push(petal()); }
  function ambient() { return 0; }

  /* ===================== メインループ ===================== */
  const keys = {};
  let last = 0;
  function loop(t) {
    const dt = Math.min((t - last) / 1000, .04); last = t;
    // 移動
    if (scene === 'campus' && !talk && !busy && !modal) {
      let dx = 0, dy = 0;
      if (keys.ArrowLeft || keys.a) dx--;
      if (keys.ArrowRight || keys.d) dx++;
      if (keys.ArrowUp || keys.w) dy--;
      if (keys.ArrowDown || keys.s) dy++;
      const moving = !!(dx || dy);
      $('baby').classList.toggle('walking', moving);
      if (moving) {
        if (dx) facing = dx < 0 ? -1 : 1;
        const k = dt * 20 / Math.hypot(dx, dy);
        pos.x = Math.max(4, Math.min(96, pos.x + dx * k));
        pos.y = Math.max(18, Math.min(95, pos.y + dy * k));
        draw();
      }
    }
    // 花びら
    cx.clearRect(0, 0, W, H);
    while (petals.filter(p => !p.temp).length < ambient()) petals.push(petal(false));
    petals = petals.filter(p => p.y < H + 30 && p.x > -40 && p.x < W + 40);
    petals.forEach(p => {
      if (p.temp) { p.vy += 260 * dt; p.vx *= .99; if (p.vy > 60) p.vy = 60; }
      p.sway += dt * 2;
      p.x += (p.vx + Math.sin(p.sway) * 20) * dt;
      p.y += p.vy * dt;
      p.a += p.va * dt;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a);
      cx.fillStyle = p.hue; cx.globalAlpha = .85;
      cx.beginPath(); cx.ellipse(0, 0, p.r, p.r * .6, 0, 0, Math.PI * 2); cx.fill();
      cx.restore();
    });
    requestAnimationFrame(loop);
  }

  /* ===================== 入力 ===================== */
  window.addEventListener('keydown', e => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    keys[k] = true;
    if (e.repeat) return;
    if (modal) { if (k === 'Escape') closeModal(); return; }
    if (scene === 'start' && k === 'Enter') return startGame();
    if (scene === 'story') {
      if (k === 'Enter' || k === ' ') return advanceStory();
      if (waitingChoice && /^[1-3]$/.test(k)) { const b = $('choices').children[+k - 1]; b && b.click(); }
    }
    if (scene === 'campus' && (k === 'e' || k === 'Enter' || k === ' ')) return interact();
    if (scene === 'quiz') {
      const idx = { a: 0, b: 1, c: 2, 1: 0, 2: 1, 3: 2 }[k];
      if (idx !== undefined && !answered) return answerQuiz(idx);
      if ((k === 'Enter' || k === ' ') && answered) $('quiznext').click();
    }
  });
  window.addEventListener('keyup', e => { keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = false; });
  window.addEventListener('blur', () => Object.keys(keys).forEach(k => keys[k] = false));
  document.querySelectorAll('[data-dir]').forEach(b => {
    const dir = b.dataset.dir;
    b.addEventListener('pointerdown', e => { e.preventDefault(); keys[dir] = true; b.setPointerCapture(e.pointerId); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, () => keys[dir] = false));
  });
  window.addEventListener('pointerdown', () => Sound.wake(), { once: true });

  /* ===================== ボタン ===================== */
  $('startbtn').onclick = startGame;
  $('howbtn').onclick = () => { Sound.select(); openModal('howto'); };
  $('notebtn').onclick = () => { Sound.select(); openNotebook(); };
  $('notetitlebtn').onclick = () => { Sound.select(); openNotebook(); };
  $('endnotebtn').onclick = () => { Sound.select(); openNotebook(); };
  $('restart').onclick = () => {
    Sound.select();
    transition('start', () => { $('progress').textContent = 'KHU TO MY COUNTRY'; });
  };
  const muteIcon = () => { $('mutebtn').textContent = Store.data.muted ? '🔇' : '🔊'; };
  $('mutebtn').onclick = () => { Store.data.muted = !Store.data.muted; Store.save(); muteIcon(); Sound.select(); };

  /* ===================== 起動 ===================== */
  muteIcon();
  refreshCounts();
  resize();
  window.addEventListener('resize', () => { resize(); if (scene === 'campus') draw(); });
  requestAnimationFrame(loop);

  /* ===================== ファイルの版チェック =====================
     古いファイルが混ざっていたら、画面の上に赤い警告を出す（どのファイルが古いかも表示）。
     版を上げたときは、game.js / story.js / notes.js / index.html / style.css の5か所の '2026-11-17g' をそろえて変える。 */
  (function versionCheck() {
    const BUILD = '2026-11-17g', B = window.KHU_BUILD || {};
    const css = (getComputedStyle(document.documentElement).getPropertyValue('--khu-build') || '').replace(/['"\s]/g, '');
    const meta = (document.querySelector('meta[name="khu-build"]') || {}).content;
    const old = [];
    if (B.story !== BUILD) old.push('story.js');
    if (B.notes !== BUILD) old.push('notes.js');
    if (meta !== BUILD) old.push('index.html');
    if (css !== BUILD) old.push('style.css');
    const foot = document.querySelector('.foot');
    if (foot) { const t = document.createElement('span'); t.className = 'buildtag'; t.textContent = ' · build ' + BUILD; foot.append(t); }
    if (old.length) {
      const d = document.createElement('div'); d.id = 'buildwarn';
      d.innerHTML = '⚠ 古いファイルが混ざっています：<b>' + old.join('</b> <b>') + '</b> を最新版に入れ替えてから、Ctrl + Shift + R で再読み込みしてください。';
      document.body.prepend(d);
    }
  })();

  // 動作確認用（ブラウザのコンソールから KHUDebug.jump(5) などで使える）
  window.KHUDebug = { jump(i) { step = i; chapter = -1; showStep(); }, tp(x, y) { pos = { x, y }; draw(); }, talk() { interact(); }, next() { talk ? advanceTalk() : null; }, get scene() { return scene; } };
})();
