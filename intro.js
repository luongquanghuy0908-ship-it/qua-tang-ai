/* Màn hình mở đầu kiểu vũ trụ — Trạm AI Việt. Hiện 1 lần mỗi lượt vào (sessionStorage). */
(function () {
  var KEY = "tav_intro_seen";
  try { if (sessionStorage.getItem(KEY)) return; sessionStorage.setItem(KEY, "1"); } catch (e) {}
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = document.createElement("style");
  css.textContent =
    "#tavIntro{position:fixed;inset:0;z-index:99999;background:#02040a;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:opacity .9s ease,transform .9s ease}" +
    "#tavIntro.out{opacity:0;transform:scale(1.08);pointer-events:none}" +
    "#tavIntro canvas{position:absolute;inset:0;width:100%;height:100%}" +
    "#tavIntro .tv-box{position:relative;width:min(560px,86vw);text-align:center;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    "#tavIntro .tv-logo{width:62px;height:62px;margin:0 auto 14px;opacity:0;transform:translateY(10px);animation:tavUp .9s .2s forwards}" +
    "#tavIntro h1{margin:0;font-size:clamp(40px,11vw,78px);font-weight:800;letter-spacing:-.02em;line-height:1.05;background:linear-gradient(180deg,#f5f7fb 0%,#9aa6b8 100%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0;transform:translateY(14px);animation:tavUp 1s .35s forwards}" +
    "#tavIntro .tv-sub{margin:10px 0 34px;color:#8b95a7;font-size:clamp(14px,3.6vw,18px);letter-spacing:.02em;opacity:0;animation:tavUp 1s .6s forwards}" +
    "#tavIntro .tv-bar{display:block;height:2px;width:100%;padding:0;margin:0;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden}" +
    "#tavIntro .tv-bar i{display:block!important;font-style:normal;height:100%;width:0;background:linear-gradient(90deg,#00F5D4,#7CFF9B);box-shadow:0 0 12px #00F5D4}" +
    "#tavIntro .tv-row{display:flex;justify-content:space-between;margin-top:12px;font:12px/1 'Space Mono',ui-monospace,Consolas,monospace;letter-spacing:.25em;color:#6f7a8c}" +
    "#tavIntro .tv-skip{position:absolute;right:18px;bottom:18px;background:none;border:1px solid rgba(255,255,255,.15);color:#8b95a7;border-radius:999px;padding:7px 14px;font:12px Inter,system-ui,sans-serif;cursor:pointer}" +
    "@keyframes tavUp{to{opacity:1;transform:none}}";
  document.head.appendChild(css);

  var el = document.createElement("div");
  el.id = "tavIntro";
  el.innerHTML =
    '<canvas></canvas><div class="tv-box">' +
    '<svg class="tv-logo" viewBox="79 92 1096 1096" aria-hidden="true"><circle cx="627" cy="640" r="548" fill="#000" stroke="rgba(0,245,212,.35)" stroke-width="10"/><g transform="translate(0 150)" fill="#ff5f0a"><rect x="580" y="215" width="95" height="88" rx="18"/><path d="M380 325H880Q895 325 903 338L930 385Q940 410 915 410H700L920 735Q928 765 900 765H667V600H590V765H345Q318 765 328 735L555 410H335Q312 410 320 388L350 338Q358 325 380 325Z"/><path fill="#000" d="M627 510L697 560V588L660 596V765H592V596L555 588V560Z"/></g></svg>' +
    '<h1>Trạm AI Việt</h1><div class="tv-sub">Bước vào thế giới AI</div>' +
    '<div class="tv-bar"><i></i></div><div class="tv-row"><span>LOADING</span><span class="tv-pc">0%</span></div>' +
    '</div><button class="tv-skip" type="button">Bỏ qua</button>';
  (document.body || document.documentElement).appendChild(el);
  var html = document.documentElement, oldOv = html.style.overflow;
  html.style.overflow = "hidden";

  /* nền sao + tinh vân */
  var cv = el.querySelector("canvas"), cx = cv.getContext("2d"), W, H, D = Math.min(2, window.devicePixelRatio || 1), stars = [], run = true;
  function size() {
    W = cv.width = innerWidth * D; H = cv.height = innerHeight * D;
    var n = Math.round(Math.min(900, (innerWidth * innerHeight) / 1400));
    stars = [];
    for (var i = 0; i < n; i++) {
      var near = Math.random() < 0.55, r = Math.pow(Math.random(), 0.6) * Math.min(W, H) * (near ? 0.33 : 0.9), a = Math.random() * 6.283;
      stars.push({ x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r * 0.8, s: (Math.random() * 1.2 + 0.3) * D, t: Math.random() * 6.283, v: 0.5 + Math.random() * 2, dx: (Math.random() - 0.5) * 0.06 * D, dy: (Math.random() - 0.5) * 0.06 * D });
    }
  }
  size(); addEventListener("resize", size);
  var t0 = performance.now();
  function draw(now) {
    if (!run) return;
    var t = (now - t0) / 1000;
    cx.fillStyle = "#02040a"; cx.fillRect(0, 0, W, H);
    var R = Math.min(W, H) * (0.42 + 0.02 * Math.sin(t * 0.8));
    var g = cx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, R);
    g.addColorStop(0, "rgba(170,190,200,.28)"); g.addColorStop(0.35, "rgba(70,110,130,.12)"); g.addColorStop(1, "rgba(0,0,0,0)");
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var p = stars[i];
      if (!reduce) { p.x += p.dx; p.y += p.dy; }
      var al = 0.35 + 0.65 * Math.abs(Math.sin(p.t + t * p.v));
      cx.globalAlpha = al; cx.fillStyle = "#e6f0ff";
      cx.fillRect(p.x, p.y, p.s, p.s);
    }
    cx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  /* thanh tải: chạy theo thời gian, chờ trang tải xong, tối thiểu ~2 giây, tối đa 5 giây */
  var bar = el.querySelector(".tv-bar i"), pc = el.querySelector(".tv-pc"), loaded = document.readyState === "complete", start = performance.now(), MIN = reduce ? 500 : 2100, done = false;
  addEventListener("load", function () { loaded = true; });
  function tick() {
    if (done) return;
    var e = performance.now() - start, p = Math.min(1, e / MIN);
    if (!loaded && e < 5000) p = Math.min(p, 0.9);
    var k = Math.round(p * 100);
    bar.style.width = k + "%"; pc.textContent = k + "%";
    if (p >= 1) { finish(450); return; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  function finish(delay) {
    if (done) return; done = true;
    bar.style.width = "100%"; pc.textContent = "100%";
    setTimeout(function () {
      el.classList.add("out"); html.style.overflow = oldOv;
      setTimeout(function () { run = false; el.remove(); }, 950);
    }, delay);
  }
  el.querySelector(".tv-skip").onclick = function () { finish(0); };
  setTimeout(function () { finish(0); }, 7000);
})();
