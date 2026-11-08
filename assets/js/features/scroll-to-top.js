/* ============================================================
   features/scroll-to-top.js
   Floating "back to top" button; appears after scrolling 500px.
   CSS: assets/css/components/scroll-to-top.css
   ============================================================ */
(function () {
    'use strict';

    var scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function () {
        scrollTopBtn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

})();
