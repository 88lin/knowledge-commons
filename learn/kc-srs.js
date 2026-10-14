/* ============================================================
   知识公社 · 复习引擎 kc-srs.js（v1）
   —— 补上"学过没学过"之外的那一环：错题本 + 间隔重复 + 每日目标
   ------------------------------------------------------------
   与 kc-learn.js 并存（不侵入原引擎，只旁听 .qz 的答题事件）：
     · 任何页面的 .qz 小测，答错自动进错题本
     · 按 1-3-7-21-60 天间隔安排复习，到期自动出现在「今日复习」
     · 页面任意位置放 <div id="kc-review"></div> 即出现「今日任务」卡
     · 右下角浮球显示待复习数；点开可逐题复习
   数据全在本机 localStorage('kc:srs')，无后端；支持导出/导入 JSON。
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'kc:srs';
  var BOXES = [0, 1, 3, 7, 21, 60];          /* 第 n 次答对后，隔多少天再复习 */
  var DAY = 86400000;

  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (!v || typeof v !== 'object') v = {};
      v.items = v.items || {}; v.log = v.log || {}; v.streak = v.streak || {}; v.daily = v.daily || {};
      return v;
    } catch (e) { return { items: {}, log: {}, streak: {}, daily: {} }; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  function hash(str) {
    var h = 5381, i = str.length;
    while (i) h = (h * 33) ^ str.charCodeAt(--i);
    return (h >>> 0).toString(36);
  }
  function esc(t) { return String(t || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pageKey() { return (location.pathname.replace(/^.*\/learn\//, '') || 'index') + (location.hash || ''); }
  function dueItems(s, limit) {
    var now = Date.now(), out = [];
    for (var id in s.items) { var it = s.items[id]; if (!it.due || it.due <= now) out.push(it); }
    out.sort(function (a, b) { return (a.due || 0) - (b.due || 0); });
    return limit ? out.slice(0, limit) : out;
  }

  /* ---------- 记录作答 ---------- */
  function record(qz, ok) {
    var s = load();
    var qEl = qz.querySelector('.qz-q');
    var q = (qEl ? qEl.textContent : '').trim();
    if (!q) return;
    var id = hash(pageKey() + '|' + q);
    var opts = [];
    [].slice.call(qz.querySelectorAll('.qz-o')).forEach(function (b) {
      opts.push({ t: b.textContent.trim(), ok: b.getAttribute('data-a') === '1' });
    });
    var why = qz.querySelector('.qz-why');
    var it = s.items[id] || {
      id: id, q: q, opts: opts, why: why ? why.textContent.trim() : '',
      page: location.pathname.split('/').pop() + (location.hash || ''),
      box: 0, due: 0, seen: 0, wrong: 0, right: 0, created: Date.now()
    };
    it.seen++;
    if (ok) {
      it.right++;
      it.box = Math.min(it.box + 1, BOXES.length - 1);
      it.due = Date.now() + BOXES[it.box] * DAY;
      if (it.box >= BOXES.length - 1) it.mastered = true;
    } else {
      it.wrong++; it.box = 0; it.mastered = false;
      it.due = Date.now() + 10 * 60000;               /* 10 分钟后再来一次 */
      it.lastWhy = why ? why.textContent.trim() : '';
    }
    it.last = Date.now();
    s.items[id] = it;
    var d = today();
    s.log[d] = (s.log[d] || 0) + 1;
    s.daily.date = d;
    if (s.daily.date !== d) { s.daily.count = 0; s.daily.date = d; }
    s.daily.count = (s.daily.count || 0) + 1;
    if (s.daily.count >= (s.daily.goal || 10)) { s.streak[today()] = true; }
    save(s);
    paint();
  }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.qz-o') : null;
    if (!b) return;
    var qz = b.closest('.qz');
    if (!qz) return;
    if (qz.dataset.kcs) return;                        /* 每题每页只记一次 */
    qz.dataset.kcs = '1';
    record(qz, b.getAttribute('data-a') === '1');
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
      '.kc-srs-o{display:block;width:100%;text-align:left;margin:7px 0;padding:11px 13px;border:1.5px solid #e6dfd0;',
      'background:#fff;border-radius:9px;font-size:14px;cursor:pointer}',
      '.kc-srs-o.ok{border-color:#4c6b4f;background:#eef6ec;font-weight:700}',
      '.kc-srs-o.no{border-color:#c0392b;background:#fdf0ee}',
      '.kc-srs-why{margin-top:10px;background:#f6f2e8;border-left:3px solid #a4884a;padding:9px 12px;border-radius:0 8px 8px 0;font-size:13px;display:none}',
      '.kc-srs-why.on{display:block}',
      '.kc-srs-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}',
      '.kc-srs-btn{border:0;border-radius:9px;padding:9px 14px;background:#9e2b25;color:#fff;font-size:13px;font-weight:700;cursor:pointer}',
      '.kc-srs-btn.ghost{background:#efe7d8;color:#4a3f33}',
      '#kc-review .kc-srs-stat{display:flex;gap:14px;flex-wrap:wrap;font-size:13px;margin:6px 0 10px}',
      '#kc-review .kc-srs-stat b{font-size:19px;display:block;color:#9e2b25}'
    ].join('');
    document.head.appendChild(st);
  }

  /* ---------- 复习面板 ---------- */
  var queue = [], qi = 0, box = null;
  function openReview() {
    style();
    var s = load();
    queue = dueItems(s, 20); qi = 0;
    if (!queue.length) { return; }
    var ov = document.getElementById('kc-srs-ov');
    if (!ov) { ov = document.createElement('div'); ov.id = 'kc-srs-ov'; document.body.appendChild(ov); }
    ov.classList.add('on'); ov.innerHTML = '<div id="kc-srs-box"></div>';
    box = document.getElementById('kc-srs-box');
    ask();
  }
  function ask() {
    if (qi >= queue.length) {
      box.innerHTML = '<h3>这一轮复习完了 🎉</h3><p class="kc-srs-meta">答对的题会按 1-3-7-21-60 天自动排到后面再考你一次。</p>' +
        '<div class="kc-srs-row"><button class="kc-srs-btn" id="kc-srs-close">知道了</button></div>';
      bindClose(); return;
    }
    var it = queue[qi];
    var h = ['<h3>复习 ' + (qi + 1) + ' / ' + queue.length + '</h3>',
      '<div class="kc-srs-meta">来源：' + esc(it.page || '本册') + '　·　累计答错 ' + (it.wrong || 0) + ' 次</div>',
      '<div class="qz-q">' + esc(it.q) + '</div>'];
    it.opts.forEach(function (o, i) { h.push('<button class="kc-srs-o" data-i="' + i + '" data-a="' + (o.ok ? 1 : 0) + '">' + esc(o.t) + '</button>'); });
    h.push('<div class="kc-srs-why">' + esc(it.why || '') + '</div>');
    h.push('<div class="kc-srs-row"><button class="kc-srs-btn" id="kc-srs-close">先不复习了</button></div>');
    box.innerHTML = h.join('');
    bindClose();
    [].slice.call(box.querySelectorAll('.kc-srs-o')).forEach(function (b) {
      b.onclick = function () {
        var ok = b.getAttribute('data-a') === '1';
        [].slice.call(box.querySelectorAll('.kc-srs-o')).forEach(function (x) { if (x.getAttribute('data-a') === '1') x.classList.add('ok'); });
        if (!ok) b.classList.add('no');
        box.querySelector('.kc-srs-why').classList.add('on');
        var s = load(); var it2 = s.items[it.id];
        if (it2) {
          if (ok) { it2.box = Math.min((it2.box || 0) + 1, BOXES.length - 1); it2.due = Date.now() + BOXES[it2.box] * DAY; it2.right = (it2.right || 0) + 1; }
          else { it2.box = 0; it2.wrong = (it2.wrong || 0) + 1; it2.due = Date.now() + 10 * 60000; }
          it2.last = Date.now(); s.items[it.id] = it2;
          var d = today(); s.log[d] = (s.log[d] || 0) + 1; s.daily.date = d; s.daily.count = (s.daily.count || 0) + 1;
          if (s.daily.count >= (s.daily.goal || 10)) s.streak[d] = true;
          save(s);
        }
        setTimeout(function () { qi++; ask(); }, ok ? 500 : 2600);
      };
    });
  }
  function bindClose() {
    var c = box.querySelector('#kc-srs-close');
    if (c) c.onclick = function () { document.getElementById('kc-srs-ov').classList.remove('on'); paint(); };
  }

  /* ---------- 今日任务卡 ---------- */
  function reviewCard() {
    var host = document.getElementById('kc-review');
    if (!host) return;
    var s = load(), due = dueItems(s).length;
    var wrongN = 0, total = 0, mastered = 0;
    for (var id in s.items) { total++; if (s.items[id].wrong) wrongN++; if (s.items[id].mastered) mastered++; }
    var streak = 0, d = new Date();
    while (s.streak[fmt(d)]) { streak++; d = new Date(d.getTime() - DAY); }
    var goal = s.daily.goal || 10, did = s.daily.date === today() ? (s.daily.count || 0) : 0;
    host.innerHTML = '<div class="card"><h3 style="margin:0 0 6px">今天的学习任务</h3>' +
      '<div class="kc-srs-stat">' +
      '<span><b>' + due + '</b>待复习</span>' +
      '<span><b>' + did + '/' + goal + '</b>今日题量</span>' +
      '<span><b>' + streak + '</b>连续天数</span>' +
      '<span><b>' + wrongN + '</b>错题本</span>' +
      '<span><b>' + mastered + '</b>已掌握</span></div>' +
      '<div class="kc-srs-row">' +
      '<button class="kc-srs-btn" id="kc-srs-go">开始今日复习' + (due ? '（' + due + ' 题）' : '') + '</button>' +
      '<button class="kc-srs-btn ghost" id="kc-srs-goal">每日目标：' + goal + ' 题</button>' +
      '<button class="kc-srs-btn ghost" id="kc-srs-exp">导出数据</button>' +
      '<button class="kc-srs-btn ghost" id="kc-srs-imp">导入数据</button>' +
      '</div>' +
      (due ? '' : '<p class="kc-srs-meta" style="margin-top:10px">当前没有到期复习题。往下做题，答错的会自动进来。</p>') +
      '</div>';
    var g = host.querySelector('#kc-srs-go'); if (g) g.onclick = openReview;
    var gl = host.querySelector('#kc-srs-goal');
    if (gl) gl.onclick = function () {
      var v = prompt('每天做几道题算达标？（建议 10–20）', goal);
      v = parseInt(v, 10); if (v > 0) { var st = load(); st.daily.goal = v; save(st); paint(); }
    };
    var ex = host.querySelector('#kc-srs-exp');
    if (ex) ex.onclick = function () {
      var data = localStorage.getItem(KEY) || '{}';
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      a.download = 'kc-srs-' + today() + '.json'; a.click();
    };
    var im = host.querySelector('#kc-srs-imp');
    if (im) im.onclick = function () {
      var f = document.createElement('input'); f.type = 'file'; f.accept = '.json';
      f.onchange = function () {
        var r = new FileReader();
        r.onload = function () { try { localStorage.setItem(KEY, JSON.parse(r.result) ? r.result : '{}'); paint(); alert('导入完成'); } catch (e) { alert('导入失败：文件格式不对'); } };
        r.readAsText(f.files[0]);
      };
      f.click();
    };
  }
  function fmt(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

  function paint() {
    style();
    var s = load(), due = dueItems(s).length;
    var fab = document.getElementById('kc-srs-fab');
    if (!fab) {
      fab = document.createElement('button'); fab.id = 'kc-srs-fab'; fab.type = 'button';
      document.body.appendChild(fab);
      fab.onclick = function () {
        if (!dueItems(load()).length) { alert('暂时没有到期的复习题。\n去做几道小测，答错的会自动进错题本。'); return; }
        openReview();
      };
    }
    fab.textContent = due ? '🔁 待复习 ' + due : '🔁 复习';
    fab.classList.toggle('zero', !due);
    reviewCard();
  }

  function boot() {
    try { paint(); } catch (e) {}
    /* 新答的题立即更新计数 */
    document.addEventListener('click', function () { setTimeout(function () { try { paint(); } catch (e) {} }, 400); }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
