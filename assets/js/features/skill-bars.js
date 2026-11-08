/* ============================================================
   features/skill-bars.js
   Animates the skill progress bars when the skills block scrolls into view.
   CSS: .bar-fill / .skills-bars.animated in assets/css/sections/skills.css
   ============================================================ */
(function () {
    'use strict';

    var skillsBars = document.querySelector('.skills-bars');
    if (!skillsBars) return;

    new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                skillsBars.classList.add('animated');
                obs.disconnect();
            }
        });
    }, { threshold: 0.3 }).observe(skillsBars);

})();
