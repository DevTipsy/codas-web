// ── main.js ──────────────────────────────────────────────

// Toujours charger la page tout en haut (même après un refresh ou si une
// ancre est présente dans l'URL) — on veut le comportement "première
// visite" à chaque fois.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// On scroll dès que possible (avant peinture quand on peut), puis
// re-scroll au load au cas où le navigateur aurait sauté à une ancre.
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

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

  // ── Screenshots : molette verticale → scroll horizontal ──
  // Pas d'interaction drag/click sur les captures — uniquement la
  // scrollbar native et la molette.
  document.querySelectorAll('.screenshots-scroll').forEach(scroll => {
    scroll.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = scroll.scrollWidth - scroll.clientWidth;
      if (max <= 0) return;
      const atStart = scroll.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd   = scroll.scrollLeft >= max && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      scroll.scrollLeft = scroll.scrollLeft + e.deltaY;
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
