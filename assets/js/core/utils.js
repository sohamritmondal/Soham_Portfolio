/* ============================================================
   core/utils.js
   Shared helpers used by several feature modules.
   Must be loaded BEFORE any file in assets/js/features/.
   ============================================================ */
(function (global) {
    'use strict';

    var Portfolio = global.Portfolio || (global.Portfolio = {});

    /* Marks that JS is running: CSS only hides entrance/reveal elements under html.js,
       so a no-JS visitor still sees everything. */
    document.documentElement.classList.add('js');

    /* true on devices with a real mouse (hover + fine pointer) */
    Portfolio.supportsHover = global.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* true when the visitor asked the OS to reduce motion */
    Portfolio.prefersReducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Failsafe: if the preloader never reports ready (blocked asset, script error),
       start the hero entrance anyway so the page is never left blank. */
    setTimeout(function () { document.body.classList.add('is-ready'); }, 4000);

})(window);
