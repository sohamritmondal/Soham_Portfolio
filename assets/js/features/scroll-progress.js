/* ============================================================
   features/scroll-progress.js
   Top read-progress bar. Drives transform: scaleX() so it stays on
   the compositor (no layout work per scroll frame).
   CSS: assets/css/components/scroll-progress.css
   ============================================================ */
(function () {
    'use strict';

    var progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    var ticking = false;
    function update() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });

})();
