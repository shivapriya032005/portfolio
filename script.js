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
    const gap = 25; // must match CSS gap
    return card.getBoundingClientRect().width + gap;
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
    track.style.transform = `translateX(-${index * getCardWidth()}px)`;
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
    index = 0;
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
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });



// Initial checks
revealOnScroll();
handleNavbarScroll();

(function() {
  emailjs.init("lrKZo9vsEWTomBtV5");  // ← paste PUBLIC_KEY
})();

const form = document.getElementById("contact-form");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  emailjs.sendForm(
    "service_59n334m",   // ← paste SERVICE_ID
    "template_y66apok",  // ← paste TEMPLATE_ID
    this
  )
  .then(() => {
    showPopup("✅ Message sent successfully!");
    form.reset();
  })
  .catch(() => {
    showPopup("❌ Failed to send. Please try again.");
  });
});
