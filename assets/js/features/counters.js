/* ============================================================
   features/counters.js
   Counts up the .stat-num figures (data-count / data-decimal / data-suffix)
   in the About section when they scroll into view.
   CSS: .stats-row in assets/css/sections/about.css
   ============================================================ */
(function () {
    'use strict';

    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2400; // slow enough that the count is visible
        var start = null;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var statNums = document.querySelectorAll('.stat-num');
    if (statNums.length) {
        var counterObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(function (el) { counterObserver.observe(el); });
    }

})();
