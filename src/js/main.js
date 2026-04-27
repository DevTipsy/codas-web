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

  // ── Screenshots drag-to-scroll (sur tous les conteneurs) ─
  document.querySelectorAll('.screenshots-scroll').forEach(scroll => {
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

    // ── Molette → scroll horizontal ─────────────────────
    // On ne consomme l'événement que si l'utilisateur a un mouvement
    // vertical dominant (deltaY > deltaX) ET qu'on a effectivement de la
    // marge à scroller dans ce sens — sinon on laisse la page scroller
    // verticalement comme d'habitude.
    scroll.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = scroll.scrollWidth - scroll.clientWidth;
      if (max <= 0) return;
      const next = scroll.scrollLeft + e.deltaY;
      const atStart = scroll.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd   = scroll.scrollLeft >= max && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      scroll.scrollLeft = next;
    }, { passive: false });
  });

});

// ── Platform switcher (macOS / iOS) ─────────────────────
function setPlatform(target) {
  document.querySelectorAll('.platform-tab').forEach(btn => {
    const isActive = btn.dataset.target === target;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  document.querySelectorAll('.screenshots-scroll').forEach(panel => {
    panel.hidden = panel.dataset.platform !== target;
  });
}
