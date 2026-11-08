/* ============================================================
   core/theme-init.js
   Loaded in <head> BEFORE the stylesheets so the right theme paints
   first and never flashes. Light is the default for everyone; dark
   only when the visitor chose it (saved in localStorage).
   features/theme.js handles the toggle button.
   ============================================================ */
(function () {
    var theme = 'light';
    try {
        var saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') theme = saved;
    } catch (e) {
        /* storage blocked (private mode): stay on light */
    }
    document.documentElement.setAttribute('data-theme', theme);
})();
