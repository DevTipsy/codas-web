// ── i18n — FR / EN ──────────────────────────────────────

(function () {
  const STORAGE_KEY = 'codas-lang';

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const browser = navigator.language || navigator.userLanguage || 'fr';
    return browser.startsWith('fr') ? 'fr' : 'en';
  }

  // Métadonnées de page (title + meta description + og/twitter description)
  // par langue — utilisées pour l'onglet du navigateur, le SEO et les
  // partages sociaux. Le textContent des éléments visibles est géré via
  // data-fr/data-en directement dans le HTML.
  const META = {
    fr: {
      title: 'Codas — Bibliothèque de composants SwiftUI',
      description: "Découvrez, partagez et achetez des composants SwiftUI prêts à l'emploi. La marketplace pour développeurs iOS."
    },
    en: {
      title: 'Codas — SwiftUI Components Library',
      description: 'Discover, share and purchase ready-to-use SwiftUI components. The marketplace for iOS developers.'
    }
  };

  function setMeta(lang) {
    const meta = META[lang] || META.fr;
    document.title = meta.title;
    document.querySelectorAll('meta[name="description"]').forEach(el => {
      el.setAttribute('content', meta.description);
    });
    document.querySelectorAll('meta[property="og:title"]').forEach(el => {
      el.setAttribute('content', meta.title);
    });
    document.querySelectorAll('meta[property="og:description"]').forEach(el => {
      el.setAttribute('content', meta.description);
    });
    document.querySelectorAll('meta[name="twitter:title"]').forEach(el => {
      el.setAttribute('content', meta.title);
    });
    document.querySelectorAll('meta[name="twitter:description"]').forEach(el => {
      el.setAttribute('content', meta.description);
    });
  }

  window.setLang = function (lang) {
    // Traduire tous les éléments qui ont data-fr / data-en
    document.querySelectorAll('[data-fr], [data-en]').forEach(el => {
      const val = el.dataset[lang];
      if (val !== undefined) {
        // Utiliser innerHTML pour les entités HTML (&ldquo; etc.)
        if (val.includes('&') || val.includes('<')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Mettre à jour les boutons du switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === lang);
    });

    // Mettre à jour l'attribut lang du html
    document.documentElement.lang = lang;

    // Mettre à jour le titre + description (onglet navigateur + SEO + OG/Twitter)
    setMeta(lang);

    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Init au chargement
  document.addEventListener('DOMContentLoaded', () => {
    window.setLang(detectLang());
  });
})();
