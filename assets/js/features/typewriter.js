/* ============================================================
   features/typewriter.js
   Rotating typed role text in the hero (#typed) and about (#typed2).
   Edit the `roles` array to change the phrases.
   CSS: .caret / #typed in assets/css/sections/hero.css
   ============================================================ */
(function () {
    'use strict';

    function typewriter(el, strings, typeSpeed, backSpeed, pause) {
        if (!el) return;
        var si = 0, ci = 0, deleting = false;
        function tick() {
            var current = strings[si];
            el.textContent = current.substring(0, ci);
            var delay = deleting ? backSpeed : typeSpeed;
            if (!deleting && ci === current.length) {
                deleting = true;
                delay = pause;
            } else if (deleting && ci === 0) {
                deleting = false;
                si = (si + 1) % strings.length;
                delay = 400;
            } else {
                ci += deleting ? -1 : 1;
            }
            setTimeout(tick, delay);
        }
        tick();
    }

    var roles = [
        'Agentic AI Engineer',
        'MCP & A2A Builder',
        'Automation Engineer',
        'Database Administrator',
        'Associate Software Engineer'
    ];
    typewriter(document.getElementById('typed'), roles, 80, 40, 1800);
    typewriter(document.getElementById('typed2'), roles, 80, 40, 1800);

})();
