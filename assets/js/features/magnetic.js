/* ============================================================
   features/magnetic.js
   Small "magnetic" pull on icon buttons (social links, scroll-top).
   Primary buttons are left to CSS so their press feedback stays crisp.
   Mouse-only; skipped under reduced motion. Requires core/utils.js.
   ============================================================ */
(function () {
    'use strict';

    if (!window.Portfolio.supportsHover || window.Portfolio.prefersReducedMotion) return;

    document.querySelectorAll('.social-links a, .scroll-up-btn').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
            var rect = el.getBoundingClientRect();
            var dx = e.clientX - (rect.left + rect.width / 2);
            var dy = e.clientY - (rect.top + rect.height / 2);
            el.style.transform = 'translate(' + dx * 0.16 + 'px, ' + dy * 0.16 + 'px)';
        });
        el.addEventListener('mouseleave', function () {
            el.style.transform = '';
        });
    });

})();
