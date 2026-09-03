const targetDate = new Date("2026-09-16T09:00:00+05:30");

function setValue(selector, value) {
  const element = document.querySelector(selector);
  if (!element) return;

  const nextValue = String(Math.max(0, value)).padStart(2, "0");
  if (element.textContent === nextValue) return;

  element.classList.add("flip");
  window.setTimeout(() => {
    element.textContent = nextValue;
    element.classList.remove("flip");
  }, 120);
}

function updateTimer() {
  const timerBox = document.querySelector(".registerBox");
  const status = document.querySelector(".event-status");
  if (!targetDate) {
    if (timerBox) timerBox.classList.add("timer-soon");
    if (status) status.textContent = "";
    return;
  }

  const diff = targetDate - new Date();

  if (diff <= 0) {
    if (timerBox) timerBox.classList.add("timer-ended");
    if (status) status.textContent = "Event has begun!";
    return;
  }

  if (timerBox) timerBox.classList.remove("timer-ended", "timer-soon");
  if (status) status.textContent = "";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setValue(".day .value", days);
  setValue(".hour .value", hours);
  setValue(".min .value", minutes);
  setValue(".sec .value", seconds);
}

function initializePageMotion() {
  const sections = document.querySelectorAll(
    ".main-section, .stats-bar, .manifesto-section, .experience-strip, .speakers-section, .timeline-section, .sponsors-section, .who-we-are, .event-gallery-section, .season-archive, .organizers-section"
  );

  sections.forEach((section) => section.classList.add("fade-in"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initializeCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(dot);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  document.querySelectorAll("a, button, summary, .speaker-card").forEach((element) => {
    element.addEventListener("mouseenter", () => dot.classList.add("cursor-active"));
    element.addEventListener("mouseleave", () => dot.classList.remove("cursor-active"));
  });

  function animateCursor() {
    x += (targetX - x) * 0.22;
    y += (targetY - y) * 0.22;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

function initializeImpactCounters() {
  const counters = document.querySelectorAll(".stat-number[data-count]");
  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.querySelector("span")?.textContent || "";
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      counter.innerHTML = `${value}<span>${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initializeMagneticButtons() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll(".btn, .nav-cta, .archive-link").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.2;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

function initializeSeasonVault() {
  document.addEventListener("click", (event) => {
    document.querySelectorAll(".season-switcher[open]").forEach((switcher) => {
      if (!switcher.contains(event.target)) {
        switcher.removeAttribute("open");
      }
    });
  });
}

function initializeHeroStars() {
  const canvas = document.getElementById("hero-stars");
  const hero = document.querySelector(".main-section");
  if (!canvas || !hero) return;

  const ctx = canvas.getContext("2d");
  const stars = [];
  const starCount = 180;
  const redCount = 14;
  let width = 0;
  let height = 0;
  let ratio = window.devicePixelRatio || 1;

  function resize() {
    const rect = hero.getBoundingClientRect();
    ratio = window.devicePixelRatio || 1;
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createStar(index) {
    const red = index < redCount;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.35 + Math.random() * 0.9,
      vx: -0.025 + Math.random() * 0.05,
      vy: 0.012 + Math.random() * 0.045,
      size: red ? 0.9 + Math.random() * 0.8 : 0.45 + Math.random() * 0.85,
      alpha: red ? 0.18 + Math.random() * 0.2 : 0.18 + Math.random() * 0.5,
      red
    };
  }

  function drawNebula() {
    const gradient = ctx.createRadialGradient(width * 0.28, height * 0.42, 0, width * 0.28, height * 0.42, width * 0.55);
    gradient.addColorStop(0, "rgba(230,43,30,0.16)");
    gradient.addColorStop(0.34, "rgba(230,43,30,0.06)");
    gradient.addColorStop(1, "rgba(230,43,30,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  resize();
  for (let index = 0; index < starCount; index += 1) {
    stars.push(createStar(index));
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    drawNebula();

    stars.forEach((star) => {
      star.x += star.vx * star.z;
      star.y += star.vy * star.z;

      if (star.x < -10) star.x = width + 10;
      if (star.x > width + 10) star.x = -10;
      if (star.y > height + 10) star.y = -10;

      ctx.beginPath();
      ctx.fillStyle = star.red
        ? `rgba(230,43,30,${star.alpha})`
        : `rgba(255,255,255,${star.alpha})`;
      ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", () => {
    resize();
    stars.forEach((star) => {
      star.x = Math.min(star.x, width);
      star.y = Math.min(star.y, height);
    });
  });

  frame();
}

(function() {
  const canvas = document.getElementById("__disabled_spiral_canvas__");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  let W;
  let H;
  let SIZE;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    SIZE = Math.max(W, H);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener("resize", () => { resize(); });

  const CHANGE_TIME = 0.32;
  const CAMERA_Z = -400;
  const TRAVEL = 3400;
  const VIEW_ZOOM = 100;
  const NUM_STARS = 7000;
  const TRAIL_LEN = 80;
  const Y_OFFSET = 28;

  function ease(p, g) {
    if (p < 0.5) return 0.5 * Math.pow(2 * p, g);
    return 1 - 0.5 * Math.pow(2 * (1 - p), g);
  }

  function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 4.5;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  function mapRange(v, a, b, c, d) {
    return c + (d - c) * ((v - a) / (b - a));
  }

  function clamp(v, mn, mx) {
    return Math.min(Math.max(v, mn), mx);
  }

  function lerp(a, b, t) {
    return a * (1 - t) + b * t;
  }

  function spiralPath(p) {
    p = clamp(1.2 * p, 0, 1);
    p = ease(p, 1.8);
    const turns = 6;
    const theta = 2 * Math.PI * turns * Math.sqrt(p);
    const r = 170 * Math.sqrt(p);
    return { x: r * Math.cos(theta), y: r * Math.sin(theta) + Y_OFFSET };
  }

  function rotatePoint(v1, v2, p, orientation) {
    const middle = {
      x: (v1.x + v2.x) / 2,
      y: (v1.y + v2.y) / 2
    };
    const dx = v1.x - middle.x;
    const dy = v1.y - middle.y;
    const angle = Math.atan2(dy, dx);
    const direction = orientation ? -1 : 1;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p);

    return {
      x: middle.x + radius * (1 + bounce) * Math.cos(angle + direction * Math.PI * easeOutElastic(p)),
      y: middle.y + radius * (1 + bounce) * Math.sin(angle + direction * Math.PI * easeOutElastic(p))
    };
  }

  const stars = [];
  let seed = 1234;

  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = 0; i < NUM_STARS; i++) {
    const angle = seededRandom() * Math.PI * 2;
    const distance = 30 * seededRandom() + 15;
    const spiralLocation = (1 - Math.pow(1 - seededRandom(), 3.0)) / 1.3;
    let z = lerp(0.5 * CAMERA_Z, TRAVEL + CAMERA_Z, seededRandom());
    z = lerp(z, TRAVEL / 2, 0.3 * spiralLocation);
    stars.push({
      angle,
      distance,
      dx: distance * Math.cos(angle),
      dy: distance * Math.sin(angle),
      spiralLocation,
      z,
      strokeWeightFactor: Math.pow(seededRandom(), 2.0),
      rotationDirection: seededRandom() > 0.5 ? 1 : -1,
      expansionRate: 1.2 + seededRandom() * 0.8,
      finalScale: 0.7 + seededRandom() * 0.6
    });
  }

  function showDot(pos3d, sizeFactor, time) {
    const t2 = clamp(mapRange(time, CHANGE_TIME, 1, 0, 1), 0, 1);
    const camZ = CAMERA_Z + ease(Math.pow(t2, 1.2), 1.8) * TRAVEL;
    if (pos3d.z > camZ) {
      const depth = pos3d.z - camZ;
      const x = VIEW_ZOOM * pos3d.x / depth;
      const y = VIEW_ZOOM * pos3d.y / depth;
      const sw = 400 * sizeFactor / depth;
      ctx.beginPath();
      ctx.arc(x, y, 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawTrail(t1, time) {
    for (let i = 0; i < TRAIL_LEN; i++) {
      const f = mapRange(i, 0, TRAIL_LEN, 1.1, 0.1);
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      const pathTime = t1 - 0.00015 * i;
      const pos = spiralPath(pathTime);
      const rotated = rotatePoint(
        pos,
        { x: pos.x + 5, y: pos.y + 5 },
        Math.sin(time * Math.PI * 2) * 0.5 + 0.5,
        i % 2 === 0
      );
      ctx.beginPath();
      ctx.arc(rotated.x, rotated.y, sw / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderStar(star, t1, time) {
    const spiralPos = spiralPath(star.spiralLocation);
    const q = t1 - star.spiralLocation;
    if (q <= 0) return;

    const dp = clamp(4 * q, 0, 1);
    let screenX;
    let screenY;

    if (dp < 0.3) {
      const t = dp / 0.3;
      screenX = lerp(spiralPos.x, spiralPos.x + star.dx * 0.3, t);
      screenY = lerp(spiralPos.y, spiralPos.y + star.dy * 0.3, t);
    } else if (dp < 0.7) {
      const midP = (dp - 0.3) / 0.4;
      const curve = Math.sin(midP * Math.PI) * star.rotationDirection * 1.5;
      const bx = spiralPos.x + star.dx * 0.3;
      const by = spiralPos.y + star.dy * 0.3;
      const tx = spiralPos.x + star.dx * 0.7;
      const ty = spiralPos.y + star.dy * 0.7;
      screenX = lerp(bx, tx, midP) + (-star.dy * 0.4 * curve) * midP;
      screenY = lerp(by, ty, midP) + (star.dx * 0.4 * curve) * midP;
    } else {
      const fp = (dp - 0.7) / 0.3;
      const bx = spiralPos.x + star.dx * 0.7;
      const by = spiralPos.y + star.dy * 0.7;
      const td = star.distance * star.expansionRate * 1.5;
      const sa = star.angle + 1.2 * star.rotationDirection * fp * Math.PI;
      screenX = lerp(bx, spiralPos.x + td * Math.cos(sa), fp);
      screenY = lerp(by, spiralPos.y + td * Math.sin(sa), fp);
    }

    const vx = (star.z - CAMERA_Z) * screenX / VIEW_ZOOM;
    const vy = (star.z - CAMERA_Z) * screenY / VIEW_ZOOM;

    const sizeMul = dp < 0.6
      ? 1.0 + dp * 0.2
      : lerp(1.2, star.finalScale, (dp - 0.6) / 0.4);

    showDot({ x: vx, y: vy, z: star.z }, 8.5 * star.strokeWeightFactor * sizeMul, time);
  }

  let time = 0;
  let last = null;
  const DURATION = 15000;

  function frame(ts) {
    if (!last) last = ts;
    const dt = ts - last;
    last = ts;
    time = (time + dt / DURATION) % 1;

    ctx.fillStyle = "rgba(0,0,0,0.95)";
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.save();
    ctx.translate(SIZE / 2, SIZE / 2);

    const t1 = clamp(mapRange(time, 0, CHANGE_TIME + 0.25, 0, 1), 0, 1);
    const t2 = clamp(mapRange(time, CHANGE_TIME, 1, 0, 1), 0, 1);

    ctx.rotate(-Math.PI * ease(t2, 2.7));

    drawTrail(t1, time);

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    for (const star of stars) {
      renderStar(star, t1, time);
    }

    if (time > CHANGE_TIME) {
      const dy = CAMERA_Z * Y_OFFSET / VIEW_ZOOM;
      showDot({ x: 0, y: dy, z: TRAVEL }, 2.5, time);
    }

    ctx.restore();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

function initMagicText() {
  const el = document.getElementById("magic-text");
  if (!el) return;

  const text = el.getAttribute("data-text");
  if (!text) return;

  const words = text.trim().split(" ");

  el.innerHTML = words
    .map((word, index) => `<span class="magic-word" data-index="${index}">${word}</span>`)
    .join("");

  const spans = el.querySelectorAll(".magic-word");
  const total = spans.length;

  function onScroll() {
    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const start = windowH * 0.9;
    const end = windowH * 0.25;
    const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
    const litCount = Math.floor(progress * total);

    spans.forEach((span, index) => {
      if (index < litCount) {
        span.classList.add("lit");
      } else {
        span.classList.remove("lit");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initializeRegisterSoonModal() {
  const modal = document.getElementById("registerSoonModal");
  if (!modal) return;

  const closeButton = modal.querySelector(".soon-modal__close");

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".register-soon-trigger");
    if (!trigger) return;
    event.preventDefault();
    openModal();
  });

  closeButton?.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function initializeDateReveal() {
  const reveal = document.querySelector(".date-reveal");
  if (!reveal) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.setTimeout(() => reveal.classList.add("is-revealed"), 420);
  if (!reduceMotion) window.setTimeout(initializeDateConfetti, 620);
}

function initializeDateConfetti() {
  const canvas = document.getElementById("date-confetti");
  const reveal = document.querySelector(".date-reveal");
  if (!canvas || !reveal) return;

  const ctx = canvas.getContext("2d");
  const colors = ["#ff1744", "#ffd600", "#00e5ff", "#76ff03", "#ff4fd8", "#ff9100", "#ffffff"];
  const flakes = [];
  const ribbons = [];
  let width = 0;
  let height = 0;
  let ratio = window.devicePixelRatio || 1;
  let frameId = null;
  let start = performance.now();

  function resize() {
    const rect = reveal.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createFlake(side) {
    const fromLeft = side === "left";
    const angle = (fromLeft ? -34 : -146) + (Math.random() * 48 - 24);
    const speed = 3.2 + Math.random() * 5.2;
    const radians = angle * Math.PI / 180;

    return {
      x: fromLeft ? 18 : width - 18,
      y: height - 22 + Math.random() * 18,
      vx: Math.cos(radians) * speed,
      vy: Math.sin(radians) * speed,
      gravity: 0.08 + Math.random() * 0.08,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.34,
      size: 5 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.24 ? "rect" : "circle",
      life: 1,
      decay: 0.006 + Math.random() * 0.006
    };
  }

  function createRibbon(side) {
    const fromLeft = side === "left";
    const color = colors[Math.floor(Math.random() * (colors.length - 1))];
    const x = fromLeft ? 4 + Math.random() * 34 : width - 38 + Math.random() * 34;
    const y = height - 20 - Math.random() * 42;
    const vx = (fromLeft ? 1 : -1) * (2.8 + Math.random() * 2.6);
    const vy = -(3.7 + Math.random() * 2.8);

    return {
      points: Array.from({ length: 18 }, (_, index) => ({
        x: x - (fromLeft ? index * 5 : -index * 5),
        y: y + index * 4
      })),
      vx,
      vy,
      gravity: 0.055 + Math.random() * 0.045,
      wave: Math.random() * Math.PI * 2,
      waveSpeed: 0.14 + Math.random() * 0.08,
      waveSize: 7 + Math.random() * 10,
      color,
      width: 5 + Math.random() * 4,
      life: 1,
      decay: 0.0036 + Math.random() * 0.002
    };
  }

  function burst() {
    for (let index = 0; index < 110; index += 1) {
      flakes.push(createFlake(index % 2 === 0 ? "left" : "right"));
    }
    for (let index = 0; index < 7; index += 1) {
      ribbons.push(createRibbon(index % 2 === 0 ? "left" : "right"));
    }
  }

  function drawFlake(flake) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, flake.life);
    ctx.translate(flake.x, flake.y);
    ctx.rotate(flake.rotation);
    ctx.fillStyle = flake.color;

    if (flake.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, flake.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-flake.size * 0.5, -flake.size * 0.28, flake.size, flake.size * 0.56);
    }

    ctx.restore();
  }

  function drawRibbon(ribbon) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, ribbon.life);
    ctx.strokeStyle = ribbon.color;
    ctx.lineWidth = ribbon.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = ribbon.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();

    ribbon.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        const previous = ribbon.points[index - 1];
        ctx.quadraticCurveTo(previous.x, previous.y, (previous.x + point.x) / 2, (previous.y + point.y) / 2);
      }
    });

    ctx.stroke();
    ctx.restore();
  }

  function frame(now) {
    ctx.clearRect(0, 0, width, height);

    for (let index = ribbons.length - 1; index >= 0; index -= 1) {
      const ribbon = ribbons[index];
      ribbon.vy += ribbon.gravity;
      ribbon.wave += ribbon.waveSpeed;
      ribbon.life -= ribbon.decay;

      ribbon.points.forEach((point, pointIndex) => {
        const lag = pointIndex * 0.08;
        point.x += ribbon.vx + Math.sin(ribbon.wave + lag) * 0.9;
        point.y += ribbon.vy + Math.cos(ribbon.wave + lag) * 0.35;
        point.x += Math.sin(ribbon.wave + pointIndex * 0.6) * ribbon.waveSize * 0.045;
      });

      drawRibbon(ribbon);

      const head = ribbon.points[0];
      if (ribbon.life <= 0 || head.y > height + 80 || head.x < -120 || head.x > width + 120) {
        ribbons.splice(index, 1);
      }
    }

    for (let index = flakes.length - 1; index >= 0; index -= 1) {
      const flake = flakes[index];
      flake.vy += flake.gravity;
      flake.x += flake.vx;
      flake.y += flake.vy;
      flake.rotation += flake.spin;
      flake.life -= flake.decay;
      drawFlake(flake);

      if (flake.life <= 0 || flake.y > height + 28 || flake.x < -28 || flake.x > width + 28) {
        flakes.splice(index, 1);
      }
    }

    if (now - start < 3200 || flakes.length || ribbons.length) {
      frameId = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, width, height);
      frameId = null;
    }
  }

  resize();
  burst();
  frameId = requestAnimationFrame(frame);

  window.addEventListener("resize", () => {
    resize();
    if (!frameId) {
      start = performance.now();
      burst();
      frameId = requestAnimationFrame(frame);
    }
  }, { passive: true });
}

function initializeTeamAutoScroll() {
  const strips = document.querySelectorAll(".team-leads-grid, .team-core-strip");
  if (!strips.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 768px)");
  let frameId = null;

  function stop() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = null;
  }

  function start() {
    stop();
    if (!mobile.matches || reduceMotion.matches) return;

    let last = performance.now();

    function tick(now) {
      const delta = Math.min(now - last, 32);
      last = now;

      strips.forEach((strip, index) => {
        if (strip.matches(":hover") || strip.dataset.paused === "true") return;
        const maxScroll = strip.scrollWidth - strip.clientWidth;
        if (maxScroll <= 0) return;

        strip.scrollLeft += (index === 0 ? 0.065 : 0.082) * delta;
        if (strip.scrollLeft >= maxScroll - 1) strip.scrollLeft = 0;
      });

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
  }

  strips.forEach((strip) => {
    strip.dataset.paused = "false";
    let resumeTimer;

    function pause() {
      strip.dataset.paused = "true";
      window.clearTimeout(resumeTimer);
    }

    function resume() {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        strip.dataset.paused = "false";
      }, 1400);
    }

    strip.addEventListener("pointerdown", pause, { passive: true });
    strip.addEventListener("pointerup", resume, { passive: true });
    strip.addEventListener("pointercancel", resume, { passive: true });
    strip.addEventListener("touchend", resume, { passive: true });
  });

  mobile.addEventListener?.("change", start);
  reduceMotion.addEventListener?.("change", start);
  start();
}

document.addEventListener("DOMContentLoaded", () => {
  updateTimer();
  window.setInterval(updateTimer, 1000);
  initializePageMotion();
  initializeImpactCounters();
  initializeMagneticButtons();
  initializeSeasonVault();
  initializeHeroStars();
  initMagicText();
  initializeRegisterSoonModal();
  initializeDateReveal();
  initializeCursor();
});
