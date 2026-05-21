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

// Version actuelle de l'app dispo sur TestFlight. Bump à chaque nouvelle
// build poussée — c'est le seul endroit à modifier, tous les badges du
// site se mettent à jour automatiquement.
const APP_VERSION = 'V7';

document.addEventListener('DOMContentLoaded', () => {

  // Injecte la version dans tous les badges qui portent data-app-version
  document.querySelectorAll('[data-app-version]').forEach(el => {
    el.textContent = APP_VERSION;
  });

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

  // ── Modale "Prévenez-moi à la sortie" ─────────────────
  const notifyModal = document.getElementById('notify-modal');
  if (notifyModal) {
    const form  = notifyModal.querySelector('#notify-form');
    const input = notifyModal.querySelector('#notify-email');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const errorBox = notifyModal.querySelector('#notify-modal-error');
    const states = notifyModal.querySelectorAll('.notify-modal-state');

    const NOTIFY_ENDPOINT = 'https://api.codaslibrary.app/notify-list';

    function showState(name) {
      states.forEach(el => {
        el.hidden = el.dataset.state !== name;
      });
    }
    function openModal() {
      notifyModal.hidden = false;
      notifyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      showState('form');
      if (errorBox) { errorBox.hidden = true; errorBox.textContent = ''; }
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 80);
      }
    }
    function closeModal() {
      notifyModal.hidden = true;
      notifyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Ouverture : tous les éléments avec data-action="notify-modal"
    document.querySelectorAll('[data-action="notify-modal"]').forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault();
        openModal();
      });
    });

    // Fermeture : backdrop, croix, boutons "Fermer"
    document.querySelectorAll('[data-action="notify-close"]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        closeModal();
      });
    });
    // Échap pour fermer
    document.addEventListener('keydown', e => {
      if (!notifyModal.hidden && e.key === 'Escape') closeModal();
    });

    // Submit du formulaire
    form?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = input?.value.trim() ?? '';
      if (!email) return;

      if (errorBox) { errorBox.hidden = true; errorBox.textContent = ''; }
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(NOTIFY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          let reason = `Erreur ${res.status}`;
          try {
            const body = await res.json();
            if (body?.reason) reason = body.reason;
          } catch { /* ignore */ }
          throw new Error(reason);
        }
        const data = await res.json().catch(() => ({}));
        showState(data?.status === 'already_subscribed' ? 'already' : 'success');
      } catch (err) {
        if (errorBox) {
          errorBox.textContent = err.message || 'Une erreur est survenue. Réessaie.';
          errorBox.hidden = false;
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // ── Bouton copier URL MCP ─────────────────────────────
  document.querySelectorAll('.mcp-url-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.parentElement?.querySelector('code');
      if (!code) return;
      const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
      navigator.clipboard.writeText(code.textContent || '').then(() => {
        btn.classList.add('copied');
        btn.textContent = btn.dataset[`${lang}Copied`] || 'Copied ✓';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = btn.dataset[`${lang}Copy`] || 'Copy';
        }, 1800);
      });
    });
  });

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
