/* ============================================================
   STACKLY — Premium Construction Website JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR ─────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    handleScrollTop();
  }, { passive: true });

  /* Mark the active nav link by matching the current page filename */
  (function setActiveNavLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0];
      if (!href) return;
      const linkPage = href.split('/').pop();
      if (linkPage === page || (page === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

  /* ── MOBILE MENU ─────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOverlay = document.querySelector('.menu-overlay');

  if (!menuOverlay) {
    menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
  }

  function openMenu() {
    mobileMenu?.classList.add('open');
    menuOverlay?.classList.add('active');
    navToggle?.classList.add('active');
    const icon = navToggle?.querySelector('i');
    if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu?.classList.remove('open');
    menuOverlay?.classList.remove('active');
    navToggle?.classList.remove('active');
    const icon = navToggle?.querySelector('i');
    if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click', () => {
    mobileMenu?.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuOverlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));

  /* ── SMOOTH SCROLL ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 8 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMenu();
      }
    });
  });

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || (i % 4) * 120;
        setTimeout(() => el.classList.add('revealed'), Number(delay));
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, i) => {
    el.dataset.delay = (i % 6) * 100;
    revealObs.observe(el);
  });

  /* ── COUNTER ANIMATION ───────────────────────────────────── */
  const counters = document.querySelectorAll('.counter');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObs.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = 16;
    const totalSteps = duration / step;
    let current = 0;
    const increment = target / totalSteps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  /* ── ABOUT TABS ──────────────────────────────────────────── */
  const mvvTabs = document.querySelectorAll('.mvv-tab');
  const mvvPanels = document.querySelectorAll('.mvv-panel');

  mvvTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mvvTabs.forEach(t => t.classList.remove('active'));
      mvvPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      target?.classList.add('active');
    });
  });

  /* ── PROJECT FILTER ──────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          card.style.display = 'block';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => { card.style.display = 'none'; }, 400);
        }
      });
    });
  });

  /* ── TESTIMONIALS SLIDER ─────────────────────────────────── */
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let autoSlide;
    const perView = window.innerWidth <= 768 ? 1 : 2;
    const total = Math.ceil(cards.length / perView);

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      current = (index + total) % total;
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
      document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAuto() { clearInterval(autoSlide); }

    buildDots();
    startAuto();
    prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    window.addEventListener('resize', () => {
      clearTimeout(window._sliderResize);
      window._sliderResize = setTimeout(() => { buildDots(); goTo(0); }, 200);
    });
  }

  /* ── CONTACT FORM VALIDATION ─────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      function validate(id, errorId, check, msg) {
        const el = document.getElementById(id);
        const err = document.getElementById(errorId);
        if (!el || !err) return;
        if (!check(el.value.trim())) {
          err.textContent = msg;
          el.classList.add('error');
          valid = false;
        } else {
          err.textContent = '';
          el.classList.remove('error');
        }
      }

      validate('firstName', 'firstNameError', v => v.length >= 2, 'First name must be at least 2 characters.');
      validate('lastName', 'lastNameError', v => v.length >= 2, 'Last name must be at least 2 characters.');
      validate('email', 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.');
      validate('phone', 'phoneError', v => /^[\d\s\+\-\(\)]{7,15}$/.test(v), 'Enter a valid phone number.');
      validate('message', 'messageError', v => v.length >= 20, 'Please provide at least 20 characters about your project.');

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const successEl = document.getElementById('formSuccess');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
        setTimeout(() => {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          }
          successEl?.classList.add('show');
          contactForm.reset();
          setTimeout(() => successEl?.classList.remove('show'), 5000);
        }, 1800);
      }
    });

    ['firstName','lastName','email','phone','message'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        document.getElementById(id)?.classList.remove('error');
        const errEl = document.getElementById(id + 'Error');
        if (errEl) errEl.textContent = '';
      });
    });
  }

  /* ── SCROLL TO TOP ───────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');

  function handleScrollTop() {
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  }

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── RIPPLE EFFECT ───────────────────────────────────────── */
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ── PARALLAX HERO ───────────────────────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
      if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.12}px)`;
    }
  }, { passive: true });

  /* ── HERO PARTICLE CANVAS ────────────────────────────────── */
  (function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.4;';
    document.querySelector('.hero-bg')?.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      const p = {
        x: 0, y: 0, vx: 0, vy: 0, size: 1, alpha: 0.5, life: 0, maxLife: 300,
        reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = -Math.random() * 0.6 - 0.2;
          this.size = Math.random() * 1.5 + 0.5;
          this.alpha = Math.random() * 0.6 + 0.2;
          this.life = 0;
          this.maxLife = Math.random() * 300 + 200;
        },
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life++;
          if (this.life > this.maxLife || this.y < -10) this.reset();
        },
        draw() {
          const fade = this.life < 60 ? this.life / 60
            : this.life > this.maxLife - 60 ? (this.maxLife - this.life) / 60
            : 1;
          ctx.globalAlpha = this.alpha * fade;
          ctx.fillStyle = '#F5A623';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      p.reset();
      return p;
    }

    function init() {
      particles = Array.from({ length: 60 }, makeParticle);
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(loop);
    }

    resize();
    init();
    loop();
    window.addEventListener('resize', () => { clearTimeout(window._pr); window._pr = setTimeout(() => { resize(); init(); }, 200); });
  })();

  /* ── SERVICES CARD HOVER TILT ────────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── STAT CARDS STAGGER ──────────────────────────────────── */
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-card').forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 150);
        });
        statObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    document.querySelectorAll('.stat-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    statObs.observe(statsSection);
  }

  /* ── NAVBAR LINK HIGHLIGHT ON PAGE ───────────────────────── */
  const page = window.location.pathname.split('/').pop();
  if (page === 'login.html' || page === 'signup.html') {
    document.querySelector('.btn-nav-login')?.classList.toggle('active-auth', page === 'login.html');
    document.querySelector('.btn-nav-signup')?.classList.toggle('active-auth', page === 'signup.html');
  }

  /* ── AUTH FORM: LOGIN ────────────────────────────────────── */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const pwdInput = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('toggleLoginPwd');

    toggleBtn?.addEventListener('click', () => {
      const isText = pwdInput.type === 'text';
      pwdInput.type = isText ? 'password' : 'text';
      toggleBtn.innerHTML = isText ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const alert = document.getElementById('loginAlert');
      let valid = true;

      function vField(id, errId, check, msg) {
        const el = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!check(el?.value?.trim() || '')) {
          if (err) err.textContent = msg;
          el?.classList.add('error');
          valid = false;
        } else {
          if (err) err.textContent = '';
          el?.classList.remove('error');
        }
      }

      vField('loginRole', 'loginRoleError', v => v !== '', 'Please select your role.');
      vField('loginEmail', 'loginEmailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email.');
      vField('loginPassword', 'loginPasswordError', v => v.length >= 6, 'Password must be at least 6 characters.');

      if (valid) {
        const btn = loginForm.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        }
        setTimeout(() => {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
          }
          if (alert) {
            alert.className = 'auth-alert success show';
            alert.innerHTML = '<i class="fas fa-check-circle"></i> Login successful! Redirecting...';
          }
        }, 1800);
      }
    });
  }

  /* ── AUTH FORM: SIGNUP ───────────────────────────────────── */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const pwdInput = document.getElementById('signupPassword');
    const toggleBtn = document.getElementById('toggleSignupPwd');
    const confirmInput = document.getElementById('signupConfirm');
    const toggleConfirm = document.getElementById('toggleConfirmPwd');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    toggleBtn?.addEventListener('click', () => {
      const isText = pwdInput.type === 'text';
      pwdInput.type = isText ? 'password' : 'text';
      toggleBtn.innerHTML = isText ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    toggleConfirm?.addEventListener('click', () => {
      const isText = confirmInput.type === 'text';
      confirmInput.type = isText ? 'password' : 'text';
      toggleConfirm.innerHTML = isText ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    pwdInput?.addEventListener('input', () => {
      const val = pwdInput.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;
      const colors = ['#e53e3e','#dd6b20','#d69e2e','#38a169'];
      const labels = ['Weak','Fair','Good','Strong'];
      const pct = (strength / 4) * 100;
      if (strengthBar) { strengthBar.style.width = pct + '%'; strengthBar.style.background = colors[strength - 1] || '#e2e8f0'; }
      if (strengthText) strengthText.textContent = strength > 0 ? labels[strength - 1] : '';
    });

    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      function vField(id, errId, check, msg) {
        const el = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!check(el?.value?.trim() || '')) {
          if (err) err.textContent = msg;
          el?.classList.add('error');
          valid = false;
        } else {
          if (err) err.textContent = '';
          el?.classList.remove('error');
        }
      }

      vField('signupRole', 'signupRoleError', v => v !== '', 'Please select your role.');
      vField('signupName', 'signupNameError', v => v.length >= 3, 'Full name must be at least 3 characters.');
      vField('signupEmail', 'signupEmailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.');
      vField('signupPassword', 'signupPasswordError', v => v.length >= 8, 'Password must be at least 8 characters.');

      const pwd = document.getElementById('signupPassword')?.value;
      const conf = document.getElementById('signupConfirm')?.value;
      const confErr = document.getElementById('signupConfirmError');
      const confEl = document.getElementById('signupConfirm');
      if (pwd !== conf) {
        if (confErr) confErr.textContent = 'Passwords do not match.';
        confEl?.classList.add('error');
        valid = false;
      } else {
        if (confErr) confErr.textContent = '';
        confEl?.classList.remove('error');
      }

      const terms = document.getElementById('termsCheck');
      const termsErr = document.getElementById('termsError');
      if (terms && !terms.checked) {
        if (termsErr) termsErr.textContent = 'You must accept the terms to proceed.';
        valid = false;
      } else {
        if (termsErr) termsErr.textContent = '';
      }

      if (valid) {
        const btn = signupForm.querySelector('button[type="submit"]');
        const alert = document.getElementById('signupAlert');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        }
        setTimeout(() => {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
          }
          if (alert) {
            alert.className = 'auth-alert success show';
            alert.innerHTML = '<i class="fas fa-check-circle"></i> Account created! Welcome to STACKLY.';
          }
          signupForm.reset();
          if (strengthBar) strengthBar.style.width = '0';
          if (strengthText) strengthText.textContent = '';
        }, 1800);
      }
    });
  }

  /* ── FLOATING LABEL INPUTS ───────────────────────────────── */
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
    el.addEventListener('focus', () => el.parentElement?.classList.add('focused'));
    el.addEventListener('blur', () => {
      if (!el.value) el.parentElement?.classList.remove('focused');
    });
  });

  /* ── INIT ────────────────────────────────────────────────── */
  handleScrollTop();
  updateActiveLink();
});
