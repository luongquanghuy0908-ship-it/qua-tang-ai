/* Màn hình mở đầu kiểu vũ trụ + công nghệ — Trạm AI Việt. Hiện 1 lần mỗi lượt vào (sessionStorage). */
(function () {
  var KEY = "tav_intro_seen";
  try { if (sessionStorage.getItem(KEY)) return; sessionStorage.setItem(KEY, "1"); } catch (e) {}
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MONO = "'Space Mono',ui-monospace,Consolas,monospace";

  var css = document.createElement("style");
  css.textContent =
    "#tavIntro{position:fixed;inset:0;z-index:99999;background:#02040a;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:opacity .9s ease,transform .9s ease,filter .9s ease}" +
    "#tavIntro.out{opacity:0;transform:scale(1.1);filter:blur(6px);pointer-events:none}" +
    "#tavIntro canvas{position:absolute;inset:0;width:100%;height:100%}" +
    "#tavIntro .tv-box{position:relative;width:min(560px,86vw);text-align:center;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    /* logo + vòng quay */
    "#tavIntro .tv-core{position:relative;width:118px;height:118px;margin:0 auto 10px;opacity:0;animation:tavUp .9s .15s forwards}" +
    "#tavIntro .tv-core svg{position:absolute;inset:0;width:100%;height:100%}" +
    "#tavIntro .tv-r1{animation:tavSpin 9s linear infinite}" +
    "#tavIntro .tv-r2{animation:tavSpin 5s linear infinite reverse}" +
    "#tavIntro .tv-r3{animation:tavSpin 14s linear infinite}" +
    "#tavIntro .tv-logo{position:absolute;left:50%;top:50%;width:58px;height:58px;margin:-29px 0 0 -29px;filter:drop-shadow(0 0 14px rgba(255,95,10,.55));animation:tavPulse 2.2s ease-in-out infinite}" +
    /* tiêu đề */
    "#tavIntro h1{margin:0;font-size:clamp(38px,10.5vw,76px);font-weight:800;letter-spacing:-.02em;line-height:1.08;background:linear-gradient(180deg,#f5f7fb 0%,#9aa6b8 100%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0;animation:tavUp .8s .3s forwards;position:relative}" +
    "#tavIntro h1 .tv-sc{color:#00F5D4;-webkit-text-fill-color:#00F5D4;text-shadow:0 0 10px #00F5D4}" +
    "#tavIntro h1.tv-glitch{animation:tavGlitch .35s steps(2) 1}" +
    "#tavIntro .tv-sub{margin:10px 0 30px;color:#8b95a7;font-size:clamp(14px,3.6vw,18px);letter-spacing:.02em;opacity:0;animation:tavUp 1s .6s forwards}" +
    /* thanh tải */
    "#tavIntro .tv-bar{display:block;position:relative;height:2px;width:100%;padding:0;margin:0;background:rgba(255,255,255,.08);border-radius:2px;overflow:visible}" +
    "#tavIntro .tv-bar i{display:block!important;font-style:normal;height:100%;width:0;background:linear-gradient(90deg,#00F5D4,#7CFF9B);box-shadow:0 0 12px #00F5D4;position:relative}" +
    "#tavIntro .tv-bar i:after{content:'';position:absolute;right:-3px;top:-3px;width:8px;height:8px;border-radius:50%;background:#bfffee;box-shadow:0 0 14px 4px #00F5D4}" +
    "#tavIntro .tv-row{display:flex;justify-content:space-between;margin-top:12px;font:12px/1 " + MONO + ";letter-spacing:.25em;color:#6f7a8c}" +
    "#tavIntro .tv-st{margin-top:14px;min-height:14px;font:11px/1.2 " + MONO + ";letter-spacing:.12em;color:#00F5D4;opacity:.85;text-align:left}" +
    "#tavIntro .tv-st:before{content:'> ';color:#7CFF9B}" +
    "#tavIntro .tv-st i{display:inline-block;width:7px;height:12px;background:#00F5D4;margin-left:3px;vertical-align:-2px;animation:tavBlink .8s steps(1) infinite}" +
    /* khung HUD 4 góc */
    "#tavIntro .tv-c{position:absolute;width:26px;height:26px;border:2px solid rgba(0,245,212,.55);opacity:0;animation:tavUp .6s .1s forwards}" +
    "#tavIntro .tv-c.a{left:16px;top:16px;border-right:0;border-bottom:0}" +
    "#tavIntro .tv-c.b{right:16px;top:16px;border-left:0;border-bottom:0}" +
    "#tavIntro .tv-c.c{left:16px;bottom:16px;border-right:0;border-top:0}" +
    "#tavIntro .tv-c.d{right:16px;bottom:16px;border-left:0;border-top:0}" +
    "#tavIntro .tv-hud{position:absolute;font:10px/1.5 " + MONO + ";letter-spacing:.18em;color:rgba(150,170,190,.6);opacity:0;animation:tavUp .8s .5s forwards}" +
    "#tavIntro .tv-hud.l{left:52px;top:20px}" +
    "#tavIntro .tv-hud.r{right:52px;top:20px;text-align:right}" +
    "#tavIntro .tv-skip{position:absolute;right:52px;bottom:20px;background:none;border:1px solid rgba(0,245,212,.3);color:#8b95a7;border-radius:999px;padding:7px 14px;font:12px Inter,system-ui,sans-serif;cursor:pointer}" +
    "@keyframes tavUp{to{opacity:1;transform:none}}" +
    "@keyframes tavSpin{to{transform:rotate(360deg)}}" +
    "@keyframes tavPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}" +
    "@keyframes tavBlink{50%{opacity:0}}" +
    "@keyframes tavGlitch{0%{transform:translate(2px,-1px);text-shadow:-3px 0 #ff2e93,3px 0 #00F5D4}50%{transform:translate(-2px,1px);text-shadow:3px 0 #ff2e93,-3px 0 #00F5D4}100%{transform:none;text-shadow:none}}" +
    "@media (max-width:520px){#tavIntro .tv-hud{display:none}#tavIntro .tv-skip{right:22px}}" +
    "@media (prefers-reduced-motion:reduce){#tavIntro *{animation-duration:.01s!important;animation-iteration-count:1!important}}";
  document.head.appendChild(css);

  var ring = function (cls, r, dash, w, col) {
    return '<svg class="' + cls + '" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-dasharray="' + dash + '" stroke-linecap="round"/></svg>';
  };
  var el = document.createElement("div");
  el.id = "tavIntro";
  el.innerHTML =
    '<canvas></canvas>' +
    '<span class="tv-c a"></span><span class="tv-c b"></span><span class="tv-c c"></span><span class="tv-c d"></span>' +
    '<div class="tv-hud l">TRẠM AI VIỆT<br>SYS.CORE v2.6</div><div class="tv-hud r"><span class="tv-clock">00:00:00</span><br><span class="tv-hex">0x0000</span></div>' +
    '<div class="tv-box">' +
    '<div class="tv-core">' +
      ring("tv-r3", 57, "2 6", 1, "rgba(124,255,155,.45)") +
      ring("tv-r1", 50, "60 18 6 18", 2, "rgba(0,245,212,.8)") +
      ring("tv-r2", 42, "20 40", 2.5, "rgba(255,95,10,.75)") +
      '<svg class="tv-logo" viewBox="79 92 1096 1096" aria-hidden="true"><circle cx="627" cy="640" r="548" fill="#000"/><g transform="translate(0 150)" fill="#ff5f0a"><rect x="580" y="215" width="95" height="88" rx="18"/><path d="M380 325H880Q895 325 903 338L930 385Q940 410 915 410H700L920 735Q928 765 900 765H667V600H590V765H345Q318 765 328 735L555 410H335Q312 410 320 388L350 338Q358 325 380 325Z"/><path fill="#000" d="M627 510L697 560V588L660 596V765H592V596L555 588V560Z"/></g></svg>' +
    '</div>' +
    '<h1 class="tv-title">Trạm AI Việt</h1><div class="tv-sub">Bước vào thế giới AI</div>' +
    '<div class="tv-bar"><i></i></div><div class="tv-row"><span>LOADING</span><span class="tv-pc">0%</span></div>' +
    '<div class="tv-st"><span class="tv-stt">Khởi động lõi AI</span><i></i></div>' +
    '</div><button class="tv-skip" type="button">Bỏ qua</button>';
  (document.body || document.documentElement).appendChild(el);
  var html = document.documentElement, oldOv = html.style.overflow;
  html.style.overflow = "hidden";
  var $ = function (s) { return el.querySelector(s); };

  /* chữ "giải mã": ký tự ngẫu nhiên rồi hiện dần đúng chữ */
  var title = $(".tv-title"), FINAL = "Trạm AI Việt", POOL = "01<>/#$%&*+=ABCDEFXYZ";
  function scramble(ms) {
    if (reduce) return;
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min(1, (now - t0) / ms), keep = Math.floor(p * FINAL.length), out = "";
      for (var i = 0; i < FINAL.length; i++) {
        var ch = FINAL[i];
        out += (i < keep || ch === " ") ? ch.replace(/&/g, "&amp;") : '<span class="tv-sc">' + POOL[(Math.random() * POOL.length) | 0].replace("<", "&lt;").replace(">", "&gt;").replace("&", "&amp;") + "</span>";
      }
      title.innerHTML = out;
      if (p < 1 && running) requestAnimationFrame(step);
      else { title.textContent = FINAL; title.classList.add("tv-glitch"); setTimeout(function () { title.classList.remove("tv-glitch"); }, 400); }
    })(t0);
  }
  var running = true;
  setTimeout(function () { scramble(1100); }, 320);

  /* đồng hồ + mã hex nhảy */
  var clock = $(".tv-clock"), hex = $(".tv-hex"), hudTimer = setInterval(function () {
    var d = new Date(); clock.textContent = d.toTimeString().slice(0, 8) + "." + String(d.getMilliseconds()).padStart(3, "0").slice(0, 2);
    hex.textContent = "0x" + ((Math.random() * 0xffffff) | 0).toString(16).toUpperCase().padStart(6, "0");
  }, 70);

  /* dòng trạng thái kiểu máy tính */
  var STEPS = ["Khởi động lõi AI", "Kết nối máy chủ", "Nạp kho quà tặng", "Mã hoá kết nối", "Sẵn sàng"], stt = $(".tv-stt");

  /* nền: sao + tinh vân + mạng lưới nút + lưới phối cảnh + tia quét */
  var cv = $("canvas"), cx = cv.getContext("2d"), W, H, D = Math.min(2, window.devicePixelRatio || 1), stars = [], nodes = [];
  function size() {
    W = cv.width = innerWidth * D; H = cv.height = innerHeight * D;
    var n = Math.round(Math.min(800, (innerWidth * innerHeight) / 1600));
    stars = [];
    for (var i = 0; i < n; i++) {
      var near = Math.random() < 0.55, r = Math.pow(Math.random(), 0.6) * Math.min(W, H) * (near ? 0.33 : 0.9), a = Math.random() * 6.283;
      stars.push({ x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r * 0.8, s: (Math.random() * 1.2 + 0.3) * D, t: Math.random() * 6.283, v: 0.5 + Math.random() * 2, dx: (Math.random() - 0.5) * 0.06 * D, dy: (Math.random() - 0.5) * 0.06 * D });
    }
    nodes = [];
    var m = innerWidth < 520 ? 34 : 60;
    for (var j = 0; j < m; j++) nodes.push({ x: Math.random() * W, y: Math.random() * H * 0.72, vx: (Math.random() - 0.5) * 0.35 * D, vy: (Math.random() - 0.5) * 0.35 * D });
  }
  size(); addEventListener("resize", size);
  var tStart = performance.now();
  function draw(now) {
    if (!running) return;
    var t = (now - tStart) / 1000, i, j;
    cx.fillStyle = "#02040a"; cx.fillRect(0, 0, W, H);

    /* tinh vân */
    var R = Math.min(W, H) * (0.42 + 0.02 * Math.sin(t * 0.8));
    var g = cx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, R);
    g.addColorStop(0, "rgba(150,200,210,.26)"); g.addColorStop(0.35, "rgba(40,110,130,.12)"); g.addColorStop(1, "rgba(0,0,0,0)");
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);

    /* lưới phối cảnh chạy về phía người xem */
    var hz = H * 0.66, gb = H;
    cx.save();
    var fade = cx.createLinearGradient(0, hz, 0, gb);
    fade.addColorStop(0, "rgba(0,245,212,0)"); fade.addColorStop(1, "rgba(0,245,212,.35)");
    cx.strokeStyle = fade; cx.lineWidth = 1 * D;
    cx.beginPath();
    for (i = -14; i <= 14; i++) { cx.moveTo(W / 2 + i * W * 0.012, hz); cx.lineTo(W / 2 + i * W * 0.16, gb); }
    var off = reduce ? 0 : (t * 0.6) % 1;
    for (i = 0; i < 12; i++) { var z = (i + off) / 12, y = hz + (gb - hz) * z * z; cx.moveTo(0, y); cx.lineTo(W, y); }
    cx.stroke();
    cx.restore();

    /* sao lấp lánh */
    for (i = 0; i < stars.length; i++) {
      var p = stars[i];
      if (!reduce) { p.x += p.dx; p.y += p.dy; }
      cx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(p.t + t * p.v));
      cx.fillStyle = "#e6f0ff"; cx.fillRect(p.x, p.y, p.s, p.s);
    }
    cx.globalAlpha = 1;

    /* mạng lưới nút nối nhau (như mạng nơ-ron) */
    var L = 150 * D;
    for (i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H * 0.72) a.vy *= -1; }
      for (j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < L * L) { cx.strokeStyle = "rgba(0,245,212," + (0.22 * (1 - Math.sqrt(d) / L)).toFixed(3) + ")"; cx.lineWidth = D; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
      }
      cx.fillStyle = "rgba(124,255,155,.8)"; cx.beginPath(); cx.arc(a.x, a.y, 1.6 * D, 0, 6.283); cx.fill();
    }

    /* tia quét ngang */
    if (!reduce) {
      var sy = ((t * 0.35) % 1.2 - 0.1) * H;
      var sg = cx.createLinearGradient(0, sy - 40 * D, 0, sy + 2 * D);
      sg.addColorStop(0, "rgba(0,245,212,0)"); sg.addColorStop(1, "rgba(0,245,212,.12)");
      cx.fillStyle = sg; cx.fillRect(0, sy - 40 * D, W, 42 * D);
      cx.fillStyle = "rgba(160,255,235,.35)"; cx.fillRect(0, sy, W, 1 * D);
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  /* thanh tải: tối thiểu ~2,8 giây, chờ trang tải xong, tối đa 6 giây */
  var bar = $(".tv-bar i"), pc = $(".tv-pc"), loaded = document.readyState === "complete", t1 = performance.now(), MIN = reduce ? 600 : 2800, done = false;
  addEventListener("load", function () { loaded = true; });
  function tick() {
    if (done) return;
    var e = performance.now() - t1, p = Math.min(1, e / MIN);
    p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    if (!loaded && e < 6000) p = Math.min(p, 0.92);
    var k = Math.round(p * 100);
    bar.style.width = k + "%"; pc.textContent = k + "%";
    stt.textContent = STEPS[Math.min(STEPS.length - 1, Math.floor(p * (STEPS.length - 1) + 0.0001))];
    if (p >= 1) { finish(500); return; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  function finish(delay) {
    if (done) return; done = true;
    bar.style.width = "100%"; pc.textContent = "100%"; stt.textContent = STEPS[STEPS.length - 1];
    setTimeout(function () {
      el.classList.add("out"); html.style.overflow = oldOv;
      setTimeout(function () { running = false; clearInterval(hudTimer); el.remove(); }, 950);
    }, delay);
  }
  $(".tv-skip").onclick = function () { finish(0); };
  setTimeout(function () { finish(0); }, 8000);
})();
