// Scroll Reveal Animation
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach(reveal => {
    const windowHeight = window.innerHeight;
    const elementTop = reveal.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add('active');
    } else {
      reveal.classList.remove('active');
    }
  });
}

// Certifications Carousel
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

if (track && prevBtn && nextBtn) {
  let index = 0;

  const getCardWidth = () => {
    const card = track.children[0];
    if (!card) return 0;

    const styles = window.getComputedStyle(track);
    const gapValue = parseFloat(styles.columnGap || styles.gap || '0');
    return card.getBoundingClientRect().width + (Number.isNaN(gapValue) ? 0 : gapValue);
  };

  const getVisibleCount = () => {
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 900) return 2;
    return 3; // desktop
  };

  const maxIndex = () => {
    return Math.max(0, track.children.length - getVisibleCount());
  };

  const updateCarousel = () => {
    const cardWidth = getCardWidth();
    if (!cardWidth) return;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  };

  nextBtn.addEventListener('click', () => {
    if (index < maxIndex()) {
      index++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });

  window.addEventListener('resize', () => {
    index = Math.min(index, maxIndex());
    updateCarousel();
  });

  // Init
  updateCarousel();
}



// Navbar Scroll Behavior
function handleNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 100) { // Adjust threshold as needed
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('scroll', handleNavbarScroll);

// Mobile Menu Toggle
const toggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (toggle && navLinks) {
  const NAV_VISIBLE_BREAKPOINT = 1024;

  const closeMenu = () => {
    navLinks.classList.remove('show');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const shouldShow = !navLinks.classList.contains('show');
    navLinks.classList.toggle('show', shouldShow);
    toggle.classList.toggle('active', shouldShow);
    toggle.setAttribute('aria-expanded', shouldShow.toString());
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > NAV_VISIBLE_BREAKPOINT) {
      closeMenu();
    }
  });
}



// Initial checks
revealOnScroll();
handleNavbarScroll();

const emailServiceAvailable = typeof window.emailjs !== 'undefined';

if (emailServiceAvailable) {
  (function() {
    emailjs.init('lrKZo9vsEWTomBtV5');
  })();
} else {
  console.warn('EmailJS library is not loaded. Contact form submissions will be disabled.');
}

const toastRegion = document.querySelector('.toast-region');

function showToast({ message, status = 'info' }) {
  if (!toastRegion) return;

  const toast = document.createElement('div');
  toast.className = `toast ${status}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.innerHTML = `<p>${message}</p>`;

  toastRegion.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('visible');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    const cleanup = () => {
      if (toast.isConnected) {
        toast.remove();
      }
    };

    toast.addEventListener('transitionend', cleanup, { once: true });
    toast.addEventListener('animationend', cleanup, { once: true });

    setTimeout(cleanup, 600);
  }, 4000);
}

const THEME_STORAGE_KEY = 'preferred-theme';
const themeToggleBtn = document.getElementById('themeToggle');
const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)');

function updateThemeToggleUI(theme) {
  if (!themeToggleBtn) return;
  const icon = themeToggleBtn.querySelector('.theme-toggle__icon');
  const label = themeToggleBtn.querySelector('.theme-toggle__label');
  const isLight = theme === 'light';

  themeToggleBtn.classList.toggle('is-light', isLight);
  if (icon) {
    icon.textContent = isLight ? '☀️' : '🌙';
  }
  if (label) {
    label.textContent = isLight ? 'Light mode' : 'Dark mode';
  }
  themeToggleBtn.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
}

function applyTheme(theme, { persist = true } = {}) {
  if (!theme) return;
  document.body.dataset.theme = theme;
  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
  updateThemeToggleUI(theme);
}

function resolveInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) return storedTheme;
  if (document.body.dataset.theme) return document.body.dataset.theme;
  return matchMediaDark.matches ? 'dark' : 'light';
}

const initialTheme = resolveInitialTheme();
applyTheme(initialTheme, { persist: false });

if (!localStorage.getItem(THEME_STORAGE_KEY)) {
  localStorage.setItem(THEME_STORAGE_KEY, initialTheme);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme, { persist: true });
  });
}

matchMediaDark.addEventListener('change', event => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) return; // respect explicit preference
  applyTheme(event.matches ? 'dark' : 'light', { persist: false });
});

function validateForm(formElement) {
  const fields = Array.from(formElement.querySelectorAll('input[required], textarea[required]'));
  const firstInvalid = fields.find(field => !field.value.trim());

  fields.forEach(field => {
    field.classList.toggle('has-error', !field.value.trim());
    if (!field.value.trim()) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    showToast({ message: 'Please fill in all required fields.', status: 'error' });
    return false;
  }

  return true;
}

const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm(form)) {
      return;
    }

    if (!emailServiceAvailable) {
      showToast({ message: '📨 Email service unavailable. Please try again later.', status: 'error' });
      return;
    }

    emailjs.sendForm(
      'service_59n334m',
      'template_y66apok',
      this
    )
    .then(() => {
      showToast({ message: '✅ Message sent successfully!', status: 'success' });
      form.reset();
    })
    .catch(() => {
      showToast({ message: '❌ Failed to send. Please try again.', status: 'error' });
    });
  });
}
