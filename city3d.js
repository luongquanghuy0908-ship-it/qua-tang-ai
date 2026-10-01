/* Thành phố tương lai 3D (Three.js) cho Kho quà — Trạm AI Việt.
   Nhà cao tầng sáng đèn, tàu bay, robot khổng lồ, robot trên nóc nhà, drone, dòng xe bay.
   Máy quay bay vòng chậm quanh thành phố. Không có WebGL thì dùng nền 2D (city.js). */
(function () {
  var THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  var started = false;

  function hasWebGL() {
    try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; }
  }
  function loadThree(cb, fail) {
    if (window.THREE) return cb();
    var s = document.createElement("script"); s.src = THREE_URL; s.onload = cb; s.onerror = fail; document.head.appendChild(s);
  }
  function fallback2D() { if (window.TavCity2D) window.TavCity2D.start(); }

  function start() {
    if (started) return; started = true;
    if (!hasWebGL()) return fallback2D();
    loadThree(function () { try { build(); } catch (e) { try { console.error(e); } catch (x) {} fallback2D(); } }, fallback2D);
  }

  function build() {
    var T = window.THREE;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var small = innerWidth < 700;

    /* khung vẽ + lớp tối phủ để chữ dễ đọc */
    var renderer = new T.WebGLRenderer({ antialias: !small, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(small ? 1.25 : 1.5, window.devicePixelRatio || 1));
    renderer.setSize(innerWidth, innerHeight);
    var cv = renderer.domElement;
    cv.id = "tavCity"; cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-2;pointer-events:none;opacity:0;transition:opacity 1.4s ease";
    document.body.appendChild(cv);
    var shade = document.createElement("div");
    shade.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(180deg,rgba(5,8,22,.62) 0%,rgba(5,8,22,.38) 45%,rgba(5,8,22,.2) 100%)";
    document.body.appendChild(shade);
    document.body.classList.add("city-on");

    var scene = new T.Scene();
    scene.background = new T.Color(0x060a1c);
    scene.fog = new T.FogExp2(0x1a0f3a, small ? 0.014 : 0.011);
    var cam = new T.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 400);

    scene.add(new T.HemisphereLight(0x6a7cff, 0x1a0630, 0.55));
    var key = new T.DirectionalLight(0xff5fb0, 0.5); key.position.set(-20, 30, 10); scene.add(key);
    var rim = new T.DirectionalLight(0x00f5d4, 0.45); rim.position.set(25, 18, -20); scene.add(rim);

    /* ---------- kết cấu cửa sổ sinh bằng canvas ---------- */
    function windowTex(cols, rows) {
      var c = document.createElement("canvas"); c.width = cols * 8; c.height = rows * 8;
      var g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, c.width, c.height);
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) if (Math.random() < 0.42) {
        var r = Math.random(); g.fillStyle = r < 0.7 ? "rgba(255,206,130," + (0.5 + Math.random() * 0.5) + ")" : r < 0.85 ? "rgba(0,245,212,.9)" : "rgba(160,120,255,.9)";
        g.fillRect(x * 8 + 2, y * 8 + 2, 4, 5);
      }
      var t = new T.CanvasTexture(c); t.magFilter = T.NearestFilter; return t;
    }
    function glowTex(color) {
      var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d");
      var r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.25, color); r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c);
    }
    function glow(color, size) {
      var m = new T.SpriteMaterial({ map: glowTex(color), blending: T.AdditiveBlending, depthWrite: false, transparent: true });
      var s = new T.Sprite(m); s.scale.set(size, size, 1); return s;
    }

    /* ---------- sao trên trời ---------- */
    var sg = new T.BufferGeometry(), sp3 = [];
    for (var q = 0; q < 900; q++) { var th2 = Math.random() * 6.283, ph = Math.random() * 1.2, rr = 180; sp3.push(Math.cos(th2) * Math.cos(ph) * rr, 20 + Math.sin(ph) * rr, Math.sin(th2) * Math.cos(ph) * rr); }
    sg.setAttribute("position", new T.Float32BufferAttribute(sp3, 3));
    scene.add(new T.Points(sg, new T.PointsMaterial({ color: 0xcfe0ff, size: 0.7, sizeAttenuation: true, fog: false })));

    /* ---------- mặt đất + lưới neon ---------- */
    var ground = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshLambertMaterial({ color: 0x05060f }));
    ground.rotation.x = -Math.PI / 2; scene.add(ground);
    var grid = new T.GridHelper(240, 120, 0x00f5d4, 0x16326a); grid.position.y = 0.02;
    grid.material.transparent = true; grid.material.opacity = 0.35; scene.add(grid);
    var plaza = new T.Mesh(new T.RingGeometry(11, 11.5, 72), new T.MeshBasicMaterial({ color: 0xff2e93, side: T.DoubleSide }));
    plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.05; scene.add(plaza);
    var plaza2 = new T.Mesh(new T.RingGeometry(7.5, 7.8, 72), new T.MeshBasicMaterial({ color: 0x00f5d4, side: T.DoubleSide }));
    plaza2.rotation.x = -Math.PI / 2; plaza2.position.y = 0.05; scene.add(plaza2);

    /* ---------- nhà cao tầng (InstancedMesh, 3 nhóm chiều cao) ---------- */
    var tex = [windowTex(4, 8), windowTex(4, 16), windowTex(4, 30)];
    var spots = [], step = 4.2, R = small ? 46 : 60;
    for (var gx = -R; gx <= R; gx += step) for (var gz = -R; gz <= R; gz += step) {
      var d = Math.sqrt(gx * gx + gz * gz);
      if (d < 17 || d > R) continue;
      if (Math.abs(gx) < 2.2 || Math.abs(gz) < 2.2) continue; /* chừa 2 đại lộ chữ thập */
      if (Math.random() < 0.18) continue;
      spots.push({ x: gx + (Math.random() - 0.5) * 1.2, z: gz + (Math.random() - 0.5) * 1.2, d: d });
    }
    var groups = [[], [], []], roofs = [];
    spots.forEach(function (s) {
      var near = 1 - s.d / R; /* càng gần tâm càng cao */
      var h = 2 + Math.pow(Math.random(), 1.8) * 12 + near * 11;
      var k = h < 7 ? 0 : h < 14 ? 1 : 2;
      var w = 1.6 + Math.random() * 1.6, dpt = 1.6 + Math.random() * 1.6;
      groups[k].push({ x: s.x, z: s.z, h: h, w: w, d: dpt });
      if (h > 9 && Math.random() < 0.45) roofs.push({ x: s.x, z: s.z, y: h, w: w, d: dpt });
    });
    var box = new T.BoxGeometry(1, 1, 1), dummy = new T.Object3D();
    groups.forEach(function (arr, k) {
      if (!arr.length) return;
      var mat = new T.MeshLambertMaterial({ color: 0x0b1230, emissive: 0xffffff, emissiveMap: tex[k], emissiveIntensity: 0.95 });
      var im = new T.InstancedMesh(box, mat, arr.length);
      arr.forEach(function (b, i) { dummy.position.set(b.x, b.h / 2, b.z); dummy.scale.set(b.w, b.h, b.d); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); });
      scene.add(im);
    });
    /* viền neon trên nóc */
    var NEON = [0x00f5d4, 0xff2e93, 0x7c5cff, 0x38bdf8, 0x7cff9b];
    if (roofs.length) {
      /* 4 thanh mảnh quanh mép nóc thay vì tô kín */
      var rim2 = new T.InstancedMesh(box, new T.MeshBasicMaterial({ color: 0xffffff }), roofs.length * 4);
      var colr = new T.Color(), n = 0, th = 0.09;
      roofs.forEach(function (r, i) {
        colr.setHex(NEON[i % NEON.length]);
        [[0, r.d / 2, r.w + th, th], [0, -r.d / 2, r.w + th, th], [r.w / 2, 0, th, r.d + th], [-r.w / 2, 0, th, r.d + th]].forEach(function (e) {
          dummy.position.set(r.x + e[0], r.y + 0.05, r.z + e[1]); dummy.scale.set(e[2], 0.1, e[3]); dummy.updateMatrix();
          rim2.setMatrixAt(n, dummy.matrix); rim2.setColorAt(n, colr); n++;
        });
      });
      scene.add(rim2);
    }

    /* ---------- robot (khối ghép) ---------- */
    function makeRobot(opt) {
      var body = new T.MeshStandardMaterial({ color: opt.color || 0xc8d2e6, metalness: 0.45, roughness: 0.4, emissive: opt.color || 0xc8d2e6, emissiveIntensity: 0.22 });
      var dark = new T.MeshStandardMaterial({ color: 0x1b2238, metalness: 0.6, roughness: 0.5 });
      var eye = new T.MeshBasicMaterial({ color: opt.eye || 0x00f5d4 });
      var g = new T.Group(), B = function (w, h, d, m) { return new T.Mesh(new T.BoxGeometry(w, h, d), m); };
      var hip = new T.Group(); hip.position.y = 2; g.add(hip);
      var torso = B(1.5, 1.6, 0.9, body); torso.position.y = 1.0; hip.add(torso);
      var chest = B(0.6, 0.35, 0.05, eye); chest.position.set(0, 1.2, 0.47); hip.add(chest);
      var head = new T.Group(); head.position.y = 2.15; hip.add(head);
      head.add(B(0.9, 0.7, 0.8, body));
      var visor = B(0.72, 0.18, 0.05, eye); visor.position.set(0, 0.06, 0.42); head.add(visor);
      var ant = B(0.06, 0.4, 0.06, dark); ant.position.set(0.3, 0.55, 0); head.add(ant);
      var tip = new T.Mesh(new T.SphereGeometry(0.09, 8, 8), new T.MeshBasicMaterial({ color: 0xff3c50 })); tip.position.set(0.3, 0.78, 0); head.add(tip);
      function limb(x, y, len, w) {
        var p = new T.Group(); p.position.set(x, y, 0);
        var seg = B(w, len, w, dark); seg.position.y = -len / 2; p.add(seg);
        var cap = B(w * 1.25, len * 0.35, w * 1.25, body); cap.position.y = -len * 0.18; p.add(cap);
        return p;
      }
      var armL = limb(-0.95, 1.7, 1.5, 0.36), armR = limb(0.95, 1.7, 1.5, 0.36);
      hip.add(armL); hip.add(armR);
      var legL = limb(-0.4, 0.2, 2.1, 0.45), legR = limb(0.4, 0.2, 2.1, 0.45);
      g.add(legL); g.add(legR); legL.position.y = legR.position.y = 2.1;
      var eyeGlow = glow("rgba(0,245,212,.9)", 1.6); eyeGlow.position.set(0, 0.06, 0.5); head.add(eyeGlow);
      g.scale.setScalar(opt.scale || 1);
      g.userData = { armL: armL, armR: armR, legL: legL, legR: legR, head: head, hip: hip, mode: opt.mode || "wave", ph: Math.random() * 6 };
      return g;
    }
    var robots = [];
    var giant = makeRobot({ scale: 3.6, color: 0xdfe6f5, eye: 0x00f5d4, mode: "wave" });
    giant.position.set(0, 0, 0); scene.add(giant); robots.push(giant);
    var holo = glow("rgba(255,46,147,.5)", 34); holo.position.set(0, 12, 0); scene.add(holo);
    /* robot nhỏ trên nóc nhà gần tâm */
    roofs.slice().sort(function (a, b) { return (a.x * a.x + a.z * a.z) - (b.x * b.x + b.z * b.z); }).slice(0, small ? 3 : 5).forEach(function (r, i) {
      var rb = makeRobot({ scale: 0.55, color: [0xffb36b, 0xa3b8ff, 0x9cffd9, 0xff9cc9, 0xe6e6e6][i], eye: [0xff2e93, 0x00f5d4, 0x7c5cff, 0x7cff9b, 0x38bdf8][i], mode: i % 2 ? "dance" : "wave" });
      rb.position.set(r.x, r.y + 0.16, r.z); rb.lookAt(0, r.y, 0); scene.add(rb); robots.push(rb);
    });

    /* ---------- tàu bay tương lai ---------- */
    function makeShip(col) {
      var g = new T.Group();
      var hull = new T.MeshStandardMaterial({ color: 0xd7deef, metalness: 0.6, roughness: 0.3, emissive: 0x3a4566, emissiveIntensity: 0.5 });
      var acc = new T.MeshBasicMaterial({ color: col });
      var nose = new T.Mesh(new T.ConeGeometry(0.45, 2.4, 10), hull); nose.rotation.x = Math.PI / 2; nose.position.z = 1.0; g.add(nose);
      var body = new T.Mesh(new T.CylinderGeometry(0.45, 0.6, 1.6, 10), hull); body.rotation.x = Math.PI / 2; body.position.z = -0.6; g.add(body);
      var wing = new T.Mesh(new T.BoxGeometry(3.4, 0.08, 0.9), hull); wing.position.set(0, -0.05, -0.6); g.add(wing);
      var tipL = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.9), acc); tipL.position.set(-1.7, -0.05, -0.6); g.add(tipL);
      var tipR = tipL.clone(); tipR.position.x = 1.7; g.add(tipR);
      var fin = new T.Mesh(new T.BoxGeometry(0.08, 0.7, 0.6), hull); fin.position.set(0, 0.4, -1.1); g.add(fin);
      var cockpit = new T.Mesh(new T.SphereGeometry(0.32, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }));
      cockpit.position.set(0, 0.3, 0.35); g.add(cockpit);
      var flame = glow("rgba(0,245,212,.95)", 2.2); flame.position.z = -1.6; g.add(flame);
      var flame2 = glow(col === 0xff2e93 ? "rgba(255,46,147,.9)" : "rgba(124,92,255,.9)", 1.3); flame2.position.z = -2.3; g.add(flame2);
      g.userData.flames = [flame, flame2];
      return g;
    }
    var ships = [];
    var shipCount = small ? 4 : 7;
    for (var si = 0; si < shipCount; si++) {
      var sh = makeShip(NEON[si % NEON.length]);
      sh.userData.r = 12 + Math.random() * 26; sh.userData.y = 14 + Math.random() * 12; sh.userData.sp = (0.12 + Math.random() * 0.18) * (Math.random() < 0.5 ? 1 : -1);
      sh.userData.a = Math.random() * 6.28; sh.userData.wob = Math.random() * 6;
      sh.scale.setScalar(0.9 + Math.random() * 0.6);
      scene.add(sh); ships.push(sh);
    }

    /* ---------- drone tròn có vòng sáng ---------- */
    var drones = [];
    for (var di = 0; di < (small ? 4 : 8); di++) {
      var dg = new T.Group();
      dg.add(new T.Mesh(new T.SphereGeometry(0.35, 14, 12), new T.MeshStandardMaterial({ color: 0x2a3350, metalness: 0.8, roughness: 0.3 })));
      var ring = new T.Mesh(new T.TorusGeometry(0.62, 0.05, 6, 30), new T.MeshBasicMaterial({ color: NEON[di % NEON.length] })); ring.rotation.x = Math.PI / 2; dg.add(ring);
      var de = new T.Mesh(new T.SphereGeometry(0.11, 8, 8), new T.MeshBasicMaterial({ color: 0xff3c50 })); de.position.z = 0.32; dg.add(de);
      dg.add(glow("rgba(0,245,212,.5)", 1.6));
      dg.userData = { a: Math.random() * 6.28, r: 8 + Math.random() * 12, y: 12 + Math.random() * 8, sp: 0.25 + Math.random() * 0.3 };
      scene.add(dg); drones.push(dg);
    }

    /* ---------- dòng xe bay dọc 2 đại lộ ---------- */
    var carN = small ? 40 : 80;
    var cars = new T.InstancedMesh(new T.BoxGeometry(0.25, 0.12, 0.9), new T.MeshBasicMaterial({ color: 0xffffff }), carN);
    var carData = [], cc = new T.Color();
    for (var ci = 0; ci < carN; ci++) {
      carData.push({ axis: ci % 2, lane: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.0), y: 1.5 + Math.random() * 7, p: Math.random() * 2 * R - R, v: (8 + Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1) });
      cc.setHex(Math.random() < 0.5 ? 0xff5f5f : Math.random() < 0.5 ? 0xfff2c4 : 0x00f5d4); cars.setColorAt(ci, cc);
    }
    scene.add(cars);

    /* ---------- vòng hologram quanh robot khổng lồ ---------- */
    var halo1 = new T.Mesh(new T.TorusGeometry(8, 0.07, 6, 90), new T.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.7 }));
    halo1.rotation.x = Math.PI / 2; halo1.position.y = 6; scene.add(halo1);
    var halo2 = new T.Mesh(new T.TorusGeometry(9.5, 0.06, 6, 90), new T.MeshBasicMaterial({ color: 0xff2e93, transparent: true, opacity: 0.6 }));
    halo2.rotation.x = Math.PI / 2; halo2.position.y = 9; scene.add(halo2);

    /* ---------- hoạt cảnh ---------- */
    var mx = 0, my = 0;
    addEventListener("pointermove", function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    addEventListener("resize", function () { cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

    var clock = new T.Clock(), last = 0, first = true;
    function animate(now) {
      requestAnimationFrame(animate);
      if (document.hidden || now - last < (small ? 40 : 30)) return; last = now;
      var t = clock.getElapsedTime(), sp = reduce ? 0.15 : 1, i;
      var sc = Math.min(1, (window.scrollY || 0) / 1500);

      /* máy quay bay vòng quanh, hạ thấp dần khi cuộn trang */
      var ang = t * 0.045 * sp + 0.6, rad = (small ? 46 : 40) - sc * 6;
      cam.position.set(Math.cos(ang) * rad + mx * 3, 27 + Math.sin(t * 0.3) * 2 - sc * 6 - my * 2, Math.sin(ang) * rad);
      cam.lookAt(0, 5 - sc * 2, 0);

      /* robot cử động */
      robots.forEach(function (r) {
        var u = r.userData, q = t * 2.2 + u.ph;
        if (u.mode === "wave") {
          u.armR.rotation.z = 2.4 + Math.sin(q * 1.6) * 0.45; u.armR.rotation.x = 0;
          u.armL.rotation.x = Math.sin(q * 0.6) * 0.15;
          u.head.rotation.y = Math.sin(q * 0.4) * 0.35;
        } else {
          u.armL.rotation.x = Math.sin(q) * 0.9; u.armR.rotation.x = -Math.sin(q) * 0.9;
          u.legL.rotation.x = Math.sin(q) * 0.35; u.legR.rotation.x = -Math.sin(q) * 0.35;
          u.hip.position.y = 2 + Math.abs(Math.sin(q)) * 0.15; u.head.rotation.z = Math.sin(q) * 0.15;
        }
      });
      giant.rotation.y = Math.sin(t * 0.25) * 0.5;
      holo.material.opacity = 0.6 + Math.sin(t * 2) * 0.25;
      halo1.rotation.z = t * 0.6; halo1.position.y = 8 + Math.sin(t * 1.2) * 0.8;
      halo2.rotation.z = -t * 0.4; halo2.position.y = 13 + Math.cos(t * 1.1) * 0.8;

      /* tàu bay lượn vòng, nghiêng cánh theo hướng bay */
      ships.forEach(function (s) {
        var u = s.userData; u.a += u.sp * 0.03 * sp;
        var x = Math.cos(u.a) * u.r, z = Math.sin(u.a) * u.r, y = u.y + Math.sin(t * 0.8 + u.wob) * 1.2;
        var nx = Math.cos(u.a + 0.05 * Math.sign(u.sp)) * u.r, nz = Math.sin(u.a + 0.05 * Math.sign(u.sp)) * u.r;
        s.position.set(x, y, z); s.lookAt(nx, y, nz); s.rotateZ(-0.45 * Math.sign(u.sp));
        var f = 1 + Math.sin(t * 20 + u.wob) * 0.15; u.flames[0].scale.set(2.2 * f, 2.2 * f, 1);
      });
      /* drone lơ lửng */
      drones.forEach(function (d) {
        var u = d.userData; u.a += u.sp * 0.02 * sp;
        d.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(t * 1.5 + u.a) * 0.8, Math.sin(u.a * 1.3) * u.r);
        d.rotation.y = -u.a; d.children[1].rotation.z = t * 3;
      });
      /* xe bay */
      for (i = 0; i < carN; i++) {
        var c = carData[i]; c.p += c.v * 0.03 * sp;
        if (c.p > R) c.p = -R; if (c.p < -R) c.p = R;
        if (c.axis === 0) { dummy.position.set(c.lane, c.y, c.p); dummy.rotation.set(0, 0, 0); }
        else { dummy.position.set(c.p, c.y, c.lane); dummy.rotation.set(0, Math.PI / 2, 0); }
        dummy.scale.set(1, 1, 1); dummy.updateMatrix(); cars.setMatrixAt(i, dummy.matrix);
      }
      cars.instanceMatrix.needsUpdate = true;

      renderer.render(scene, cam);
      if (first) { first = false; cv.style.opacity = "1"; }
    }
    requestAnimationFrame(animate);
  }

  window.TavCity = { start: start };
})();
