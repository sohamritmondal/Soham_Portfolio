/* ============================================================
   features/navigation.js
   Sticky navbar, active menu link on scroll, mobile hamburger menu.
   CSS: assets/css/layout/navbar.css
   ============================================================ */
(function () {
    'use strict';

    var navbar = document.getElementById('navbar');
    var sections = Array.prototype.slice.call(document.querySelectorAll('section[id], header[id]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.menu-link'));

    /* ---------------- Active nav link on scroll ---------------- */
    function highlightNav() {
        var pos = window.scrollY + 120;
        var currentId = null;
        sections.forEach(function (sec) {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                currentId = sec.id;
            }
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    /* ---------------- Sticky navbar ---------------- */
    function onScroll() {
        if (navbar) navbar.classList.toggle('sticky', window.scrollY > 20);
        highlightNav();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------------- Mobile menu ---------------- */
    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }

})();
