/* ============================================================
   features/parallax.js
   Hero 3D scene: the whole scene (terminal + tiles) rotates a few
   degrees toward the pointer and drifts upward slower than the page
   on scroll. Eased per frame; transform only. Skipped under reduced
   motion. Requires core/utils.js.
   CSS: .hero-scene in assets/css/sections/hero.css
   ============================================================ */
(function () {
    'use strict';

    var scene = document.getElementById('heroScene');
    var hero = document.getElementById('home');
    if (!scene || !hero || window.Portfolio.prefersReducedMotion) return;

    var ROT_X = 6, ROT_Y = 4, SCROLL_RATE = 0.14;
    var targetRX = 0, targetRY = 0, targetY = 0;
    var rx = 0, ry = 0, y = 0;
    var raf = null;

    function frame() {
        rx += (targetRX - rx) * 0.08;
        ry += (targetRY - ry) * 0.08;
        y += (targetY - y) * 0.12;
        scene.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0) rotateX(' + ry.toFixed(3) + 'deg) rotateY(' + rx.toFixed(3) + 'deg)';
        var settled = Math.abs(targetRX - rx) < 0.01 && Math.abs(targetRY - ry) < 0.01 && Math.abs(targetY - y) < 0.1;
        raf = settled ? null : requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    if (window.Portfolio.supportsHover) {
        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            targetRX = ((e.clientX - rect.left) / rect.width - 0.5) * ROT_X;
            targetRY = -((e.clientY - rect.top) / rect.height - 0.5) * ROT_Y;
            kick();
        });
        hero.addEventListener('mouseleave', function () { targetRX = 0; targetRY = 0; kick(); });
    }

    window.addEventListener('scroll', function () {
        targetY = Math.min(window.scrollY, hero.offsetHeight) * SCROLL_RATE;
        kick();
    }, { passive: true });

})();
