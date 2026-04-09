// ── i18n — FR / EN ──────────────────────────────────────

(function () {
  const STORAGE_KEY = 'codas-lang';

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const browser = navigator.language || navigator.userLanguage || 'fr';
    return browser.startsWith('fr') ? 'fr' : 'en';
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

    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Init au chargement
  document.addEventListener('DOMContentLoaded', () => {
    window.setLang(detectLang());
  });
})();
