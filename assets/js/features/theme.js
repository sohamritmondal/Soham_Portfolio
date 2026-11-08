/* ============================================================
   features/theme.js
   Dark / light toggle (#themeToggle). Light is the default; the
   visitor's choice is persisted. Colours crossfade briefly on switch.
   CSS: tokens in base/variables.css, button in layout/navbar.css
   ============================================================ */
(function () {
    'use strict';

    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var root = document.documentElement;

    function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
    function apply(theme) {
        root.setAttribute('data-theme', theme);
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    apply(current());

    btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.classList.add('theme-anim');
        apply(next);
        try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
        setTimeout(function () { root.classList.remove('theme-anim'); }, 400);
    });

})();
