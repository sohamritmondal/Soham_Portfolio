/* ============================================================
   features/footer-year.js
   Keeps the copyright year in the footer current.
   ============================================================ */
(function () {
    'use strict';

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
