/* ============================================================
   知识公社 · 复习引擎 kc-srs.js (v2)
   —— 错题本 + FSRS-lite 间隔重复 + 掌握度分级 + 混测 + 每日目标/连击
   ------------------------------------------------------------
   v2 相对 v1 的升级（依据调研：Anki/FSRS、Khan 掌握度、Duolingo streak）：
     · 调度从固定阶梯改为 FSRS-lite（D/S/R 三变量，目标保持率 90%）
     · 掌握度四级：未学 / 学过 / 熟练 / 精通（由混测与稳定性共同决定）
     · 新增「随机混测」：跨页抽题，检验可迁移掌握（隔离练习 ≠ 掌握）
     · 每日复习上限（防队列雪崩）+ 连击冻结券 2 张 + 断签去羞耻化文案
   与 kc-learn.js 并存：只旁听 .qz 的答题事件，不侵入原引擎。
   页面放 <div id="kc-review"></div> 出现「今日任务」卡；右下角浮球进入复习。
   数据存 localStorage('kc:srs')，支持导出/导入 JSON。
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'kc:srs';
  var DAY = 86400000;
  var F = 19 / 81, DECAY = -0.5;             /* FSRS 遗忘曲线常量 */
  var TARGET_R = 0.9;                        /* 目标保持率（Anki 默认 90%） */
  var DAILY_CAP = 20;                        /* 每日复习上限，防雪崩 */
  var FREEZE_MAX = 2;                        /* 连击冻结券上限 */

  function pad(n) { return ('0' + n).slice(-2); }
  function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return dstr(new Date()); }
  function esc(t) { return String(t || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hash(s) { var h = 5381, i = s.length; while (i) h = (h * 33) ^ s.charCodeAt(--i); return (h >>> 0).toString(36); }
  function pageKey() { return (location.pathname.replace(/^.*\/learn\//, '') || 'index') + (location.hash || ''); }

  /* ---------- 存储 ---------- */
  function blank() { return { v: 2, items: {}, log: {}, streak: {}, daily: {}, freeze: FREEZE_MAX, freezes: FREEZE_MAX, lastSeen: '' }; }
  function load() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') s = blank();
    s.items = s.items || {}; s.log = s.log || {}; s.streak = s.streak || {}; s.daily = s.daily || {};
    if (s.v !== 2) {                                       /* v1 → v2 迁移：box 近似成稳定性 */
      var BOX = [0.5, 1, 3, 7, 21, 60];
      for (var k in s.items) {
        var it = s.items[k];
        if (it && it.box != null && it.S == null) { it.S = BOX[Math.min(it.box, 5)] || 1; it.D = 5; it.m = it.mastered ? 3 : (it.box > 0 ? 2 : 1); }
      }
      s.v = 2; s.freeze = s.freeze == null ? FREEZE_MAX : s.freeze;
    }
    if (s.freeze == null) s.freeze = FREEZE_MAX;
    return s;
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  /* ---------- FSRS-lite ---------- */
  function retrievability(t, S) { return S > 0 ? Math.pow(1 + F * t / S, DECAY) : 0; }
  function interval(S, r) { return Math.max(1, Math.round(S / F * (Math.pow(r, 1 / DECAY) - 1))); }
  function schedule(it, grade) {
    var now = Date.now();
    var dt = it.last ? (now - it.last) / DAY : 0;
    var r = it.S ? retrievability(dt, it.S) : TARGET_R;
    it.D = Math.min(10, Math.max(1, (it.D || 5) + (grade === 0 ? 1.2 : grade === 1 ? 0.6 : grade === 2 ? 0 : -0.6)));
    if (grade === 0) { it.S = Math.max(0.5, (it.S || 1) * 0.2); it.lapses = (it.lapses || 0) + 1; }
    else if (!it.S) { it.S = [0.6, 3, 8, 20][grade] || 3; }
    else { it.S *= 1 + (grade === 1 ? 0.8 : grade === 2 ? 1.0 : 1.3) * (1 + 1.5 * (1 - r)) * (11 - it.D) / 8; }
    it.reps = (it.reps || 0) + 1; it.last = now;
    it.due = now + interval(it.S, TARGET_R) * DAY;
    if (grade === 0) it.due = now + 10 * 60000;            /* 答错：10 分钟后再来（不清零） */
    /* 掌握度：练习答题最高到「熟练」，混测答对才升「精通」 */
    if (grade === 0) it.m = 1;
    else if (it.mixed) it.m = Math.max(3, (it.m || 0) >= 3 ? 4 : 3);
    else it.m = Math.min(3, Math.max(2, (it.m || 1) + 0));
    return it;
  }

  /* ---------- 记录作答 ---------- */
  function record(qz, ok, mixed) {
    var s = load();
    var qEl = qz.querySelector('.qz-q');
    var q = (qEl ? qEl.textContent : '').trim();
    if (!q) return;
    var id = hash(pageKey() + '|' + q);
    var opts = [];
    [].slice.call(qz.querySelectorAll('.qz-o')).forEach(function (b) { opts.push({ t: b.textContent.trim(), ok: b.getAttribute('data-a') === '1' }); });
    var why = qz.querySelector('.qz-why');
    var it = s.items[id] || {
      id: id, q: q, opts: opts, why: (why ? why.textContent.trim() : ''),
      page: (location.pathname.split('/').pop() || '') + (location.hash || ''),
      S: 0, D: 5, m: 0, reps: 0, lapses: 0, wrong: 0, right: 0, due: 0, created: Date.now()
    };
    if (why && !it.why) it.why = why.textContent.trim();
    if (mixed) it.mixed = true;
    if (ok) it.right = (it.right || 0) + 1; else it.wrong = (it.wrong || 0) + 1;
    schedule(it, ok ? 2 : 0);
    s.items[id] = it;
    touch(s, 1);
    save(s); paint();
  }

  function touch(s, n) {
    var d = today();
    if (s.daily.date !== d) { s.daily.date = d; s.daily.count = 0; }
    s.daily.count = (s.daily.count || 0) + n;
    s.log[d] = (s.log[d] || 0) + n;
    if (s.daily.count >= (s.daily.goal || 10)) s.streak[d] = true;
    if (s.lastSeen && s.lastSeen !== d) {                  /* 断签处理：有冻结券就补，没有就温柔重置 */
      var gap = Math.round((new Date(d) - new Date(s.lastSeen)) / DAY);
      if (gap > 1) { if (s.freeze > 0) s.freeze--; }
    }
    s.lastSeen = d;
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.qz-o') : null;
    if (!b) return;
    var qz = b.closest('.qz');
    if (!qz || qz.dataset.kcs) return;
    qz.dataset.kcs = '1';
    record(qz, b.getAttribute('data-a') === '1', qz.dataset.mixed === '1');
  }, true);

  /* ---------- 样式 ---------- */
  function style() {
    if (document.getElementById('kc-srs-style')) return;
    var st = document.createElement('style'); st.id = 'kc-srs-style';
    st.textContent = [
      '#kc-srs-fab{position:fixed;right:14px;bottom:76px;z-index:940;border:0;border-radius:999px;padding:10px 15px;',
      'background:#3d2f1e;color:#f6efe2;font-size:13px;font-weight:700;box-shadow:0 6px 18px rgba(0,0,0,.28);cursor:pointer}',
      '#kc-srs-fab.zero{background:#6f6355;opacity:.65}',
      '#kc-srs-ov{position:fixed;inset:0;z-index:1200;background:rgba(28,22,16,.72);display:none;overflow:auto;padding:18px}',
      '#kc-srs-ov.on{display:block}',
      '#kc-srs-box{max-width:640px;margin:24px auto;background:#fffdf8;border-radius:14px;padding:18px 18px 22px}',
      '#kc-srs-box h3{margin:0 0 12px;font-size:17px}',
      '.kc-srs-meta{font-size:12px;color:#8a7d6b;margin-bottom:10px}',
      '.kc-srs-o{display:block;width:100%;text-align:left;margin:7px 0;padding:11px 13px;border:1.5px solid #e6dfd0;background:#fff;border-radius:9px;font-size:14px;cursor:pointer}',
      '.kc-srs-o.ok{border-color:#4c6b4f;background:#eef6ec;font-weight:700}',
      '.kc-srs-o.no{border-color:#c0392b;background:#fdf0ee}',
      '.kc-srs-why{margin-top:10px;background:#f6f2e8;border-left:3px solid #a4884a;padding:9px 12px;border-radius:0 8px 8px 0;font-size:13px;display:none}',
      '.kc-srs-why.on{display:block}',
      '.kc-srs-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}',
      '.kc-srs-btn{border:0;border-radius:9px;padding:9px 14px;background:#9e2b25;color:#fff;font-size:13px;font-weight:700;cursor:pointer}',
      '.kc-srs-btn.ghost{background:#efe7d8;color:#4a3f33}',
      '#kc-review .kc-srs-stat{display:flex;gap:14px;flex-wrap:wrap;font-size:13px;margin:6px 0 10px}',
      '#kc-review .kc-srs-stat b{font-size:19px;display:block;color:#9e2b25}',
      '.kc-srs-tag{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;background:#efe7d8;color:#5c5344;margin-left:6px}'
    ].join('');
    document.head.appendChild(st);
  }

  /* ---------- 复习 / 混测 ---------- */
  var queue = [], qi = 0, box = null, mode = 'due';
  function dueItems(s, cap) {
    var now = Date.now(), out = [];
    for (var id in s.items) { var it = s.items[id]; if (!it.due || it.due <= now) out.push(it); }
    out.sort(function (a, b) { return (a.due || 0) - (b.due || 0); });
    return out.slice(0, cap || DAILY_CAP);
  }
  function mixedItems(s, n) {
    var all = Object.keys(s.items).map(function (k) { return s.items[k]; });
    for (var i = all.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = all[i]; all[i] = all[j]; all[j] = t; }
    return all.slice(0, n || 10);
  }
  function openReview(m) {
    style();
    var s = load();
    mode = m || 'due';
    queue = mode === 'due' ? dueItems(s) : mixedItems(s, 10);
    if (!queue.length) return;
    var ov = document.getElementById('kc-srs-ov');
    if (!ov) { ov = document.createElement('div'); ov.id = 'kc-srs-ov'; document.body.appendChild(ov); }
    ov.classList.add('on'); ov.innerHTML = '<div id="kc-srs-box"></div>';
    box = document.getElementById('kc-srs-box'); qi = 0; ask();
  }
  function closeOv() { var o = document.getElementById('kc-srs-ov'); if (o) o.classList.remove('on'); paint(); }
  function ask() {
    if (qi >= queue.length) {
      box.innerHTML = '<h3>' + (mode === 'due' ? '今天的复习做完了 🎉' : '混测结束 🎉') + '</h3>' +
        '<p class="kc-srs-meta">' + (mode === 'due'
          ? '答对的题会按你个人的记忆曲线排到后面再考你一次；今天没有到期的了，收工。'
          : '混测答对会把该题推到「精通」——隔离练习记住 ≠ 换个场景还会。') + '</p>' +
        '<div class="kc-srs-row"><button class="kc-srs-btn" id="kc-srs-close">知道了</button></div>';
      bindClose(); return;
    }
    var it = queue[qi];
    var tag = ['未学', '学过', '熟练', '精通'][it.m || 0] || '学过';
    var h = ['<h3>' + (mode === 'due' ? '复习' : '混测') + ' ' + (qi + 1) + ' / ' + queue.length + '</h3>',
      '<div class="kc-srs-meta">来源 ' + esc(it.page || '本册') + '　·　' + tag +
      '　·　答对 ' + (it.right || 0) + ' / 答错 ' + (it.wrong || 0) + (it.S ? '　·　记忆稳定性约 ' + Math.round(it.S) + ' 天' : '') + '</div>',
      '<div class="qz-q">' + esc(it.q) + '</div>'];
    it.opts.forEach(function (o, i) { h.push('<button class="kc-srs-o" data-a="' + (o.ok ? 1 : 0) + '">' + esc(o.t) + '</button>'); });
    h.push('<div class="kc-srs-why">' + esc(it.why || '') + '</div>');
    h.push('<div class="kc-srs-row"><button class="kc-srs-btn" id="kc-srs-close">先不做了</button></div>');
    box.innerHTML = h.join('');
    bindClose();
    [].slice.call(box.querySelectorAll('.kc-srs-o')).forEach(function (b) {
      b.onclick = function () {
        var ok = b.getAttribute('data-a') === '1';
        [].slice.call(box.querySelectorAll('.kc-srs-o')).forEach(function (x) { if (x.getAttribute('data-a') === '1') x.classList.add('ok'); });
        if (!ok) b.classList.add('no');
        box.querySelector('.kc-srs-why').classList.add('on');
        var s = load(), it2 = s.items[it.id];
        if (it2) {
          if (mode === 'mixed') it2.mixed = true;
          if (ok) it2.right = (it2.right || 0) + 1; else it2.wrong = (it2.wrong || 0) + 1;
          schedule(it2, ok ? 2 : 0);
          s.items[it.id] = it2; touch(s, 1); save(s);
        }
        setTimeout(function () { qi++; ask(); }, ok ? 500 : 2600);
      };
    });
  }
  function bindClose() { var c = box.querySelector('#kc-srs-close'); if (c) c.onclick = closeOv; }

  /* ---------- 今日任务卡 ---------- */
  function stats(s) {
    var due = dueItems(s, 1e9).length, wrongN = 0, total = 0, prof = 0, mast = 0;
    for (var id in s.items) { var it = s.items[id]; total++; if (it.wrong) wrongN++; if ((it.m || 0) >= 3) prof++; if ((it.m || 0) >= 4) mast++; }
    var streak = 0, d = new Date();
    while (s.streak[dstr(d)]) { streak++; d = new Date(d.getTime() - DAY); }
    var goal = s.daily.goal || 10, did = s.daily.date === today() ? (s.daily.count || 0) : 0;
    var lastDay = null;
    if (s.lastSeen && s.lastSeen !== today()) {
      var gap = Math.round((new Date(today()) - new Date(s.lastSeen)) / DAY);
      if (gap > 1) lastDay = gap;
    }
    return { due: due, wrong: wrongN, total: total, prof: prof, mast: mast, streak: streak, goal: goal, did: did, gap: lastDay };
  }
  function reviewCard() {
    var host = document.getElementById('kc-review');
    if (!host) return;
    var s = load(), st = stats(s);
    var line = '';
    if (st.gap) line = '<p class="kc-srs-meta" style="margin-top:8px">隔了 ' + st.gap + ' 天没来，进度都还在，今天接着走就行。</p>';
    host.innerHTML = '<div class="card"><h3 style="margin:0 0 6px">今天的学习任务</h3>' +
      '<div class="kc-srs-stat">' +
      '<span><b>' + st.due + '</b>待复习</span>' +
      '<span><b>' + st.did + '/' + st.goal + '</b>今日题量</span>' +
      '<span><b>' + st.streak + '</b>连续天数' + (s.freeze > 0 ? '<span class="kc-srs-tag">护身符 ' + s.freeze + '</span>' : '') + '</span>' +
      '<span><b>' + st.wrong + '</b>错题本</span>' +
      '<span><b>' + (st.prof + st.mast) + '</b>熟练以上</span>' +
      '<span><b>' + st.mast + '</b>精通</span></div>' +
      '<div class="kc-srs-row">' +
      '<button class="kc-srs-btn" id="kc-srs-go">开始今日复习' + (st.due ? '（' + Math.min(st.due, DAILY_CAP) + ' 题）' : '') + '</button>' +
      '<button class="kc-srs-btn ghost" id="kc-srs-mix">随机混测 10 题</button>' +
      '<button class="kc-srs-btn ghost" id="kc-srs-goal">每日目标：' + st.goal + ' 题</button>' +
      '<button class="kc-srs-btn ghost" id="kc-srs-exp">导出数据</button>' +
      '<button class="kc-srs-btn ghost" id="kc-srs-imp">导入数据</button>' +
      '</div>' + line +
      (st.due ? '' : '<p class="kc-srs-meta" style="margin-top:10px">现在没有到期的复习题——去做几道小测，答错的会自动进来排期。</p>') +
      '</div>';
    var g = host.querySelector('#kc-srs-go'); if (g) g.onclick = function () { openReview('due'); };
    var mx = host.querySelector('#kc-srs-mix');
    if (mx) mx.onclick = function () {
      if (!Object.keys(load().items).length) { alert('还没有错题/做过的题。先去任意课程页做几道小测。'); return; }
      openReview('mixed');
    };
    var gl = host.querySelector('#kc-srs-goal');
    if (gl) gl.onclick = function () { var v = parseInt(prompt('每天做几道题算达标？（建议 10–20）', st.goal), 10); if (v > 0) { var x = load(); x.daily.goal = v; save(x); paint(); } };
    var ex = host.querySelector('#kc-srs-exp');
    if (ex) ex.onclick = function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([localStorage.getItem(KEY) || '{}'], { type: 'application/json' }));
      a.download = 'kc-srs-' + today() + '.json'; a.click();
    };
    var im = host.querySelector('#kc-srs-imp');
    if (im) im.onclick = function () {
      var f = document.createElement('input'); f.type = 'file'; f.accept = '.json';
      f.onchange = function () {
        var r = new FileReader();
        r.onload = function () { try { JSON.parse(r.result); localStorage.setItem(KEY, r.result); paint(); alert('导入完成'); } catch (e) { alert('导入失败：文件格式不对'); } };
        r.readAsText(f.files[0]);
      }; f.click();
    };
  }

  function paint() {
    try {
      style();
      var s = load(), st = stats(s);
      var fab = document.getElementById('kc-srs-fab');
      if (!fab) {
        fab = document.createElement('button'); fab.id = 'kc-srs-fab'; fab.type = 'button';
        document.body.appendChild(fab);
        fab.onclick = function () {
          var n = stats(load()).due;
          if (!n) { alert('暂时没有到期的复习题。\n去做几道小测，答错的会自动进错题本并排期。'); return; }
          openReview('due');
        };
      }
      fab.textContent = st.due ? '🔁 待复习 ' + st.due : '🔁 复习';
      fab.classList.toggle('zero', !st.due);
      reviewCard();
    } catch (e) {}
  }

  function boot() {
    paint();
    document.addEventListener('click', function () { setTimeout(paint, 400); }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
