/* ============================================================
   features/journey.js
   Resume "presentation mode". For each .timeline: fills the accent
   line (--p) as the focus line (45% down the viewport) travels through
   it, marks passed steps .is-done, and the step nearest the focus line
   .is-current so it steps forward while the others recede.
   CSS: assets/css/sections/resume.css
   ============================================================ */
(function () {
    'use strict';

    var timelines = Array.prototype.slice.call(document.querySelectorAll('.timeline'));
    if (!timelines.length) return;

    var ticking = false;

    function update() {
        ticking = false;
        var vh = window.innerHeight;
        var focus = vh * 0.45;

        timelines.forEach(function (tl) {
            var rect = tl.getBoundingClientRect();
            if (!rect.height) return; // inside a hidden tab panel
            if (rect.bottom < -200 || rect.top > vh + 200) return;

            tl.classList.add('is-live');
            var p = (focus - rect.top) / rect.height;
            tl.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));

            var items = tl.querySelectorAll('.timeline-item');
            var best = null, bestDist = Infinity;
            items.forEach(function (item) {
                var r = item.getBoundingClientRect();
                var dist = Math.abs(r.top + r.height / 2 - focus);
                item.classList.toggle('is-done', r.bottom < focus);
                if (dist < bestDist) { bestDist = dist; best = item; }
            });
            items.forEach(function (item) { item.classList.toggle('is-current', item === best); });
        });
    }

    function schedule() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

})();
