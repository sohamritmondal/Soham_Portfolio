/* ============================================================
   features/preloader.js
   Fades out the #preloader once the page has loaded, then flags
   body.is-ready, which starts the hero entrance (sections/hero.css).
   ============================================================ */
(function () {
    'use strict';

    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        setTimeout(function () {
            if (preloader) preloader.classList.add('hidden');
            // hero starts rising while the loader is still fading: one continuous motion
            setTimeout(function () { document.body.classList.add('is-ready'); }, 120);
            setTimeout(function () { if (preloader) preloader.remove(); }, 600);
        }, 250);
    });

})();
