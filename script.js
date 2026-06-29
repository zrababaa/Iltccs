/* ─── HEADER SCROLL ─────────────────────────────────────────────────────── */
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

/* ─── MOBILE NAV ────────────────────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
});
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
  });
});

/* ─── ACTIVE NAV ────────────────────────────────────────────────────────── */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = nav.querySelector(`[href="#${id}"]`);
    if (link) {
      const inView = scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', inView);
    }
  });
}

/* ─── LANGUAGE TOGGLE ────────────────────────────────────────────────────── */
let currentLang = 'en';
const langToggle = document.getElementById('langToggle');
const html = document.documentElement;

function applyLanguage(lang) {
  currentLang = lang;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Toggle button display
  langToggle.querySelector('.lang-toggle__en').style.display = lang === 'en' ? 'inline' : 'none';
  langToggle.querySelector('.lang-toggle__ar').style.display = lang === 'ar' ? 'inline' : 'none';

  // Translate all data-en / data-ar elements
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
    // If element contains child elements (innerHTML needed), use innerHTML
    if (text.includes('<') || text.includes('&')) {
      el.innerHTML = text;
    } else {
      // Only set textContent for pure text nodes to avoid destroying children
      if (!el.children.length) el.textContent = text;
    }
  });

  // Placeholders
  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    const ph = el.getAttribute(`data-placeholder-${lang}`);
    if (ph) el.setAttribute('placeholder', ph);
  });

  // Select options
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  // Store preference
  localStorage.setItem('tli-lang', lang);
}

langToggle.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'ar' : 'en');
});

// Restore saved preference
const savedLang = localStorage.getItem('tli-lang');
if (savedLang === 'ar') applyLanguage('ar');

/* ─── PARTICLES ─────────────────────────────────────────────────────────── */
const particleContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  p.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s;opacity:${Math.random()*0.4+0.1};`;
  particleContainer.appendChild(p);
}

/* ─── COUNTER ANIMATION ─────────────────────────────────────────────────── */
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  const heroBottom = document.querySelector('.hero').getBoundingClientRect().bottom;
  if (heroBottom < window.innerHeight * 1.3) {
    countersStarted = true;
    document.querySelectorAll('.stat__num[data-target]').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
  }
}
setTimeout(startCounters, 800);
window.addEventListener('scroll', startCounters, { passive: true });

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 80);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ─── SMOOTH SCROLL ─────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

/* ─── VIDEO LIGHTBOX ─────────────────────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lightboxIframe = document.getElementById('lightboxIframe');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

function openLightbox(videoId) {
  lightboxIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxIframe.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.video-card__thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const videoId = thumb.dataset.video;
    if (videoId) openLightbox(videoId);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ─── CONTACT FORM ──────────────────────────────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const service = form.querySelector('#service').value;
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !service || !message) {
      showNotif(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotif(currentLang === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.' : 'Please enter a valid email address.', 'error');
      return;
    }

    btn.disabled = true;
    const origHTML = btn.innerHTML;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0"/></svg> ${currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}`;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = origHTML;
      form.reset();
      showNotif(
        currentLang === 'ar'
          ? 'شكرًا! تم إرسال رسالتك. سنرد خلال 24 ساعة.'
          : 'Thank you! Your message has been sent. We will respond within 24 hours.',
        'success'
      );
    }, 1600);
  });
}

function showNotif(message, type = 'success') {
  document.querySelector('.notif')?.remove();
  const notif = document.createElement('div');
  notif.className = `notif notif--${type}`;
  notif.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${type === 'success' ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}</svg><span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;margin-left:auto;padding:4px;color:inherit;opacity:.7">✕</button>`;
  Object.assign(notif.style, {
    position:'fixed', top:'90px', right:'24px', zIndex:'9999',
    display:'flex', alignItems:'center', gap:'12px',
    padding:'16px 20px', borderRadius:'12px', maxWidth:'420px',
    fontSize:'.9rem', fontWeight:'500', boxShadow:'0 8px 32px rgba(0,0,0,.15)',
    animation:'slideIn .3s ease',
    background: type === 'success' ? '#f0fdf4' : '#fef2f2',
    color: type === 'success' ? '#166534' : '#991b1b',
    border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
  });
  document.body.appendChild(notif);
  setTimeout(() => notif.parentElement && notif.remove(), 6000);
}

/* ─── CSS KEYFRAMES ─────────────────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
`;
document.head.appendChild(style);

/* ─── PRESENTATION SLIDE VIEWER ─────────────────────────────────────────── */
(function initSlideViewer() {
  const TOTAL = 27;
  const viewer = document.getElementById('slideViewer');
  const viewerImg = document.getElementById('slideViewerImg');
  const viewerClose = document.getElementById('slideViewerClose');
  const viewerBackdrop = document.getElementById('slideViewerBackdrop');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  const counter = document.getElementById('slideCounter');
  if (!viewer) return;

  let current = 1;

  function slideSrc(n) {
    return `slides/slide-${String(n).padStart(2,'0')}.webp`;
  }

  function openViewer(n) {
    current = n;
    viewerImg.src = slideSrc(current);
    counter.textContent = `${current} / ${TOTAL}`;
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
    preload(current + 1);
  }

  function closeViewer() {
    viewer.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { viewerImg.src = ''; }, 300);
  }

  function goTo(n) {
    current = ((n - 1 + TOTAL) % TOTAL) + 1;
    viewerImg.style.opacity = '0';
    setTimeout(() => {
      viewerImg.src = slideSrc(current);
      viewerImg.onload = () => { viewerImg.style.opacity = '1'; };
      counter.textContent = `${current} / ${TOTAL}`;
      preload(current + 1);
      preload(current - 1);
    }, 120);
  }

  function preload(n) {
    if (n < 1 || n > TOTAL) return;
    const img = new Image();
    img.src = slideSrc(n);
  }

  document.querySelectorAll('.slide-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => openViewer(parseInt(thumb.dataset.slide)));
  });

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  viewerClose.addEventListener('click', closeViewer);
  viewerBackdrop.addEventListener('click', closeViewer);

  document.addEventListener('keydown', e => {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
    if (e.key === 'Escape') closeViewer();
  });

  // Touch/swipe support
  let touchStartX = 0;
  viewer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });
})();

/* ─── FAVICON FROM LOGO ─────────────────────────────────────────────────── */
(function generateFavicon() {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'shortcut icon';
      link.href = canvas.toDataURL('image/png');
      document.head.appendChild(link);
    } catch(e) {}
  };
  img.src = 'logo.png';
})();
