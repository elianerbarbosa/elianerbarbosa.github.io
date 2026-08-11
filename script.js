/**
 * Portfólio — Eliane Ramos Barbosa
 * script.js  |  Versão 3.0
 *
 * Módulos:
 *  1. Tipagem animada (hero)
 *  2. Player de áudio
 *  3. Header scroll
 *  4. Menu mobile
 *  5. Carrossel de projetos
 *  6. Formulário de contato
 *  7. Scroll suave
 *  8. Reveal on scroll
 *  9. Highlight de nav ativa
 * 10. Ano no footer
 */

'use strict';

/* ────────────────────────────────────────────────
   UTILITÁRIOS
─────────────────────────────────────────────── */

/**
 * Atalho para document.querySelector
 * @param {string} selector
 * @param {Document|Element} [root=document]
 */
const $ = (selector, root = document) => root.querySelector(selector);

/**
 * Atalho para document.querySelectorAll retornando Array
 * @param {string} selector
 * @param {Document|Element} [root=document]
 */
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Verifica se o usuário prefere movimento reduzido */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ────────────────────────────────────────────────
   1. TIPAGEM ANIMADA
─────────────────────────────────────────────── */
function initTyping() {
  const el = $('.typing-text');
  if (!el) return;

  const fullText = el.dataset.text || el.textContent.trim();
  el.textContent = '';

  // Inserir cursor
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  el.after(cursor);

  if (prefersReducedMotion()) {
    el.textContent = fullText;
    return;
  }

  let i = 0;
  const SPEED = 60; // ms por caractere

  function type() {
    if (i < fullText.length) {
      el.textContent += fullText[i++];
      setTimeout(type, SPEED);
    } else {
      // Cursor continua piscando — nada a fazer
    }
  }

  // Pequena pausa inicial para a página carregar
  setTimeout(type, 400);
}


/* ────────────────────────────────────────────────
   2. PLAYER DE ÁUDIO
─────────────────────────────────────────────── */
function initAudio() {
  const audio      = $('#motivacao-audio');
  const toggleBtn  = $('#toggle-audio');
  const volSlider  = $('#volume-slider');
  const volLabel   = $('#volume-label');
  const motivaSection = $('#motivacao');

  if (!audio || !toggleBtn) return;

  let isPlaying = false;
  let fadeInterval = null;

  /* Estado inicial */
  audio.volume = 0.5;
  audio.currentTime = 42;   // Iniciar no refrão

  /* ── Helpers ── */
  function updateBtn(playing) {
    const icon = toggleBtn.querySelector('i');
    icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
    toggleBtn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproduzir música');
    toggleBtn.setAttribute('aria-pressed', String(playing));
    toggleBtn.classList.toggle('playing', playing);
  }

  function clearFade() {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
  }

  function fadeIn(targetVol = 0.5, stepMs = 80) {
    clearFade();
    audio.volume = 0;
    audio.play().catch(() => {});
    fadeInterval = setInterval(() => {
      if (audio.volume < targetVol - 0.04) {
        audio.volume = Math.min(audio.volume + 0.04, 1);
      } else {
        audio.volume = targetVol;
        clearFade();
      }
    }, stepMs);
  }

  function fadeOut(onDone, stepMs = 80) {
    clearFade();
    fadeInterval = setInterval(() => {
      if (audio.volume > 0.04) {
        audio.volume = Math.max(audio.volume - 0.04, 0);
      } else {
        audio.volume = 0;
        audio.pause();
        clearFade();
        if (typeof onDone === 'function') onDone();
      }
    }, stepMs);
  }

  /* ── Toggle manual ── */
  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      fadeIn(Number(volSlider.value) / 100);
      isPlaying = true;
      updateBtn(true);
    } else {
      fadeOut(() => {
        isPlaying = false;
        updateBtn(false);
      });
    }
  });

  /* ── Volume ── */
  volSlider.addEventListener('input', () => {
    const vol = Number(volSlider.value) / 100;
    audio.volume = vol;
    if (volLabel) volLabel.textContent = `${volSlider.value}%`;
  });

  /* ── Intersection Observer na seção de motivação ── */
  if (motivaSection && 'IntersectionObserver' in window) {
    let triggered = false;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            audio.currentTime = 42;
            fadeIn(Number(volSlider.value) / 100);
            isPlaying = true;
            updateBtn(true);
          } else if (!entry.isIntersecting && isPlaying) {
            fadeOut(() => {
              isPlaying = false;
              triggered = false;
              updateBtn(false);
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    obs.observe(motivaSection);
  }

  /* ── Parar ao ocultar aba ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) {
      fadeOut(() => {
        isPlaying = false;
        updateBtn(false);
      });
    }
  });

  /* ── Tecla Espaço (fora de inputs) ── */
  document.addEventListener('keydown', (e) => {
    if (
      e.code === 'Space' &&
      !e.target.matches('input, textarea, button, [contenteditable]')
    ) {
      e.preventDefault();
      toggleBtn.click();
    }
  });
}


/* ────────────────────────────────────────────────
   3. HEADER — SOMBRA AO ROLAR
─────────────────────────────────────────────── */
function initHeaderScroll() {
  const header = $('.site-header');
  if (!header) return;

  const update = () =>
    header.classList.toggle('scrolled', window.scrollY > 10);

  window.addEventListener('scroll', update, { passive: true });
  update();
}


/* ────────────────────────────────────────────────
   4. MENU MOBILE
─────────────────────────────────────────────── */
function initMenuMobile() {
  const toggle = $('#menu-toggle');
  const nav    = $('#nav-menu');
  if (!toggle || !nav) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => (isOpen ? closeMenu() : openMenu()));

  // Fechar ao clicar em link
  $$('a', nav).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (isOpen && !nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
      toggle.focus();
    }
  });
}


/* ────────────────────────────────────────────────
   5. CARROSSEL
─────────────────────────────────────────────── */
function initCarrossel() {
  const track   = $('#carrossel-track');
  const slides  = $$('.slide', track?.parentElement);
  const dots    = $$('.dot');
  const prevBtn = $('.carrossel-prev');
  const nextBtn = $('.carrossel-next');

  if (!track || slides.length === 0) return;

  let current     = 0;
  let autoTimer   = null;
  const total     = slides.length;
  const INTERVAL  = 5000;

  function goTo(index) {
    current = ((index % total) + total) % total; // wrap
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* Botões */
  prevBtn?.addEventListener('click', () => {
    goTo(current - 1);
    startAuto();
  });

  nextBtn?.addEventListener('click', () => {
    goTo(current + 1);
    startAuto();
  });

  /* Dots */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.slide));
      startAuto();
    });
  });

  /* Swipe (touch) */
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      goTo(delta > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  /* Pausar no hover */
  const wrap = track.closest('.carrossel');
  wrap?.addEventListener('mouseenter', stopAuto);
  wrap?.addEventListener('mouseleave', startAuto);

  /* Init */
  goTo(0);
  startAuto();
}


/* ────────────────────────────────────────────────
   6. FORMULÁRIO DE CONTATO
─────────────────────────────────────────────── */
function initForm() {
  const form = $('.contato-form');
  if (!form) return;

  /* ── Máscara de telefone ── */
  const telInput = $('#telefone');
  if (telInput) {
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
      }
      telInput.value = v;
    });
  }

  /* ── Helpers de erro ── */
  function setError(field, msg) {
    clearError(field);
    field.classList.add('is-invalid');
    field.setAttribute('aria-describedby', `err-${field.id}`);

    const div = document.createElement('p');
    div.id = `err-${field.id}`;
    div.className = 'field-error';
    div.setAttribute('role', 'alert');
    div.innerHTML = `<i class="fas fa-circle-exclamation" aria-hidden="true"></i> ${msg}`;
    field.parentNode.appendChild(div);
  }

  function clearError(field) {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-describedby');
    const errEl = field.parentNode.querySelector('.field-error');
    errEl?.remove();
  }

  /* ── Limpar ao digitar ── */
  $$('input, textarea', form).forEach((f) => {
    f.addEventListener('input', () => clearError(f));
    f.addEventListener('blur',  () => {
      if (f.required && !f.value.trim()) {
        setError(f, 'Este campo é obrigatório.');
      }
    });
  });

  /* ── Submit ── */
  form.addEventListener('submit', (e) => {
    let valid = true;

    /* Validar campos obrigatórios */
    $$('[required]', form).forEach((field) => {
      if (!field.value.trim()) {
        setError(field, 'Este campo é obrigatório.');
        valid = false;
      } else if (field.type === 'email') {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!re.test(field.value)) {
          setError(field, 'Por favor, insira um e-mail válido.');
          valid = false;
        }
      }
    });

    if (!valid) {
      e.preventDefault();
      const firstError = form.querySelector('.is-invalid');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError?.focus();
      return;
    }

    /* Feedback visual de envio */
    const submitBtn = form.querySelector('.btn-submit');
    const span      = submitBtn.querySelector('span');

    submitBtn.classList.add('loading');
    submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
    if (span) span.textContent = 'Enviando…';
  });
}


/* ────────────────────────────────────────────────
   7. SCROLL SUAVE (fallback para âncoras)
─────────────────────────────────────────────── */
function initSmoothScroll() {
  // CSS scroll-behavior: smooth já cuida disso na maioria dos navegadores.
  // Este fallback garante o comportamento correto com o offset do header.
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* ────────────────────────────────────────────────
   8. REVEAL ON SCROLL
─────────────────────────────────────────────── */
function initReveal() {
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    // Exibir tudo sem animação
    $$('[data-reveal]').forEach((el) => el.classList.add('revealed'));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  $$('[data-reveal]').forEach((el) => obs.observe(el));

  /* Marcar elementos sem data-reveal que também devem animar */
  const selectors = [
    '.card',
    '.projeto-card',
    '.quote-card',
    '.sobre-bio p',
    '.hero-stats .stat',
    '.detail-item',
    '.contato-links li',
  ];

  selectors.forEach((sel) => {
    $$(sel).forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
        el.setAttribute('data-reveal-delay', Math.min(i + 1, 5).toString());
        obs.observe(el);
      }
    });
  });
}


/* ────────────────────────────────────────────────
   9. HIGHLIGHT NAV ATIVA
─────────────────────────────────────────────── */
function initNavHighlight() {
  const sections = $$('section[id]');
  const links    = $$('.primary-nav a[href^="#"]');

  if (!sections.length || !links.length) return;

  const HEADER_OFFSET = 80;

  function highlight() {
    const scrollY = window.scrollY + HEADER_OFFSET;
    let current = '';

    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      link.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  window.addEventListener('scroll', highlight, { passive: true });
  highlight();
}


/* ────────────────────────────────────────────────
   10. ANO DINÂMICO NO FOOTER
─────────────────────────────────────────────── */
function initFooterYear() {
  const span = $('#ano-atual');
  if (span) span.textContent = new Date().getFullYear();
}


/* ────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTyping();
  initAudio();
  initHeaderScroll();
  initMenuMobile();
  initCarrossel();
  initForm();
  initSmoothScroll();
  initReveal();
  initNavHighlight();
  initFooterYear();

  console.info('%c✨ Portfólio de Eliane Ramos Barbosa — v3.0', 'color:#00c8e0;font-weight:700;');
});
