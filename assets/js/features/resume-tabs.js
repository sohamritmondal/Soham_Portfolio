/* ============================================================
   features/resume-tabs.js
   Experience / Education tabs in the Journey section. Sliding
   indicator, arrow-key navigation, and a nudge to journey.js so the
   newly shown timeline gets its presentation state.
   CSS: assets/css/sections/resume.css
   ============================================================ */
(function () {
    'use strict';

    var list = document.querySelector('.resume-tabs');
    if (!list) return;
    var tabs = Array.prototype.slice.call(list.querySelectorAll('.resume-tab'));
    var indicator = list.querySelector('.resume-tab-indicator');
    if (!tabs.length) return;

    function activeTab() {
        return tabs.filter(function (t) { return t.classList.contains('is-active'); })[0] || tabs[0];
    }
    function place(tab) {
        if (!indicator) return;
        indicator.style.width = tab.offsetWidth + 'px';
        indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    }
    function activate(tab, focus) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
            var panel = document.getElementById(t.getAttribute('aria-controls'));
            if (!panel) return;
            if (on) {
                panel.hidden = false;
                panel.classList.remove('is-active');
                void panel.offsetWidth; // restart the enter animation
                panel.classList.add('is-active');
            } else {
                panel.hidden = true;
                panel.classList.remove('is-active');
            }
        });
        place(tab);
        if (focus) tab.focus();
        window.dispatchEvent(new Event('scroll')); // journey.js re-evaluates the visible timeline
    }

    tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { if (!t.classList.contains('is-active')) activate(t, false); });
        t.addEventListener('keydown', function (e) {
            var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
            if (!dir) return;
            e.preventDefault();
            activate(tabs[(i + dir + tabs.length) % tabs.length], true);
        });
    });

    // initial position without animating from 0
    if (indicator) indicator.style.transition = 'none';
    place(activeTab());
    requestAnimationFrame(function () { if (indicator) indicator.style.transition = ''; });
    window.addEventListener('load', function () { place(activeTab()); });   // after web fonts
    window.addEventListener('resize', function () { place(activeTab()); });

})();
