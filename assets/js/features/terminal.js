/* ============================================================
   features/terminal.js
   Live hero terminal. Reads the commands and outputs already in the
   markup, hides them, then replays: types each command character by
   character, pauses as if Enter was pressed, prints its output lines,
   moves to the next command, idles with a blinking prompt, and after a
   while clears and starts again. Static under reduced motion.
   Markup: .terminal-body > p (command = has .t-prompt; output = .t-out;
   the final p with .t-cursor is the idle prompt).
   ============================================================ */
(function () {
    'use strict';

    var body = document.querySelector('.terminal-body');
    if (!body || window.Portfolio.prefersReducedMotion) return;

    var steps = [];
    var idle = null;
    Array.prototype.slice.call(body.children).forEach(function (p) {
        if (p.querySelector('.t-cursor')) { idle = p; return; }
        if (p.querySelector('.t-prompt')) { steps.push({ cmd: p, text: '', outs: [] }); }
        else if (steps.length) { steps[steps.length - 1].outs.push(p); }
    });
    if (!steps.length) return;

    // keep the card the same height while lines are hidden
    body.style.minHeight = body.offsetHeight + 'px';

    // rebuild each command line as: prompt + typed text + cursor
    steps.forEach(function (s) {
        var prompt = s.cmd.querySelector('.t-prompt');
        var text = '';
        Array.prototype.slice.call(s.cmd.childNodes).forEach(function (n) {
            if (n !== prompt) text += n.textContent;
        });
        s.text = text.replace(/^\s+/, '');
        s.cmd.textContent = '';
        s.cmd.appendChild(prompt);
        s.cmd.appendChild(document.createTextNode(' '));
        s.typed = document.createElement('span');
        s.typed.className = 't-typed';
        s.cmd.appendChild(s.typed);
        s.cur = document.createElement('span');
        s.cur.className = 't-cursor';
        s.cmd.appendChild(s.cur);
    });

    var timer = null;
    function wait(ms, fn) { timer = setTimeout(fn, ms); }

    function reset() {
        clearTimeout(timer);
        steps.forEach(function (s) {
            s.cmd.style.display = 'none';
            s.typed.textContent = '';
            s.cur.style.display = '';
            s.outs.forEach(function (o) { o.style.display = 'none'; });
        });
        if (idle) idle.style.display = 'none';
    }

    function run(i) {
        if (i >= steps.length) {
            if (idle) idle.style.display = '';
            wait(8000, function () { reset(); run(0); });
            return;
        }
        var s = steps[i];
        s.cmd.style.display = '';
        var k = 0;
        (function type() {
            if (k <= s.text.length) {
                s.typed.textContent = s.text.substring(0, k);
                k++;
                wait(42 + Math.random() * 55, type);
                return;
            }
            // "Enter": short pause, cursor leaves the command line, output prints
            wait(380, function () {
                s.cur.style.display = 'none';
                var j = 0;
                (function print() {
                    if (j < s.outs.length) {
                        s.outs[j].style.display = '';
                        j++;
                        wait(150, print);
                    } else {
                        wait(650, function () { run(i + 1); });
                    }
                })();
            });
        })();
    }

    var started = false;
    function start() {
        if (started) return;
        started = true;
        wait(1000, function () { run(0); });
    }

    reset();
    if (document.body.classList.contains('is-ready')) {
        start();
    } else {
        var obs = new MutationObserver(function () {
            if (document.body.classList.contains('is-ready')) { obs.disconnect(); start(); }
        });
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    // don't burn timers in a background tab; replay cleanly on return
    document.addEventListener('visibilitychange', function () {
        if (!started) return;
        if (document.hidden) { clearTimeout(timer); }
        else { reset(); run(0); }
    });

})();
