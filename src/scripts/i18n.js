// Lightweight i18n: swaps innerHTML of [data-pt] elements between English and Portuguese.
// The English version is whatever is written in the HTML; the Portuguese version lives in data-pt.
(function () {
    const STORAGE_KEY = 'portfolio-lang';
    let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

    function captureDefaults() {
        document.querySelectorAll('[data-pt]').forEach(el => {
            if (!el.hasAttribute('data-en')) {
                el.setAttribute('data-en', el.innerHTML.trim());
            }
        });
    }

    function apply(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-pt]').forEach(el => {
            const html = lang === 'pt' ? el.getAttribute('data-pt') : el.getAttribute('data-en');
            if (html !== null) el.innerHTML = html;
        });
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
        localStorage.setItem(STORAGE_KEY, lang);

        const btn = document.getElementById('lang-toggle');
        if (btn) {
            btn.textContent = lang === 'pt' ? 'EN' : 'PT';
            btn.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para Português');
        }
    }

    // Re-apply current language (used after dynamic content is injected).
    window.i18nApply = function () {
        captureDefaults();
        apply(currentLang);
    };

    function init() {
        captureDefaults();
        apply(currentLang);

        const btn = document.getElementById('lang-toggle');
        if (btn) {
            btn.addEventListener('click', () => apply(currentLang === 'pt' ? 'en' : 'pt'));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
