/* 知识公社 · 「安装到桌面」引导（PWA）
   仅当：未安装 && 浏览器支持安装 && 用户未关闭过 → 显示轻量入口。
   安装后获得：独立图标 / 全屏无浏览器栏 / 完全离线可用。 */
(function () {
  var root = document.documentElement;
  var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;
  if (isStandalone) return;
  try { if (localStorage.getItem('kc-install-off') === '1') return; } catch (e) {}

  var deferred = null;
  var bar = null;

  function css() {
    if (document.getElementById('kc-ip-style')) return;
    var st = document.createElement('style');
    st.id = 'kc-ip-style';
    st.textContent = [
      '#kc-ip{position:fixed;z-index:9999;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));',
      'max-width:min(320px,calc(100vw - 28px));background:#fffdf8;border:1.5px solid #9e2b25;border-radius:10px;',
      'box-shadow:0 6px 22px rgba(60,40,20,.18);padding:12px 14px;font:14px/1.7 "Songti SC","Noto Serif CJK SC",serif;color:#2b2620;',
      'animation:kc-ip-in .25s ease}',
      '@keyframes kc-ip-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
      '#kc-ip .kc-t{font-weight:700;color:#7c1f1a;letter-spacing:1px}',
      '#kc-ip .kc-d{color:#7c7466;font-size:12.5px;margin-top:2px}',
      '#kc-ip .kc-row{display:flex;gap:8px;margin-top:10px}',
      '#kc-ip button{border:1.5px solid #9e2b25;background:#9e2b25;color:#fdf6ea;border-radius:7px;padding:7px 14px;font-size:13.5px;font-family:inherit;cursor:pointer}',
      '#kc-ip button.ghost{background:transparent;color:#7c1f1a}',
      '#kc-ip .kc-x{position:absolute;top:6px;right:8px;border:none;background:transparent;color:#9a927f;font-size:16px;padding:2px 6px;cursor:pointer}'
    ].join('');
    document.head.appendChild(st);
  }

  function show(mode) {
    if (bar || !document.body) { if (!document.body) document.addEventListener('DOMContentLoaded', function () { show(mode); }); return; }
    css();
    bar = document.createElement('div');
    bar.id = 'kc-ip';
    var t = mode === 'ios' ? '安装「知识公社」到主屏幕' : '安装「知识公社」到桌面';
    var d = mode === 'ios'
      ? '点下方分享按钮 <b>⤴</b> ，选「添加到主屏幕」——即成独立应用，全屏、可离线。'
      : '安装后：独立图标、全屏阅读、完全离线可用。';
    bar.innerHTML = '<button class="kc-x" aria-label="关闭">✕</button>' +
      '<div class="kc-t">' + t + '</div><div class="kc-d">' + d + '</div>' +
      '<div class="kc-row"><button class="kc-go">' + (mode === 'ios' ? '知道了' : '立即安装') + '</button>' +
      '<button class="kc-no ghost">不再提示</button></div>';
    document.body.appendChild(bar);
    bar.querySelector('.kc-x').onclick = close;
    bar.querySelector('.kc-no').onclick = function () { off(); };
    bar.querySelector('.kc-go').onclick = function () {
      if (mode === 'ios' || !deferred) { close(); return; }
      deferred.prompt();
      deferred.userChoice && deferred.userChoice.then(function () { off(); });
    };
  }
  function close() { if (bar) { bar.remove(); bar = null; } }
  function off() { try { localStorage.setItem('kc-install-off', '1'); } catch (e) {} close(); }
  function later() { close(); show2(); }
  function show2() { /* 占位：保持结构简单 */ }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    show('chrome');
  });

  /* iOS Safari：无安装事件，延迟 4s 温和提示一次 */
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var isSafari = isIOS && /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  if (isIOS && isSafari) {
    setTimeout(function () { show('ios'); }, 4000);
  }
})();
