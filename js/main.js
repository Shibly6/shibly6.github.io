/* ============================================================
   MAIN.JS - Portfolio JavaScript
   
   This file handles:
   1. Mobile navigation toggle
   2. Smooth scroll for anchor links
   3. Fade-in animations on scroll
   4. Typing effect for hero name
   5. Active nav link highlighting
   ============================================================ */

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // 1. MOBILE NAVIGATION TOGGLE
    // Opens/closes the hamburger menu on mobile devices
    // ============================================================

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            // Toggle the 'active' class on both button and menu
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================================
    // 2. SMOOTH SCROLL FOR ANCHOR LINKS
    // Provides smooth scrolling when clicking navigation links
    // ============================================================

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only prevent default for actual anchor links
            if (href !== '#') {
                e.preventDefault();

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================================
    // 3. FADE-IN ANIMATIONS ON SCROLL
    // Elements with class 'fade-in' will animate when scrolled into view
    // Uses the Intersection Observer API for performance
    // ============================================================

    const fadeElements = document.querySelectorAll('.fade-in');

    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                // When element is 20% visible, add 'visible' class
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing after animation (optional: remove to re-animate)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,        // Trigger when 20% of element is visible
            rootMargin: '0px'      // No margin around viewport
        });

        // Start observing all fade-in elements
        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        // Just show all elements immediately
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    // ============================================================
    // 4. TYPING EFFECT FOR HERO NAME
    // Creates a typewriter animation for the name in hero section
    // ============================================================

    const typedNameElement = document.getElementById('typed-name');
    const typedWhoami = document.getElementById('typed-whoami');
    const heroTitle = document.querySelector('.hero-title');
    const heroSummary = document.querySelector('.hero-summary');
    const nameToType = 'Noor Elahi Ali Shibly';
    let charIndex = 0;
    let typingDone = false;

    // heroTitle and heroSummary start hidden via CSS (opacity: 0)
    // We reveal them by adding the 'revealed' class

    function typeWhoamiCmd(callback) {
        if (!typedWhoami) { if (callback) callback(); return; }
        typedWhoami.textContent = '';
        var text = 'whoami';
        var i = 0;
        (function next() {
            if (i < text.length) {
                typedWhoami.textContent += text.charAt(i++);
                setTimeout(next, 25 + Math.random() * 30);
            } else if (callback) callback();
        })();
    }

    function typeCharacter() {
        if (typedNameElement && charIndex < nameToType.length) {
            typedNameElement.textContent += nameToType.charAt(charIndex);
            charIndex++;
            const delay = Math.floor(Math.random() * 70) + 80;
            setTimeout(typeCharacter, delay);
        } else {
            // Fade in title and summary via CSS class
            if (heroTitle) heroTitle.classList.add('revealed');
            if (heroSummary) heroSummary.classList.add('revealed');
            typingDone = true;
            // Start cycling after a short pause
            setTimeout(startHeroCycling, 1500);
        }
    }

    // Initial load: type '$ whoami' command, then type the name
    setTimeout(function() {
        typeWhoamiCmd(function() {
            setTimeout(typeCharacter, 300);
        });
    }, 500);

    // ============================================================
    // 4b. HERO TERMINAL CYCLING
    // Cycles between whoami intro and latest_posts with animations
    // ============================================================

    const heroIntro = document.getElementById('hero-intro');
    const heroPosts = document.getElementById('hero-posts');
    const heroViews = document.getElementById('hero-views');
    const glitchEl = document.getElementById('terminal-glitch');
    const typedCmd = document.getElementById('typed-cmd');
    const postsList = document.getElementById('hero-posts-list');
    const dots = document.querySelectorAll('.hero-dot');
    const heroSection = document.getElementById('home');
    const cmdText = 'cat latest_posts';
    let currentView = 'intro';
    let cycleTimer = null;
    let isPaused = false;
    let isHeroVisible = true;
    let isSwitching = false;

    // ── Fixed height: measure both views, set container height ──
    function setFixedViewsHeight() {
        if (!heroViews || !heroIntro || !heroPosts) return;
        heroViews.style.height = 'auto';
        var origI = heroIntro.style.cssText;
        var origP = heroPosts.style.cssText;
        heroIntro.style.cssText = 'position:relative;opacity:1;transform:none;pointer-events:auto;';
        heroPosts.style.cssText = 'position:relative;opacity:1;transform:none;pointer-events:auto;';
        var entries = postsList ? postsList.querySelectorAll('.hero-post-entry, .hero-posts-viewall') : [];
        entries.forEach(function (e) { e.style.cssText = 'opacity:1;transform:none;'; });
        if (typedCmd) typedCmd.textContent = cmdText;
        var h1 = heroIntro.scrollHeight;
        var h2 = heroPosts.scrollHeight;
        heroIntro.style.cssText = origI;
        heroPosts.style.cssText = origP;
        entries.forEach(function (e) { e.style.cssText = ''; });
        if (typedCmd) typedCmd.textContent = '';
        heroViews.style.height = Math.max(h1, h2) + 'px';
    }
    setFixedViewsHeight();
    window.addEventListener('resize', setFixedViewsHeight);

    // ── Pause on hover ──
    var terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        terminalWindow.addEventListener('mouseenter', function () {
            isPaused = true;
            clearTimeout(cycleTimer);
            cycleTimer = null;
        });
        terminalWindow.addEventListener('mouseleave', function () {
            isPaused = false;
            if (typingDone && !cycleTimer) scheduleCycle();
        });
    }

    // ── Dot navigation ──
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var target = this.getAttribute('data-view');
            if (target !== currentView && !isSwitching) {
                clearTimeout(cycleTimer);
                cycleTimer = null;
                switchView(target);
            }
        });
    });

    // (Scroll trigger removed – cycling is purely timer-based)

    // ── Visibility: pause cycling when hero is off-screen ──
    if (heroSection && 'IntersectionObserver' in window) {
        var heroObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                isHeroVisible = entry.isIntersecting;
                if (!isHeroVisible) {
                    clearTimeout(cycleTimer);
                    cycleTimer = null;
                } else if (typingDone && !cycleTimer && !isPaused && !isSwitching) {
                    scheduleCycle();
                }
            });
        }, { threshold: 0.1 });
        heroObserver.observe(heroSection);
    }

    // ── Start cycling (called after typing finishes) ──
    function startHeroCycling() {
        if (!heroIntro || !heroPosts) return;
        scheduleCycle();
    }

    // ── Schedule next switch ──
    function scheduleCycle() {
        clearTimeout(cycleTimer);
        var delay = currentView === 'intro' ? 3000 : 4000;
        cycleTimer = setTimeout(function () {
            if (isPaused || !isHeroVisible || isSwitching) return;
            switchView(currentView === 'intro' ? 'posts' : 'intro');
        }, delay);
    }

    // ── Switch view with glitch + fade animation ──
    function switchView(targetView) {
        if (isSwitching || targetView === currentView) return;
        isSwitching = true;

        // Glitch flash on content area only
        if (glitchEl) {
            glitchEl.classList.remove('active');
            void glitchEl.offsetWidth;
            glitchEl.classList.add('active');
            setTimeout(function () { glitchEl.classList.remove('active'); }, 300);
        }

        var currentEl = currentView === 'intro' ? heroIntro : heroPosts;
        var targetEl = targetView === 'intro' ? heroIntro : heroPosts;

        // Fade out current
        currentEl.classList.add('exiting');
        currentEl.classList.remove('active');

        // After fade-out (300ms matches CSS transition), fade in new view
        setTimeout(function () {
            currentEl.classList.remove('exiting');

            if (targetView === 'posts') {
                resetPosts();
                targetEl.classList.add('active');
                typeCommand(cmdText, cascadePosts);
            } else {
                // Reset whoami elements for re-animation
                if (typedWhoami) typedWhoami.textContent = '';
                if (typedNameElement) typedNameElement.textContent = '';
                if (heroTitle) heroTitle.classList.remove('revealed');
                if (heroSummary) heroSummary.classList.remove('revealed');
                charIndex = 0;

                targetEl.classList.add('active');

                // Animate whoami command, then name, then reveal rest
                typeWhoamiCmd(function() {
                    setTimeout(function() {
                        (function typeNameChar() {
                            if (typedNameElement && charIndex < nameToType.length) {
                                typedNameElement.textContent += nameToType.charAt(charIndex);
                                charIndex++;
                                setTimeout(typeNameChar, 40 + Math.random() * 40);
                            } else {
                                if (heroTitle) heroTitle.classList.add('revealed');
                                if (heroSummary) heroSummary.classList.add('revealed');
                            }
                        })();
                    }, 200);
                });
            }

            currentView = targetView;
            updateDots();
            isSwitching = false;

            // Always reschedule for continuous looping
            if (isHeroVisible && !isPaused) scheduleCycle();
        }, 300);
    }

    // ── Type command character by character ──
    function typeCommand(text, callback) {
        if (!typedCmd) { if (callback) callback(); return; }
        typedCmd.textContent = '';
        var i = 0;
        (function next() {
            if (i < text.length) {
                typedCmd.textContent += text.charAt(i++);
                setTimeout(next, 25 + Math.random() * 20);
            } else if (callback) callback();
        })();
    }

    // ── Cascade post entries in one by one ──
    function cascadePosts() {
        if (!postsList) return;
        var entries = postsList.querySelectorAll('.hero-post-entry, .hero-posts-viewall');
        entries.forEach(function (el, i) {
            setTimeout(function () { el.classList.add('visible'); }, i * 150);
        });
    }

    // ── Reset posts to hidden state ──
    function resetPosts() {
        if (!postsList) return;
        postsList.querySelectorAll('.hero-post-entry, .hero-posts-viewall').forEach(function (el) {
            el.classList.remove('visible');
        });
        if (typedCmd) typedCmd.textContent = '';
    }

    // ── Update dot indicators ──
    function updateDots() {
        dots.forEach(function (d) {
            d.classList.toggle('active', d.getAttribute('data-view') === currentView);
        });
    }

    // ============================================================
    // 5. ACTIVE NAV LINK HIGHLIGHTING
    // Highlights the current section's nav link while scrolling
    // ============================================================

    const sections = document.querySelectorAll('section[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100; // Offset for fixed header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Check if current scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinksForHighlight.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to matching link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Run on scroll with throttling for performance
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(highlightNavLink);
    });

    // Run once on load
    highlightNavLink();

    // ============================================================
    // 6. NAVBAR BACKGROUND ON SCROLL
    // Makes navbar more opaque when scrolled down
    // ============================================================

    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(13, 13, 13, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(13, 13, 13, 0.95)';
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

});

