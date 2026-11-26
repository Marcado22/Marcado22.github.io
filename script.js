/* ==========================================================================
   Marcos Lozano Marín — Interactividad del CV Web (Optimizada y Fluida)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initDynamicDates();
  initScrollEffects();
  initMobileMenu();
  initRoleRotator();
  initExperienceFilters();
  initScrollReveal();
  initPrintCV();
  initCopyEmail();
  initContactForm();
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
  if (ageEl && age > 0) ageEl.textContent = String(age);

  const heroAgeEl = document.getElementById("hero-age");
  if (heroAgeEl && age > 0) heroAgeEl.textContent = String(age);

  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = String(today.getFullYear());
}

/* 2. Navbar, enlace activo y barra de progreso (unificados con rAF y caché) */
function initScrollEffects() {
  const navbar = document.getElementById("navbar");
  const bar = document.getElementById("scroll-progress");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      return target ? { id: link.getAttribute("href"), el: target, top: 0 } : null;
    })
    .filter(Boolean);

  let maxScroll = 1;
  let ticking = false;
  let lastActiveId = "";

  const measure = () => {
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    sections.forEach((sec) => {
      sec.top = sec.el.offsetTop;
    });
  };

  const update = () => {
    ticking = false;
    const y = window.scrollY;

    if (navbar) {
      navbar.classList.toggle("is-scrolled", y > 24);
    }

    if (bar) {
      const progress = Math.min(Math.max(y / maxScroll, 0), 1);
      bar.style.transform = `scaleX(${progress})`;
    }

    const scrollPos = y + 150;
    let activeId = "";
    for (let i = 0; i < sections.length; i++) {
      if (scrollPos >= sections[i].top) {
        activeId = sections[i].id;
      }
    }

    if (activeId !== lastActiveId) {
      lastActiveId = activeId;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === activeId);
      });
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  measure();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      measure();
      onScroll();
    },
    { passive: true }
  );
  window.addEventListener("load", () => {
    measure();
    update();
  });
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

/* 4. Rotación suave de texto de especialidad en el Hero */
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
    charIndex += isDeleting ? -1 : 1;
    el.textContent = current.slice(0, charIndex);

    let delay = isDeleting ? 42 : 75;
    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 340;
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

/* 6. Animaciones de aparición suaves al hacer scroll */
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
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* 7. Botón de imprimir / guardar como PDF */
function initPrintCV() {
  const btn = document.getElementById("print-cv-btn");
  if (!btn) return;
  btn.addEventListener("click", () => window.print());
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
