/* ==========================================================================
   Marcos Lozano Marín — Interactividad del CV Web
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initDynamicDates();
  initNavbar();
  initMobileMenu();
  initRoleRotator();
  initExperienceFilters();
  initScrollReveal();
  initPrintCV();
  initCopyEmail();
  initContactForm();
  initOrganicCardGlow();
  initScrollProgress();
  initCursorAura();
  initCustomCursor();
  init3DTilt();
  initMagneticButtons();
  initOrganic3DScene();
});

/* 1. Edad automática desde 26/08/2006 y año actual */
function initDynamicDates() {
  const birthDate = new Date(2006, 7, 26); // Mes 7 = agosto
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthday) age -= 1;

  const ageEl = document.getElementById("age-value");
  if (ageEl && age > 0) {
    ageEl.textContent = String(age);
  }
  const heroAgeEl = document.getElementById("hero-age");
  if (heroAgeEl && age > 0) {
    heroAgeEl.textContent = String(age);
  }

  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(today.getFullYear());
  }
}

/* 2. Efecto scroll en navbar y enlace activo */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    if (navbar) {
      navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    const scrollPos = window.scrollY + 140;
    let activeId = "";
    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) {
        activeId = `#${sec.id}`;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === activeId);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* 3. Menú móvil */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-menu");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/* 4. Rotación de texto de especialidad en el Hero */
function initRoleRotator() {
  const el = document.getElementById("typed-role");
  if (!el) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const phrases = [
    "automatización con IA",
    "diseño de páginas web",
    "redes sociales",
    "trato directo con clientes",
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = false;

  const tick = () => {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    el.textContent = current.slice(0, charIndex);

    let delay = isDeleting ? 45 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 360;
    }

    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, 2200);
}

/* 5. Filtros de experiencia (Todo / Empleo / Prácticas / Voluntariado) */
function initExperienceFilters() {
  const buttons = Array.from(document.querySelectorAll(".filter-btn"));
  const items = Array.from(document.querySelectorAll("#experience-list .timeline__item"));
  if (!buttons.length || !items.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });

      items.forEach((item) => {
        const matches = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !matches);
        if (matches) {
          item.classList.add("is-visible");
        }
      });
    });
  });
}

/* 6. Animaciones de aparición al hacer scroll */
function initScrollReveal() {
  const elements = Array.from(document.querySelectorAll(".reveal"));
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* 7. Botón de imprimir / guardar como PDF */
function initPrintCV() {
  const btn = document.getElementById("print-cv-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.print();
  });
}

/* 8. Copiar correo electrónico */
function initCopyEmail() {
  const btn = document.getElementById("copy-email-btn");
  const emailEl = document.getElementById("email-text");
  if (!btn || !emailEl) return;

  btn.addEventListener("click", async () => {
    const email = emailEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      const original = btn.textContent;
      btn.textContent = "¡Copiado!";
      window.setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    } catch {
      btn.textContent = "Selecciona y copia";
    }
  });
}

/* 9. Formulario de contacto (validación + cliente de correo) */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const emailEl = document.getElementById("email-text");
  if (!form || !feedback) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.textContent = "Por favor, completa todos los campos antes de enviar.";
      feedback.classList.add("is-error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.textContent = "Introduce un correo electrónico válido.";
      feedback.classList.add("is-error");
      return;
    }

    feedback.classList.remove("is-error");
    feedback.textContent = `¡Gracias, ${name}! Se abrirá tu aplicación de correo para enviar el mensaje.`;

    const targetEmail = emailEl ? emailEl.textContent.trim() : "";
    const subject = encodeURIComponent(`Contacto desde CV Web — ${name}`);
    const body = encodeURIComponent(`Hola Marcos,\n\n${message}\n\nUn saludo,\n${name} (${email})`);
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    form.reset();
  });
}

/* 10. Brillo líquido orgánico que sigue al cursor en tarjetas */
function initOrganicCardGlow() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

/* 11. Barra de progreso de lectura */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* 12. Aura suave que sigue al cursor con inercia (solo puntero fino) */
function initCursorAura() {
  const aura = document.getElementById("cursor-aura");
  if (!aura) return;

  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFinePointer || prefersReduced) return;

  let targetX = -500;
  let targetY = -500;
  let currentX = -500;
  let currentY = -500;

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX - 170;
      targetY = event.clientY - 170;
      aura.classList.add("is-active");
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => {
    aura.classList.remove("is-active");
  });

  const animate = () => {
    currentX += (targetX - currentX) * 0.085;
    currentY += (targetY - currentY) * 0.085;
    aura.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
    window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);
}

/* 12b. Cursor personalizado fluido con anillo morado y estela de pincel */
function initCustomCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFinePointer || prefersReduced) return;

  document.body.classList.add("has-custom-cursor");

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let lastSparkX = -100;
  let lastSparkY = -100;
  let visible = false;

  const spawnSpark = (x, y) => {
    const spark = document.createElement("span");
    spark.className = "cursor-spark";
    const size = 6 + Math.random() * 8;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    document.body.appendChild(spark);
    window.setTimeout(() => spark.remove(), 560);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.classList.add("is-visible");
        ring.classList.add("is-visible");
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // Estela sutil al mover el ratón
      const dist = Math.hypot(mouseX - lastSparkX, mouseY - lastSparkY);
      if (dist > 26) {
        lastSparkX = mouseX;
        lastSparkY = mouseY;
        spawnSpark(mouseX, mouseY);
      }

      // Detectar elementos interactivos o campos de texto
      const target = event.target;
      const isInput = target && target.closest("input, textarea");
      const isInteractive = target && target.closest("a, button, [data-tilt], .chip, .social-pill");

      dot.classList.toggle("is-hidden", Boolean(isInput));
      ring.classList.toggle("is-hidden", Boolean(isInput));
      dot.classList.toggle("is-hover", Boolean(isInteractive && !isInput));
      ring.classList.toggle("is-hover", Boolean(isInteractive && !isInput));
    },
    { passive: true }
  );

  window.addEventListener("pointerdown", () => {
    ring.classList.add("is-down");
  });

  window.addEventListener("pointerup", () => {
    ring.classList.remove("is-down");
  });

  document.addEventListener("pointerleave", () => {
    visible = false;
    dot.classList.remove("is-visible");
    ring.classList.remove("is-visible");
  });

  const loop = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
}

/* 13. Inclinación 3D interactiva en tarjetas ([data-tilt]) */
function init3DTilt() {
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFinePointer || prefersReduced) return;

  const elements = document.querySelectorAll("[data-tilt]");
  elements.forEach((el) => {
    const isProfile = el.classList.contains("profile-card");
    const maxAngle = isProfile ? 9 : 6;

    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = px * maxAngle * 2;
      const rotateX = -py * maxAngle * 2;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

/* 14. Botones magnéticos suaves ([data-magnetic]) */
function initMagneticButtons() {
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!isFinePointer || prefersReduced) return;

  const buttons = document.querySelectorAll("[data-magnetic]");
  buttons.forEach((btn) => {
    btn.addEventListener("pointermove", (event) => {
      const rect = btn.getBoundingClientRect();
      const dx = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const dy = (event.clientY - rect.top - rect.height / 2) * 0.22;
      btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${(dy - 2).toFixed(1)}px, 0)`;
    });

    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

/* 15. Escena 3D orgánica interactiva (Esfera neuronal viva en Canvas 3D) */
function initOrganic3DScene() {
  const canvas = document.getElementById("hero-3d-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Nodos en esfera usando espiral de Fibonacci para distribución orgánica uniforme
  const NODE_COUNT = 82;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const nodes = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    nodes.push({
      bx: Math.cos(theta) * radiusAtY,
      by: y,
      bz: Math.sin(theta) * radiusAtY,
      phase: i * 0.37,
      hue: i % 3 === 0 ? "teal" : i % 3 === 1 ? "blue" : "violet",
    });
  }

  let mouseX = 0;
  let mouseY = 0;
  let smoothMouseX = 0;
  let smoothMouseY = 0;
  let scrollRatio = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      mouseX = (event.clientX / Math.max(width, 1) - 0.5) * 2;
      mouseY = (event.clientY / Math.max(height, 1) - 0.5) * 2;
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollRatio = window.scrollY / max;
    },
    { passive: true }
  );

  const rotatePoint = (x, y, z, rx, ry) => {
    // Rotación en Y
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Rotación en X
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    return { x: x1, y: y2, z: z2 };
  };

  let time = 0;

  const render = () => {
    if (!document.hidden) {
      time += prefersReduced ? 0.002 : 0.0085;
      smoothMouseX += (mouseX - smoothMouseX) * 0.04;
      smoothMouseY += (mouseY - smoothMouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      const baseRadius = isMobile ? Math.min(width, height) * 0.34 : Math.min(width, height) * 0.32;
      const centerX = isMobile ? width * 0.52 : width * 0.72 - scrollRatio * width * 0.14;
      const centerY = height * 0.48 - scrollRatio * 70;
      const fov = 720;

      const rotY = time * 0.55 + smoothMouseX * 0.55 + scrollRatio * 1.4;
      const rotX = Math.sin(time * 0.35) * 0.25 + smoothMouseY * 0.4;

      // Anillos orbitales 3D suaves
      const drawOrbitalRing = (ringRadius, tiltX, tiltY, color) => {
        ctx.beginPath();
        const segments = 72;
        for (let i = 0; i <= segments; i++) {
          const a = (i / segments) * Math.PI * 2;
          const p0 = {
            x: Math.cos(a) * ringRadius,
            y: Math.sin(a) * ringRadius * 0.22,
            z: Math.sin(a) * ringRadius,
          };
          const pr = rotatePoint(p0.x, p0.y, p0.z, rotX + tiltX, rotY + tiltY);
          const scale = fov / (fov + pr.z + 320);
          const sx = centerX + pr.x * scale;
          const sy = centerY + pr.y * scale;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      drawOrbitalRing(baseRadius * 1.24, 0.55, 0.2, "rgba(192, 132, 252, 0.14)");
      drawOrbitalRing(baseRadius * 1.42, -0.45, -0.6, "rgba(232, 121, 249, 0.11)");

      // Proyectar nodos con respiración orgánica 3D
      const projected = nodes.map((n) => {
        const wave =
          1 +
          0.11 * Math.sin(n.bx * 3.1 + time * 1.6 + n.phase * 0.2) +
          0.09 * Math.cos(n.by * 2.8 - time * 1.3);

        const x = n.bx * baseRadius * wave;
        const y = n.by * baseRadius * wave;
        const z = n.bz * baseRadius * wave;

        const r = rotatePoint(x, y, z, rotX, rotY);
        const scale = fov / (fov + r.z + 320);

        return {
          x: centerX + r.x * scale,
          y: centerY + r.y * scale,
          z: r.z,
          scale,
          hue: n.hue,
        };
      });

      // Conexiones neuronales 3D entre nodos cercanos
      const maxDist = isMobile ? 76 : 96;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const distRatio = 1 - Math.sqrt(distSq) / maxDist;
            const depthRatio = Math.max(0.15, Math.min(1, ((a.scale + b.scale) * 0.5 - 0.55) * 1.7));
            const alpha = distRatio * depthRatio * 0.22;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(192, 132, 252, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Dibujar nodos ordenados por profundidad (painter's algorithm)
      projected.sort((a, b) => a.z - b.z);
      for (const p of projected) {
        const depthAlpha = Math.max(0.18, Math.min(0.95, (p.scale - 0.5) * 1.8));
        const radius = Math.max(1.2, p.scale * 3.1);

        let color = `rgba(246, 242, 235, ${(depthAlpha * 0.88).toFixed(2)})`;
        if (p.hue === "blue") color = `rgba(168, 85, 247, ${depthAlpha.toFixed(2)})`;
        if (p.hue === "violet") color = `rgba(232, 121, 249, ${depthAlpha.toFixed(2)})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    if (!prefersReduced) {
      window.requestAnimationFrame(render);
    }
  };

  render();
}
