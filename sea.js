/* Nền đáy biển dịu mắt cho Kho quà — Trạm AI Việt. Chuyển động rất chậm, màu trầm, 20fps. */
(function () {
  var started = false;
  function start() {
    if (started) return; started = true;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas");
    cv.id = "tavSea"; cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity 1.6s ease";
    document.body.appendChild(cv);
    document.body.classList.add("sea-on");
    requestAnimationFrame(function () { cv.style.opacity = "1"; });

    var cx = cv.getContext("2d"), W, H, D = Math.min(1.5, window.devicePixelRatio || 1);
    var small = innerWidth < 700, rays = [], bubbles = [], fish = [], jelly = [], weeds = [], motes = [];
    function rnd(a, b) { return a + Math.random() * (b - a); }

    function size() {
      W = cv.width = Math.round(innerWidth * D); H = cv.height = Math.round(innerHeight * D);
      rays = []; for (var i = 0; i < (small ? 4 : 6); i++) rays.push({ x: rnd(0.05, 0.95) * W, w: rnd(0.08, 0.18) * W, a: rnd(0.035, 0.07), p: rnd(0, 6.28), s: rnd(0.04, 0.09) });
      bubbles = []; for (i = 0; i < (small ? 16 : 28); i++) bubbles.push({ x: Math.random() * W, y: Math.random() * H, r: rnd(1.5, 4.5) * D, v: rnd(5, 14) * D, p: rnd(0, 6.28) });
      motes = []; for (i = 0; i < (small ? 40 : 80); i++) motes.push({ x: Math.random() * W, y: Math.random() * H, r: rnd(0.5, 1.4) * D, p: rnd(0, 6.28) });
      fish = []; for (i = 0; i < (small ? 5 : 9); i++) fish.push(newFish(true));
      jelly = []; for (i = 0; i < (small ? 2 : 3); i++) jelly.push({ x: rnd(0.1, 0.9) * W, y: rnd(0.2, 0.7) * H, s: rnd(16, 26) * D, p: rnd(0, 6.28), v: rnd(3, 7) * D });
      weeds = []; var n = Math.round(W / (small ? 46 : 60) / D);
      for (i = 0; i < n; i++) weeds.push({ x: (i + rnd(0.1, 0.9)) * (W / n), h: rnd(0.08, 0.2) * H, p: rnd(0, 6.28), c: Math.random() < 0.5 ? "#0c4a5a" : "#0e5a52" });
    }
    function newFish(any) {
      var dir = Math.random() < 0.5 ? 1 : -1, s = rnd(8, 16) * D;
      return { x: any ? Math.random() * W : (dir > 0 ? -60 * D : W + 60 * D), y: rnd(0.15, 0.78) * H, s: s, v: rnd(8, 20) * D * dir, p: rnd(0, 6.28), c: ["#2b6f7e", "#3a7f8c", "#2f6a86", "#4a8f8a"][(Math.random() * 4) | 0] };
    }
    size();
    var rz; addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(size, 250); });

    var last = 0, t0 = performance.now(), prev = t0;
    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden || now - last < 50) return; last = now;
      var t = (now - t0) / 1000, dt = Math.min(0.1, (now - prev) / 1000); prev = now;
      if (reduce) dt = 0;
      var i;

      /* nước: xanh sẫm, sáng nhẹ ở trên */
      var g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0a3a52"); g.addColorStop(0.45, "#072a40"); g.addColorStop(1, "#02101c");
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);

      /* tia nắng xuyên mặt nước, đung đưa rất chậm */
      for (i = 0; i < rays.length; i++) {
        var r = rays[i], sway = Math.sin(t * r.s + r.p) * W * 0.03, x0 = r.x + sway;
        var lg = cx.createLinearGradient(0, 0, 0, H * 0.85);
        lg.addColorStop(0, "rgba(150,230,240," + r.a.toFixed(3) + ")"); lg.addColorStop(1, "rgba(150,230,240,0)");
        cx.fillStyle = lg; cx.beginPath();
        cx.moveTo(x0 - r.w * 0.2, 0); cx.lineTo(x0 + r.w * 0.2, 0); cx.lineTo(x0 + r.w * 1.1, H * 0.85); cx.lineTo(x0 - r.w * 0.9, H * 0.85); cx.closePath(); cx.fill();
      }

      /* hạt phù du lơ lửng */
      for (i = 0; i < motes.length; i++) {
        var m = motes[i]; m.y -= 2 * D * dt; m.x += Math.sin(t * 0.2 + m.p) * 3 * D * dt; if (m.y < -5) { m.y = H + 5; m.x = Math.random() * W; }
        cx.globalAlpha = 0.18 + 0.12 * Math.sin(t * 0.4 + m.p); cx.fillStyle = "#bfeff5"; cx.fillRect(m.x, m.y, m.r, m.r);
      }
      cx.globalAlpha = 1;

      /* cá bơi chậm */
      for (i = 0; i < fish.length; i++) {
        var f = fish[i]; f.x += f.v * dt;
        if (f.x < -80 * D || f.x > W + 80 * D) { fish[i] = newFish(false); continue; }
        var y = f.y + Math.sin(t * 0.5 + f.p) * 6 * D, d = Math.sign(f.v), s = f.s;
        cx.fillStyle = f.c; cx.globalAlpha = 0.55;
        cx.beginPath(); cx.ellipse(f.x, y, s * 1.6, s * 0.7, 0, 0, 6.283); cx.fill();
        var wag = Math.sin(t * 2 + f.p) * s * 0.25;
        cx.beginPath(); cx.moveTo(f.x - d * s * 1.4, y); cx.lineTo(f.x - d * s * 2.5, y - s * 0.7 + wag); cx.lineTo(f.x - d * s * 2.5, y + s * 0.7 + wag); cx.closePath(); cx.fill();
        cx.fillStyle = "#d9f6f4"; cx.globalAlpha = 0.6; cx.fillRect(f.x + d * s * 0.9, y - s * 0.2, Math.max(1.5, s * 0.15), Math.max(1.5, s * 0.15));
      }
      cx.globalAlpha = 1;

      /* sứa phát sáng nhẹ, trôi lên rất chậm */
      for (i = 0; i < jelly.length; i++) {
        var j = jelly[i]; j.y -= j.v * dt; j.x += Math.sin(t * 0.15 + j.p) * 4 * D * dt;
        if (j.y < -j.s * 4) { j.y = H + j.s * 3; j.x = rnd(0.1, 0.9) * W; }
        var pulse = 1 + Math.sin(t * 0.9 + j.p) * 0.06;
        var jg = cx.createRadialGradient(j.x, j.y, 0, j.x, j.y, j.s * 2.4);
        jg.addColorStop(0, "rgba(170,140,255,.22)"); jg.addColorStop(1, "rgba(170,140,255,0)");
        cx.fillStyle = jg; cx.fillRect(j.x - j.s * 3, j.y - j.s * 3, j.s * 6, j.s * 6);
        cx.fillStyle = "rgba(170,150,255,.28)"; cx.beginPath(); cx.ellipse(j.x, j.y, j.s * pulse, j.s * 0.75 * pulse, 0, Math.PI, 0); cx.fill();
        cx.strokeStyle = "rgba(170,150,255,.22)"; cx.lineWidth = D;
        for (var k = -2; k <= 2; k++) { cx.beginPath(); cx.moveTo(j.x + k * j.s * 0.35, j.y); cx.quadraticCurveTo(j.x + k * j.s * 0.35 + Math.sin(t * 0.8 + k) * j.s * 0.3, j.y + j.s * 1.1, j.x + k * j.s * 0.3, j.y + j.s * 2); cx.stroke(); }
      }

      /* bong bóng nổi chậm */
      for (i = 0; i < bubbles.length; i++) {
        var b = bubbles[i]; b.y -= b.v * dt; if (b.y < -10) { b.y = H + 10; b.x = Math.random() * W; }
        var bx = b.x + Math.sin(t * 0.6 + b.p) * 6 * D;
        cx.strokeStyle = "rgba(200,245,250,.28)"; cx.lineWidth = D; cx.beginPath(); cx.arc(bx, b.y, b.r, 0, 6.283); cx.stroke();
        cx.fillStyle = "rgba(255,255,255,.18)"; cx.fillRect(bx - b.r * 0.4, b.y - b.r * 0.5, Math.max(1, b.r * 0.3), Math.max(1, b.r * 0.3));
      }

      /* đáy cát + rong biển đung đưa chậm */
      var sand = cx.createLinearGradient(0, H * 0.9, 0, H);
      sand.addColorStop(0, "rgba(40,66,70,0)"); sand.addColorStop(1, "rgba(46,70,72,.65)");
      cx.fillStyle = sand; cx.fillRect(0, H * 0.9, W, H * 0.1);
      for (i = 0; i < weeds.length; i++) {
        var w = weeds[i]; cx.strokeStyle = w.c; cx.lineWidth = 5 * D; cx.lineCap = "round"; cx.globalAlpha = 0.7;
        var sw = Math.sin(t * 0.5 + w.p) * w.h * 0.16;
        cx.beginPath(); cx.moveTo(w.x, H); cx.bezierCurveTo(w.x + sw * 0.4, H - w.h * 0.35, w.x - sw * 0.6, H - w.h * 0.7, w.x + sw, H - w.h); cx.stroke();
      }
      cx.globalAlpha = 1;

      /* phủ tối nhẹ để chữ luôn rõ */
      cx.fillStyle = "rgba(2,14,26,.38)"; cx.fillRect(0, 0, W, H);
    }
    requestAnimationFrame(frame);
  }
  window.TavCity = { start: start };
})();
