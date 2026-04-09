// ── main.js ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll reveal ──────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Délai progressif pour les éléments dans une grille
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Navbar shadow au scroll ────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 40px rgba(0,0,0,0.4)'
      : 'none';
  }, { passive: true });

  // ── Screenshots drag-to-scroll ─────────────────────────
  const scroll = document.querySelector('.screenshots-scroll');
  if (scroll) {
    let isDown = false;
    let startX;
    let scrollLeft;

    scroll.addEventListener('mousedown', e => {
      isDown = true;
      scroll.style.cursor = 'grabbing';
      startX = e.pageX - scroll.offsetLeft;
      scrollLeft = scroll.scrollLeft;
    });
    scroll.addEventListener('mouseleave', () => {
      isDown = false;
      scroll.style.cursor = 'grab';
    });
    scroll.addEventListener('mouseup', () => {
      isDown = false;
      scroll.style.cursor = 'grab';
    });
    scroll.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroll.offsetLeft;
      const walk = (x - startX) * 1.5;
      scroll.scrollLeft = scrollLeft - walk;
    });

    scroll.style.cursor = 'grab';
  }

});
