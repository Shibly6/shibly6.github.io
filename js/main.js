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
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================================
    // 1. MOBILE NAVIGATION TOGGLE
    // Opens/closes the hamburger menu on mobile devices
    // ============================================================
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            // Toggle the 'active' class on both button and menu
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
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
        link.addEventListener('click', function(e) {
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
        const fadeObserver = new IntersectionObserver(function(entries, observer) {
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
    const nameToType = 'Noor Elahi Ali Shibly';
    let charIndex = 0;
    
    function typeCharacter() {
        if (typedNameElement && charIndex < nameToType.length) {
            // Add one character at a time
            typedNameElement.textContent += nameToType.charAt(charIndex);
            charIndex++;
            // Random delay for more natural typing feel (80-150ms)
            const delay = Math.floor(Math.random() * 70) + 80;
            setTimeout(typeCharacter, delay);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeCharacter, 500);
    
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
    window.addEventListener('scroll', function() {
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

// ============================================================
// CONSOLE EASTER EGG
// A fun message for developers who open the console
// ============================================================
console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold;');
console.log('%c🔐 Interested in security? Check out my GitHub: https://github.com/Shibly6', 'font-size: 14px;');
console.log('%c💡 This portfolio was built with vanilla HTML, CSS, and JavaScript.', 'font-size: 12px; color: #00FF88;');
