/* Nền "thành phố công nghệ tương lai" cho Kho quà — Trạm AI Việt. Gọi TavCity.start() khi mở kho quà. */
(function () {
  var started = false;
  function start() {
    if (started) return; started = true;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas");
    cv.id = "tavCity"; cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity 1.2s ease";
    document.body.appendChild(cv);
    document.body.classList.add("city-on");
    requestAnimationFrame(function () { cv.style.opacity = "1"; });

    var cx = cv.getContext("2d"), D = Math.min(2, window.devicePixelRatio || 1), W, H, layers = [], stars = [], cars = [], beacons = [];
    var PAL = ["#00F5D4", "#7C5CFF", "#FF2E93", "#38BDF8", "#7CFF9B"];
    function rnd(a, b) { return a + Math.random() * (b - a); }

    /* vẽ sẵn 3 lớp nhà (xa → gần) vào canvas phụ để chạy nhẹ */
    function buildLayer(k) {
      var c = document.createElement("canvas"); c.width = W; c.height = H;
      var g = c.getContext("2d"), base = H * (0.98), x = -20 * D, wins = [];
      var hMin = [0.18, 0.24, 0.30][k], hMax = [0.42, 0.52, 0.62][k], wMin = [26, 36, 48][k] * D, wMax = [60, 80, 110][k] * D;
      var body = ["#0b1530", "#0a1228", "#070d1f"][k], light = [0.35, 0.55, 0.8][k];
      while (x < W + 20 * D) {
        var w = rnd(wMin, wMax), h = H * rnd(hMin, hMax), top = base - h, col = PAL[(Math.random() * PAL.length) | 0];
        /* thân nhà */
        var grd = g.createLinearGradient(0, top, 0, base);
        grd.addColorStop(0, body); grd.addColorStop(1, "#04070f");
        g.fillStyle = grd; g.fillRect(x, top, w, h);
        /* mái kiểu khác nhau */
        var roof = Math.random();
        if (roof < 0.3) { g.beginPath(); g.moveTo(x, top); g.lineTo(x + w / 2, top - w * 0.35); g.lineTo(x + w, top); g.fill(); }
        else if (roof < 0.55) { g.fillRect(x + w * 0.3, top - h * 0.08, w * 0.4, h * 0.08); }
        /* viền neon */
        g.globalAlpha = 0.55 * light; g.strokeStyle = col; g.lineWidth = 1.2 * D;
        g.beginPath(); g.moveTo(x, base); g.lineTo(x, top); g.lineTo(x + w, top); g.lineTo(x + w, base); g.stroke();
        g.globalAlpha = 1;
        /* dải đèn hologram */
        if (Math.random() < 0.35) { g.globalAlpha = 0.5 * light; g.fillStyle = col; g.fillRect(x + 2 * D, top + h * rnd(0.12, 0.4), w - 4 * D, 2 * D); g.globalAlpha = 1; }
        /* cửa sổ */
        var cw = 3 * D, ch = 4 * D, gx = 7 * D, gy = 9 * D;
        for (var yy = top + 10 * D; yy < base - 12 * D; yy += gy)
          for (var xx = x + 5 * D; xx < x + w - 6 * D; xx += gx)
            if (Math.random() < 0.38) {
              var wc = Math.random() < 0.75 ? "rgba(255,214,140," : (Math.random() < 0.5 ? "rgba(0,245,212," : "rgba(124,92,255,");
              var a = rnd(0.35, 0.95) * light;
              g.fillStyle = wc + a.toFixed(2) + ")"; g.fillRect(xx, yy, cw, ch);
              if (Math.random() < 0.05) wins.push({ x: xx, y: yy, w: cw, h: ch, c: wc, a: a, p: rnd(0, 6.28), s: rnd(0.5, 2) });
            }
        /* ăng-ten nhấp nháy */
        if (k > 0 && Math.random() < 0.3) {
          g.strokeStyle = "rgba(160,180,210,.5)"; g.lineWidth = D; g.beginPath(); g.moveTo(x + w / 2, top); g.lineTo(x + w / 2, top - 22 * D); g.stroke();
          beacons.push({ x: x + w / 2, y: top - 22 * D, p: rnd(0, 6.28), layer: k });
        }
        x += w + rnd(2, 14) * D;
      }
      return { c: c, wins: wins };
    }
    function size() {
      W = cv.width = Math.round(innerWidth * D); H = cv.height = Math.round(innerHeight * D);
      beacons = []; layers = [buildLayer(0), buildLayer(1), buildLayer(2)];
      stars = []; for (var i = 0; i < 140; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.55, s: rnd(0.4, 1.4) * D, p: rnd(0, 6.28) });
      cars = []; for (var j = 0; j < (innerWidth < 600 ? 7 : 14); j++) cars.push(newCar(true));
    }
    function newCar(any) {
      var dir = Math.random() < 0.5 ? 1 : -1;
      return { x: any ? Math.random() * W : (dir > 0 ? -60 * D : W + 60 * D), y: H * rnd(0.22, 0.62), v: rnd(1.2, 3.6) * D * dir, c: PAL[(Math.random() * PAL.length) | 0], len: rnd(30, 90) * D };
    }
    size();
    var rz; addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(size, 200); });

    var last = 0, t0 = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden || now - last < 33) return; last = now;
      var t = (now - t0) / 1000, i, sc = Math.min(1, (window.scrollY || 0) / 1400);

      /* bầu trời */
      var sky = cx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#050816"); sky.addColorStop(0.55, "#0b1033"); sky.addColorStop(0.8, "#2a1250"); sky.addColorStop(1, "#05070f");
      cx.fillStyle = sky; cx.fillRect(0, 0, W, H);
      /* quầng sáng chân trời */
      var halo = cx.createRadialGradient(W * 0.5, H * 0.78, 0, W * 0.5, H * 0.78, W * 0.6);
      halo.addColorStop(0, "rgba(255,46,147,.28)"); halo.addColorStop(0.4, "rgba(124,92,255,.14)"); halo.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = halo; cx.fillRect(0, 0, W, H);
      /* sao */
      for (i = 0; i < stars.length; i++) { var s = stars[i]; cx.globalAlpha = 0.3 + 0.6 * Math.abs(Math.sin(s.p + t * 0.8)); cx.fillStyle = "#dbe7ff"; cx.fillRect(s.x, s.y, s.s, s.s); }
      cx.globalAlpha = 1;

      /* các lớp nhà, trượt nhẹ theo cuộn trang */
      for (var k = 0; k < 3; k++) {
        var L = layers[k], dy = sc * H * [0.02, 0.05, 0.09][k];
        cx.drawImage(L.c, 0, dy);
        if (!reduce) for (i = 0; i < L.wins.length; i++) {
          var w = L.wins[i], on = Math.sin(w.p + t * w.s) > 0.2;
          cx.fillStyle = on ? w.c + Math.min(1, w.a + 0.3).toFixed(2) + ")" : "rgba(4,7,15,.9)";
          cx.fillRect(w.x, w.y + dy, w.w, w.h);
        }
        /* xe bay chạy giữa các lớp */
        if (k === 1 && !reduce) for (i = 0; i < cars.length; i++) {
          var c = cars[i]; c.x += c.v;
          if (c.x < -120 * D || c.x > W + 120 * D) { cars[i] = newCar(false); continue; }
          var tail = cx.createLinearGradient(c.x, 0, c.x - c.len * Math.sign(c.v), 0);
          tail.addColorStop(0, c.c); tail.addColorStop(1, "rgba(0,0,0,0)");
          cx.strokeStyle = tail; cx.lineWidth = 2 * D; cx.beginPath(); cx.moveTo(c.x, c.y); cx.lineTo(c.x - c.len * Math.sign(c.v), c.y); cx.stroke();
          cx.fillStyle = "#fff"; cx.fillRect(c.x - D, c.y - D, 2.5 * D, 2.5 * D);
        }
      }
      /* đèn đỏ đỉnh ăng-ten */
      for (i = 0; i < beacons.length; i++) {
        var b = beacons[i], a = 0.5 + 0.5 * Math.sin(b.p + t * 3);
        cx.fillStyle = "rgba(255,60,80," + a.toFixed(2) + ")"; cx.beginPath(); cx.arc(b.x, b.y + sc * H * [0.02, 0.05, 0.09][b.layer], 2.2 * D, 0, 6.28); cx.fill();
      }
      /* sàn lưới neon */
      var hz = H * 0.97;
      cx.strokeStyle = "rgba(0,245,212,.35)"; cx.lineWidth = D; cx.beginPath();
      for (i = -20; i <= 20; i++) { cx.moveTo(W / 2 + i * W * 0.01, hz); cx.lineTo(W / 2 + i * W * 0.12, H); }
      cx.stroke();

      /* lớp tối phủ lên để chữ dễ đọc */
      var shade = cx.createLinearGradient(0, 0, 0, H);
      shade.addColorStop(0, "rgba(5,8,22,.55)"); shade.addColorStop(0.5, "rgba(5,8,22,.45)"); shade.addColorStop(1, "rgba(5,8,22,.25)");
      cx.fillStyle = shade; cx.fillRect(0, 0, W, H);
    }
    requestAnimationFrame(frame);
  }
  window.TavCity2D = { start: start };
})();
