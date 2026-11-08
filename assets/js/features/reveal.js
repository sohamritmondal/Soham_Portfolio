/* ============================================================
   features/reveal.js
   Adds .visible to every .reveal element the first time it scrolls into view.
   CSS: assets/css/components/reveal.css
   ============================================================ */
(function () {
    'use strict';

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });

})();
