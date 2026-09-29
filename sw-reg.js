/* 知识公社 · Service Worker 注册器
   自定位：sw.js 与本脚本同目录（仓库根），任何深度的页面均可引用本文件。 */
(function () {
  if (!('serviceWorker' in navigator)) return;
  var s = document.currentScript;
  if (!s) {
    var all = document.getElementsByTagName('script');
    s = all[all.length - 1];
  }
  if (!s || !s.src) return;
  var swUrl;
  try { swUrl = new URL('sw.js', s.src).href; } catch (e) { return; }
  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl).catch(function () { /* 静默：SW 不可用不影响阅读 */ });
  });
})();
