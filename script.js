/* ============================================================
   SOHAM MONDAL — PORTFOLIO  ·  interactions & animations
   (vanilla JS, no dependencies)
   ============================================================ */
(function () {
    'use strict';

    /* ---------------- Preloader ---------------- */
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(function () {
                preloader.classList.add('hidden');
                setTimeout(function () { preloader.remove(); }, 700);
            }, 350);
        }
    });

    /* ---------------- Navbar: sticky + scroll progress + scroll-top ---------------- */
    var navbar = document.getElementById('navbar');
    var progressBar = document.getElementById('scrollProgress');
    var scrollTopBtn = document.getElementById('scrollTop');

    function onScroll() {
        var y = window.scrollY;
        if (navbar) navbar.classList.toggle('sticky', y > 20);
        if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 500);
        if (progressBar) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        }
        highlightNav();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------------- Active nav link on scroll ---------------- */
    var sections = Array.prototype.slice.call(document.querySelectorAll('section[id], header[id]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.menu-link'));

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

    /* ---------------- Typewriter ---------------- */
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
        'Associate Software Engineer',
        'Full-Stack Developer',
        'Agentic AI Engineer',
        'Database Administrator',
        'Automation Specialist'
    ];
    typewriter(document.getElementById('typed'), roles, 80, 40, 1800);
    typewriter(document.getElementById('typed2'), roles, 80, 40, 1800);

    /* ---------------- Reveal on scroll ---------------- */
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });

    /* ---------------- Skill bars ---------------- */
    var skillsBars = document.querySelector('.skills-bars');
    if (skillsBars) {
        new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    skillsBars.classList.add('animated');
                    obs.disconnect();
                }
            });
        }, { threshold: 0.3 }).observe(skillsBars);
    }

    /* ---------------- Animated counters ---------------- */
    function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1600;
        var start = null;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var statNums = document.querySelectorAll('.stat-num');
    if (statNums.length) {
        var counterObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ---------------- 3D tilt on cards ---------------- */
    var supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (supportsHover) {
        document.querySelectorAll('.tilt').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    'translateY(-8px) perspective(900px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    /* ---------------- Particle network (hero) ---------------- */
    var canvas = document.getElementById('particles');
    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: null, y: null };
        var DENSITY = 14000; // px² per particle
        var LINK_DIST = 130;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        }

        function initParticles() {
            particles = [];
            var count = Math.min(Math.floor((canvas.width * canvas.height) / DENSITY), 120);
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 1.6 + 0.6
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(34, 211, 238, 0.55)';
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < LINK_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.16 * (1 - dist / LINK_DIST)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
                    var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
                    var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < 160) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = 'rgba(34, 211, 238, ' + (0.25 * (1 - mdist / 160)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }

        canvas.parentElement.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', resize);
        resize();
        draw();
    }

    /* ---------------- Custom cursor + mouse glow ---------------- */
    var cursorDot = document.getElementById('cursorDot');
    var cursorRing = document.getElementById('cursorRing');
    var cursorGlow = document.getElementById('cursorGlow');

    if (supportsHover && cursorDot && cursorRing && cursorGlow) {
        var mouseX = -100, mouseY = -100;
        var ringX = -100, ringY = -100;
        var glowX = -100, glowY = -100;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        (function followCursor() {
            // ring trails fast, glow trails slow — gives a layered "weight" feel
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            glowX += (mouseX - glowX) * 0.07;
            glowY += (mouseY - glowY) * 0.07;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(followCursor);
        })();

        // grow the ring over interactive elements, hide over text fields
        document.querySelectorAll('a, button, .chip, .tilt').forEach(function (el) {
            el.addEventListener('mouseenter', function () { cursorRing.classList.add('hovering'); });
            el.addEventListener('mouseleave', function () { cursorRing.classList.remove('hovering'); });
        });
        document.querySelectorAll('input, textarea').forEach(function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-on-text'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-on-text'); });
        });

        // click ripple burst
        document.addEventListener('click', function (e) {
            var ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            document.body.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 650);
        });
    }

    /* ---------------- Magnetic buttons ---------------- */
    if (supportsHover) {
        document.querySelectorAll('.btn, .social-links a, .scroll-up-btn').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var dx = e.clientX - (rect.left + rect.width / 2);
                var dy = e.clientY - (rect.top + rect.height / 2);
                el.style.transform = 'translate(' + dx * 0.18 + 'px, ' + dy * 0.18 + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    /* ---------------- Footer year ---------------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
