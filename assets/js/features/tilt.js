/* ============================================================
   features/tilt.js
   3D tilt + lift on hover for every .tilt card (services, projects).
   The pointer target is eased toward each frame, so the card has
   weight instead of snapping to the cursor. Mouse-only; skipped on
   touch and under reduced motion. Requires core/utils.js.
   ============================================================ */
(function () {
    'use strict';

    if (!window.Portfolio.supportsHover || window.Portfolio.prefersReducedMotion) return;

    var MAX_TILT = 5;   // degrees
    var LIFT = -6;      // px

    document.querySelectorAll('.tilt').forEach(function (card) {
        var targetX = 0, targetY = 0, targetLift = 0;
        var x = 0, y = 0, lift = 0;
        var raf = null;

        function frame() {
            x += (targetX - x) * 0.16;
            y += (targetY - y) * 0.16;
            lift += (targetLift - lift) * 0.16;
            var settled = Math.abs(targetX - x) < 0.02 && Math.abs(targetY - y) < 0.02 && Math.abs(targetLift - lift) < 0.05;
            if (settled && targetLift === 0) {
                card.style.transform = '';
                raf = null;
                return;
            }
            card.style.transform =
                'perspective(900px) rotateX(' + y + 'deg) rotateY(' + x + 'deg) translateY(' + lift + 'px)';
            raf = requestAnimationFrame(frame);
        }
        function kick() { if (!raf) raf = requestAnimationFrame(frame); }

        card.addEventListener('mouseenter', function () { targetLift = LIFT; kick(); });
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var px = (e.clientX - rect.left) / rect.width - 0.5;
            var py = (e.clientY - rect.top) / rect.height - 0.5;
            targetX = px * MAX_TILT * 2;
            targetY = -py * MAX_TILT * 2;
            kick();
        });
        card.addEventListener('mouseleave', function () {
            targetX = 0; targetY = 0; targetLift = 0;
            kick();
        });
    });

})();
