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
      const hash = anchor.getAttribute('href').replace('#', '');
      const target = document.getElementById(hash);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 8 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMenu();
      } else {
        // Check if hash matches a project filter button
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
        if (filterBtn) {
          e.preventDefault();
          filterBtn.click();
          const filterBar = document.querySelector('.project-filters');
          if (filterBar) {
            const offset = navbar ? navbar.offsetHeight + 8 : 80;
            const top = filterBar.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
          closeMenu();
        }
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

  /* ── HASH-BASED NAVIGATION ───────────────────────────────── */
  (function handleHashNavigation() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    // Projects page: activate matching filter button then scroll to filter bar
    const matchingFilter = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
    if (matchingFilter) {
      setTimeout(() => {
        matchingFilter.click();
        const filterBar = document.querySelector('.project-filters');
        if (filterBar) {
          const offset = navbar ? navbar.offsetHeight + 8 : 80;
          const top = filterBar.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 200);
      return;
    }

    // Services / other pages: scroll to the element with that id
    const target = document.getElementById(hash);
    if (target) {
      setTimeout(() => {
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 300);
    }
  })();

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

    function cfSetErr(id, errId, msg) {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (el)  { el.style.borderColor = '#fc8181'; el.style.boxShadow = '0 0 0 3px rgba(252,129,129,0.2)'; el.classList.add('error'); }
      if (err) err.textContent = msg;
    }
    function cfClrErr(id, errId) {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (el)  { el.style.borderColor = ''; el.style.boxShadow = ''; el.classList.remove('error'); }
      if (err) err.textContent = '';
    }

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      /* First Name */
      const fn = document.getElementById('firstName').value.trim();
      if (!fn) {
        cfSetErr('firstName','firstNameError','First name is required.');
        valid = false;
      } else if (fn.length < 3) {
        cfSetErr('firstName','firstNameError','First name must be at least 3 characters.');
        valid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(fn)) {
        cfSetErr('firstName','firstNameError','First name can only contain letters and spaces.');
        valid = false;
      } else { cfClrErr('firstName','firstNameError'); }

      /* Last Name */
      const ln = document.getElementById('lastName').value.trim();
      if (!ln) {
        cfSetErr('lastName','lastNameError','Last name is required.');
        valid = false;
      } else if (ln.length < 3) {
        cfSetErr('lastName','lastNameError','Last name must be at least 3 characters.');
        valid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(ln)) {
        cfSetErr('lastName','lastNameError','Last name can only contain letters and spaces.');
        valid = false;
      } else { cfClrErr('lastName','lastNameError'); }

      /* Email */
      const em = document.getElementById('email').value.trim();
      if (!em) {
        cfSetErr('email','emailError','Email address is required.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        cfSetErr('email','emailError','Please enter a valid email address (e.g. you@example.com).');
        valid = false;
      } else { cfClrErr('email','emailError'); }

      /* Phone — digits only, 10–12 digits */
      const ph       = document.getElementById('phone').value.trim();
      const phDigits = ph.replace(/\s/g, '');
      if (!ph) {
        cfSetErr('phone','phoneError','Phone number is required.');
        valid = false;
      } else if (!/^\d+$/.test(phDigits)) {
        cfSetErr('phone','phoneError','Phone number must contain numbers only.');
        valid = false;
      } else if (phDigits.length < 10) {
        cfSetErr('phone','phoneError','Phone number must be at least 10 digits.');
        valid = false;
      } else if (phDigits.length > 12) {
        cfSetErr('phone','phoneError','Phone number must not exceed 12 digits.');
        valid = false;
      } else { cfClrErr('phone','phoneError'); }

      /* Message */
      const msg = document.getElementById('message').value.trim();
      if (!msg) {
        cfSetErr('message','messageError','Project details are required.');        valid = false;
      } else if (msg.length < 20) {
        cfSetErr('message','messageError','Please provide at least 20 characters describing your project.'); valid = false;
      } else { cfClrErr('message','messageError'); }

      if (!valid) return;

      const btn = contactForm.querySelector('button[type="submit"]');
      const successEl = document.getElementById('formSuccess');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; }

      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
        successEl?.classList.add('show');
        contactForm.reset();
        ['firstName','lastName','email','phone','message'].forEach(fid => {
          const fel = document.getElementById(fid);
          if (fel) { fel.style.borderColor = ''; fel.style.boxShadow = ''; fel.classList.remove('error'); }
        });
        setTimeout(() => successEl?.classList.remove('show'), 5000);
      }, 1800);
    });

    /* Real-time error clearing */
    ['firstName','lastName','email','phone','message'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => cfClrErr(id, id + 'Error'));
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

  /* ── AUTH HELPERS ────────────────────────────────────────── */

  /* Sanitize input: strip tags and dangerous patterns */
  function sanitize(str) {
    return String(str)
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[<>"'`]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'})[c]);
  }

  /* Toast notification */
  function showToast(msg, type) {
    let t = document.getElementById('stacklyToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'stacklyToast';
      t.className = 'stackly-toast';
      document.body.appendChild(t);
    }
    t.className = `stackly-toast toast-${type}`;
    t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  /* Get the .field-wrap parent of an input (where border/shadow live) */
  function getWrap(id) {
    const el = document.getElementById(id);
    return el?.closest('.field-wrap') || el;
  }

  function authSetErr(id, errId, msg) {
    const wrap = getWrap(id);
    const err  = document.getElementById(errId);
    if (wrap) { wrap.classList.remove('field-success'); wrap.classList.add('field-error-state'); }
    if (err)  { err.textContent = msg; err.style.color = ''; }
  }
  function authClrErr(id, errId) {
    const wrap = getWrap(id);
    const err  = document.getElementById(errId);
    if (wrap) wrap.classList.remove('field-error-state', 'field-success');
    if (err)  { err.textContent = ''; err.style.color = ''; }
  }
  function authSetSuccess(id, errId) {
    const wrap = getWrap(id);
    const err  = document.getElementById(errId);
    if (wrap) { wrap.classList.remove('field-error-state'); wrap.classList.add('field-success'); }
    if (err)  { err.textContent = ''; err.style.color = ''; }
  }

  /* ── AUTH FORM: LOGIN ────────────────────────────────────── */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const loginPwdEl  = document.getElementById('loginPassword');
    const loginToggle = document.getElementById('toggleLoginPwd');
    const loginBtn    = loginForm.querySelector('button[type="submit"]');

    /* Start with button disabled */
    if (loginBtn) loginBtn.disabled = true;

    /* Password toggle */
    loginToggle?.addEventListener('click', () => {
      const show = loginPwdEl.type === 'password';
      loginPwdEl.type = show ? 'text' : 'password';
      loginToggle.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    /* Ensure form starts empty on every page load */
    const _emailEl = document.getElementById('loginEmail');
    const _remEl   = document.getElementById('rememberMe');
    if (_emailEl) _emailEl.value = '';
    if (_remEl)   _remEl.checked = false;

    /* Check fields (excluding checkbox) → enable/disable button */
    function refreshLoginBtn() {
      const role  = document.getElementById('loginRole')?.value;
      const email = (document.getElementById('loginEmail')?.value || '').trim();
      const pwd   = loginPwdEl?.value || '';
      const ok = role &&
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                 pwd.length >= 8 && pwd.length <= 32;
      if (loginBtn) loginBtn.disabled = !ok;
    }

    /* Field validators */
    function validateLEmail(showSuccess) {
      const raw   = document.getElementById('loginEmail')?.value || '';
      const email = raw.trim();
      /* Auto-trim */
      if (raw !== email) document.getElementById('loginEmail').value = email;
      if (!email) {
        authSetErr('loginEmail', 'loginEmailError', 'Email address is required.');
        return false;
      }
      if (/\s/.test(email)) {
        authSetErr('loginEmail', 'loginEmailError', 'Email cannot contain spaces.');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        authSetErr('loginEmail', 'loginEmailError', 'Please enter a valid email address.');
        return false;
      }
      showSuccess ? authSetSuccess('loginEmail', 'loginEmailError') : authClrErr('loginEmail', 'loginEmailError');
      return true;
    }

    function validateLPassword(showSuccess) {
      const pwd = loginPwdEl?.value || '';
      if (!pwd) {
        authSetErr('loginPassword', 'loginPasswordError', 'Password is required.');
        return false;
      }
      if (pwd.length < 8) {
        authSetErr('loginPassword', 'loginPasswordError', 'Password must contain at least 8 characters.');
        return false;
      }
      if (pwd.length > 32) {
        authSetErr('loginPassword', 'loginPasswordError', 'Password must not exceed 32 characters.');
        return false;
      }
      showSuccess ? authSetSuccess('loginPassword', 'loginPasswordError') : authClrErr('loginPassword', 'loginPasswordError');
      return true;
    }

    /* Real-time listeners */
    document.getElementById('loginRole')?.addEventListener('change', () => {
      const role = document.getElementById('loginRole')?.value;
      if (role) authSetSuccess('loginRole', 'loginRoleError');
      else      authSetErr('loginRole', 'loginRoleError', 'Please select your access type.');
      refreshLoginBtn();
    });

    document.getElementById('loginEmail')?.addEventListener('input', () => {
      if (document.getElementById('loginEmail').value.trim()) validateLEmail(false);
      else authClrErr('loginEmail', 'loginEmailError');
      refreshLoginBtn();
    });
    document.getElementById('loginEmail')?.addEventListener('blur', () => {
      if (document.getElementById('loginEmail').value.trim()) validateLEmail(true);
      refreshLoginBtn();
    });

    loginPwdEl?.addEventListener('input', () => {
      if (loginPwdEl.value) validateLPassword(false);
      else authClrErr('loginPassword', 'loginPasswordError');
      refreshLoginBtn();
    });
    loginPwdEl?.addEventListener('blur', () => {
      if (loginPwdEl.value) validateLPassword(true);
      refreshLoginBtn();
    });

    document.getElementById('rememberMe')?.addEventListener('change', () => {
      if (document.getElementById('rememberMe').checked)
        document.getElementById('rememberMeError').textContent = '';
      refreshLoginBtn();
    });

    /* Submit */
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const alertEl = document.getElementById('loginAlert');
      if (alertEl) { alertEl.className = 'auth-alert'; alertEl.innerHTML = ''; }

      let valid = true;

      const role = document.getElementById('loginRole')?.value;
      if (!role) {
        authSetErr('loginRole', 'loginRoleError', 'Please select your access type.');
        valid = false;
      } else { authSetSuccess('loginRole', 'loginRoleError'); }

      if (!validateLEmail(true))    valid = false;
      if (!validateLPassword(true)) valid = false;

      /* Remember Me checkbox */
      const rememberEl  = document.getElementById('rememberMe');
      const rememberErr = document.getElementById('rememberMeError');
      if (rememberEl && !rememberEl.checked) {
        rememberErr.textContent = 'Please check the checkbox to continue.';
        valid = false;
      } else {
        if (rememberErr) rememberErr.textContent = '';
      }

      if (!valid) {
        loginForm.querySelector('.field-error-state')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const email = sanitize(document.getElementById('loginEmail').value.trim());
      const msgs  = ['Signing In...', 'Authenticating...', 'Please Wait...'];
      const lmsg  = msgs[Math.floor(Math.random() * msgs.length)];

      if (loginBtn) { loginBtn.disabled = true; loginBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${lmsg}`; }

      const remEl = document.getElementById('rememberMe');
      localStorage.removeItem('stackly_remember_email');

      sessionStorage.setItem('stackly_role',  role);
      sessionStorage.setItem('stackly_email', email);

      /* Immediately clear email, password, checkbox and all field states */
      const emailField  = document.getElementById('loginEmail');
      const pwdField    = loginPwdEl;
      const remErrField = document.getElementById('rememberMeError');
      if (emailField) { emailField.value = ''; }
      if (pwdField)   { pwdField.value = ''; }
      if (remEl)      { remEl.checked = false; }
      if (remErrField)  remErrField.textContent = '';
      /* Remove all field-wrap visual states */
      loginForm.querySelectorAll('.field-wrap').forEach(w => w.classList.remove('field-success', 'field-error-state'));
      document.getElementById('loginEmailError').textContent    = '';
      document.getElementById('loginPasswordError').textContent = '';
      refreshLoginBtn();

      setTimeout(() => {
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
        }, 1000);
      }, 1400);
    });
  }

  /* ── AUTH FORM: SIGNUP ───────────────────────────────────── */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const signupPwdEl   = document.getElementById('signupPassword');
    const signupToggle  = document.getElementById('toggleSignupPwd');
    const confirmEl     = document.getElementById('signupConfirm');
    const confirmToggle = document.getElementById('toggleConfirmPwd');
    const strengthBar   = document.querySelector('.strength-fill');
    const strengthText  = document.querySelector('.strength-text');
    const PWD_REGEX     = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const signupBtn = signupForm.querySelector('button[type="submit"]');

    /* Password toggles */
    signupToggle?.addEventListener('click', () => {
      const show = signupPwdEl.type === 'password';
      signupPwdEl.type = show ? 'text' : 'password';
      signupToggle.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
    confirmToggle?.addEventListener('click', () => {
      const show = confirmEl.type === 'password';
      confirmEl.type = show ? 'text' : 'password';
      confirmToggle.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    /* Live requirements checker */
    function setReq(reqId, met) {
      const el = document.getElementById(reqId);
      if (!el) return;
      el.classList.toggle('met', met);
      const icon = el.querySelector('i');
      if (icon) icon.className = met ? 'fas fa-check-circle' : 'fas fa-circle';
    }

    /* Strength meter + requirements */
    function updateStrength(val) {
      const hasLen  = val.length >= 8;
      const hasUp   = /[A-Z]/.test(val);
      const hasLow  = /[a-z]/.test(val);
      const hasNum  = /\d/.test(val);
      const hasSpec = /[@$!%*?&]/.test(val);
      setReq('req-length',  hasLen);
      setReq('req-upper',   hasUp);
      setReq('req-lower',   hasLow);
      setReq('req-number',  hasNum);
      setReq('req-special', hasSpec);
      const score  = [hasLen, hasUp, hasLow, hasNum, hasSpec].filter(Boolean).length;
      const levels = [
        { label: '',            pct: 0,   color: '#e2e8f0' },
        { label: 'Weak',        pct: 20,  color: '#e53e3e' },
        { label: 'Weak',        pct: 40,  color: '#dd6b20' },
        { label: 'Medium',      pct: 60,  color: '#d69e2e' },
        { label: 'Strong',      pct: 80,  color: '#68d391' },
        { label: 'Very Strong', pct: 100, color: '#38a169' },
      ];
      const lv = val ? levels[score] : levels[0];
      if (strengthBar)  { strengthBar.style.width = lv.pct + '%'; strengthBar.style.background = lv.color; }
      if (strengthText) strengthText.textContent = lv.label;
    }

    /* Individual field validators */
    function valName(showSuccess) {
      const raw  = document.getElementById('signupName')?.value || '';
      const name = raw.trim();
      if (!name)          { authSetErr('signupName','signupNameError','Full name is required.');                   return false; }
      if (name.length < 3) { authSetErr('signupName','signupNameError','Full name must be at least 3 characters.'); return false; }
      if (name.length > 50){ authSetErr('signupName','signupNameError','Full name must not exceed 50 characters.');  return false; }
      if (/\d/.test(name)) { authSetErr('signupName','signupNameError','Numbers are not allowed in name.');          return false; }
      if (!/^[A-Za-z\s]+$/.test(name)) { authSetErr('signupName','signupNameError','Enter a valid name.'); return false; }
      showSuccess ? authSetSuccess('signupName','signupNameError') : authClrErr('signupName','signupNameError');
      return true;
    }

    function valEmail(showSuccess) {
      const raw   = document.getElementById('signupEmail')?.value || '';
      const email = raw.toLowerCase().trim();
      document.getElementById('signupEmail').value = raw.toLowerCase();
      if (!email)           { authSetErr('signupEmail','signupEmailError','Email address is required.');   return false; }
      if (/\s/.test(email)) { authSetErr('signupEmail','signupEmailError','Email cannot contain spaces.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        authSetErr('signupEmail','signupEmailError','Enter a valid email address.');
        return false;
      }
      showSuccess ? authSetSuccess('signupEmail','signupEmailError') : authClrErr('signupEmail','signupEmailError');
      return true;
    }

    function valPhone(showSuccess) {
      const ph = (document.getElementById('signupPhone')?.value || '').trim();
      if (!ph)                     { authSetErr('signupPhone','signupPhoneError','Phone number is required.');            return false; }
      if (!/^\d+$/.test(ph))       { authSetErr('signupPhone','signupPhoneError','Enter a valid phone number.');          return false; }
      if (ph.length < 10 || ph.length > 15) {
        authSetErr('signupPhone','signupPhoneError','Phone number must contain 10–15 digits.');
        return false;
      }
      showSuccess ? authSetSuccess('signupPhone','signupPhoneError') : authClrErr('signupPhone','signupPhoneError');
      return true;
    }

    function valPassword(showSuccess) {
      const pwd = signupPwdEl?.value || '';
      if (!pwd) { authSetErr('signupPassword','signupPasswordError','Password is required.'); return false; }
      if (!PWD_REGEX.test(pwd)) {
        authSetErr('signupPassword','signupPasswordError','Password must meet all the requirements below.');
        return false;
      }
      showSuccess ? authSetSuccess('signupPassword','signupPasswordError') : authClrErr('signupPassword','signupPasswordError');
      return true;
    }

    function valConfirm(showSuccess) {
      const conf    = confirmEl?.value || '';
      const pwd     = signupPwdEl?.value || '';
      const confErr = document.getElementById('signupConfirmError');
      if (!conf) {
        authSetErr('signupConfirm','signupConfirmError','Confirm your password.');
        if (confErr) confErr.style.color = '';
        return false;
      }
      if (conf !== pwd) {
        authSetErr('signupConfirm','signupConfirmError','Passwords do not match.');
        if (confErr) confErr.style.color = '';
        return false;
      }
      const wrap = getWrap('signupConfirm');
      if (wrap) { wrap.classList.remove('field-error-state'); if (showSuccess) wrap.classList.add('field-success'); }
      if (confErr) { confErr.textContent = showSuccess ? '✓ Passwords match.' : ''; confErr.style.color = '#38a169'; }
      return true;
    }

    /* Real-time listeners */
    signupPwdEl?.addEventListener('input', () => {
      updateStrength(signupPwdEl.value);
      if (signupPwdEl.value) valPassword(false); else authClrErr('signupPassword','signupPasswordError');
      if (confirmEl?.value) valConfirm(false);
    });
    signupPwdEl?.addEventListener('blur', () => { if (signupPwdEl.value) valPassword(true); });

    document.getElementById('signupName')?.addEventListener('input',  () => { if (document.getElementById('signupName').value.trim()) valName(false); else authClrErr('signupName','signupNameError'); });
    document.getElementById('signupName')?.addEventListener('blur',   () => { if (document.getElementById('signupName').value.trim()) valName(true); });

    document.getElementById('signupEmail')?.addEventListener('input', () => { if (document.getElementById('signupEmail').value) valEmail(false); else authClrErr('signupEmail','signupEmailError'); });
    document.getElementById('signupEmail')?.addEventListener('blur',  () => { if (document.getElementById('signupEmail').value) valEmail(true); });

    document.getElementById('signupPhone')?.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
      if (e.target.value) valPhone(false); else authClrErr('signupPhone','signupPhoneError');
    });
    document.getElementById('signupPhone')?.addEventListener('blur',  () => { if (document.getElementById('signupPhone').value) valPhone(true); });

    confirmEl?.addEventListener('input', () => {
      if (confirmEl.value) valConfirm(false);
      else { authClrErr('signupConfirm','signupConfirmError'); document.getElementById('signupConfirmError').style.color = ''; }
    });
    confirmEl?.addEventListener('blur',  () => { if (confirmEl.value) valConfirm(true); });

    document.getElementById('termsCheck')?.addEventListener('change', () => {
      document.getElementById('termsError').textContent = '';
      document.getElementById('termsCheck').closest('.checkbox-wrap').style.color = '';
    });

    /* Submit */
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      let firstEl = null;

      /* Role */
      const role = document.getElementById('signupRole')?.value;
      if (!role) {
        document.getElementById('signupRoleError').textContent = 'Please select an account type.';
        valid = false;
        if (!firstEl) firstEl = document.getElementById('signupRoleError');
      } else {
        document.getElementById('signupRoleError').textContent = '';
      }

      if (!valName(true))     { valid = false; if (!firstEl) firstEl = document.getElementById('signupName'); }
      if (!valEmail(true))    { valid = false; if (!firstEl) firstEl = document.getElementById('signupEmail'); }
      if (!valPhone(true))    { valid = false; if (!firstEl) firstEl = document.getElementById('signupPhone'); }
      if (!valPassword(true)) { valid = false; if (!firstEl) firstEl = document.getElementById('signupPassword'); }
      if (!valConfirm(true))  { valid = false; if (!firstEl) firstEl = document.getElementById('signupConfirm'); }

      /* Terms */
      const termsEl  = document.getElementById('termsCheck');
      const termsErr = document.getElementById('termsError');
      if (termsEl && !termsEl.checked) {
        termsErr.textContent = 'Please accept the Terms of Service and Privacy Policy.';
        termsEl.closest('.checkbox-wrap').style.color = '#fc8181';
        valid = false;
        if (!firstEl) firstEl = termsEl;
      } else {
        termsErr.textContent = '';
        if (termsEl) termsEl.closest('.checkbox-wrap').style.color = '';
      }

      if (!valid) {
        firstEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const btn = signupForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...'; }

      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account'; }
        showToast('Account created! Redirecting to login...', 'success');
        signupForm.reset();
        if (strengthBar)  { strengthBar.style.width = '0'; strengthBar.style.background = '#e2e8f0'; }
        if (strengthText) strengthText.textContent = '';
        signupForm.querySelectorAll('.field-wrap').forEach(w => w.classList.remove('field-success','field-error-state'));
        ['req-length','req-upper','req-lower','req-number','req-special'].forEach(id => setReq(id, false));
        const confErr = document.getElementById('signupConfirmError');
        if (confErr) confErr.style.color = '';
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      }, 1800);
    });
  }

  /* ── FLOATING LABEL INPUTS ───────────────────────────────── */
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
    el.addEventListener('focus', () => el.parentElement?.classList.add('focused'));
    el.addEventListener('blur', () => {
      if (!el.value) el.parentElement?.classList.remove('focused');
    });
  });

  /* ── NEWSLETTER VALIDATION & REDIRECT ───────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');
    if (!input || !btn) return;

    const errMsg = document.createElement('p');
    errMsg.style.cssText = [
      'font-size:0.7rem',
      'color:#fc8181',
      'margin-top:5px',
      'font-family:var(--font-accent)',
      'display:none',
      'text-align:left'
    ].join(';');
    errMsg.textContent = 'Please enter a valid email address.';
    form.insertAdjacentElement('afterend', errMsg);

    const isValid = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    btn.addEventListener('click', () => {
      if (!isValid(input.value)) {
        input.style.borderColor = '#fc8181';
        input.style.boxShadow   = '0 0 0 3px rgba(252,129,129,0.2)';
        errMsg.style.display    = 'block';
        input.focus();
        return;
      }
      input.style.borderColor = '';
      input.style.boxShadow   = '';
      errMsg.style.display    = 'none';
      input.value             = '';
      window.location.href    = '404.html';
    });

    input.addEventListener('input', () => {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
      errMsg.style.display    = 'none';
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); btn.click(); }
    });
  });

  /* ── FOOTER BOTTOM LINKS → 404 ───────────────────────────── */
  document.querySelectorAll('.footer-bottom-links a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  /* ── CTA BUTTONS & SOCIAL ICONS → 404 ───────────────────── */
  document.querySelectorAll([
    'a.btn',
    'a.service-link',
    'a.project-btn',
    'a.footer-social-link',
    'a.social-link',
    'a.contact-social-link'
  ].join(', ')).forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  /* ── INIT ────────────────────────────────────────────────── */
  handleScrollTop();
});
