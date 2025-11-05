/**
 * Modern Portfolio Website - JavaScript
 * Features: Mobile menu, scroll animations, smooth scrolling, intersection observer
 */

// =================================
// Utility Functions
// =================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait = 20) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// =================================
// Mobile Menu
// =================================

class MobileMenu {
    constructor() {
        this.toggle = $('.mobile-menu-toggle');
        this.menu = $('.nav-links');
        this.menuItems = $$('.nav-links .nav-item a');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking on a link
        this.menuItems.forEach(item => {
            item.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.menu.classList.toggle('active');

        // Toggle body scroll
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// =================================
// Smooth Scrolling
// =================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Ignore empty hash or just '#'
                if (!href || href === '#') return;

                const target = $(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 100;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// =================================
// Scroll Header Effect
// =================================

class ScrollHeader {
    constructor() {
        this.header = $('header');
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        if (!this.header) return;

        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, 10));
    }
}

// =================================
// Intersection Observer for Animations
// =================================

class ScrollReveal {
    constructor() {
        this.elements = $$('.fade-in');
        this.init();
    }

    init() {
        if (!this.elements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// =================================
// Cursor Trail Effect (Optional)
// =================================

class CursorTrail {
    constructor() {
        this.coords = { x: 0, y: 0 };
        this.circles = [];
        this.colors = [
            'rgba(100, 255, 218, 0.3)',
            'rgba(100, 255, 218, 0.25)',
            'rgba(100, 255, 218, 0.2)',
            'rgba(100, 255, 218, 0.15)',
            'rgba(100, 255, 218, 0.1)'
        ];
        this.init();
    }

    init() {
        // Only enable on desktop
        if (window.innerWidth < 768) return;

        // Create circle elements
        this.colors.forEach((color, index) => {
            const circle = document.createElement('div');
            circle.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: ${10 - index * 2}px;
                height: ${10 - index * 2}px;
                border-radius: 50%;
                background: ${color};
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(circle);
            this.circles.push(circle);
        });

        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
            this.coords.x = e.clientX;
            this.coords.y = e.clientY;
        });

        // Animate circles
        this.animateCircles();
    }

    animateCircles() {
        let x = this.coords.x;
        let y = this.coords.y;

        this.circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(this.circles.length - index) / this.circles.length})`;

            const nextCircle = this.circles[index + 1] || this.circles[0];
            x += (parseInt(nextCircle.style.left) - x) * 0.3;
            y += (parseInt(nextCircle.style.top) - y) * 0.3;
        });

        requestAnimationFrame(() => this.animateCircles());
    }
}

// =================================
// Typing Effect (Optional for hero)
// =================================

class TypingEffect {
    constructor(element, words, typingSpeed = 100, deletingSpeed = 50, delayBetweenWords = 2000) {
        this.element = element;
        this.words = words;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.delayBetweenWords = delayBetweenWords;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element) return;
        this.type();
    }

    type() {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            typeSpeed = this.delayBetweenWords;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// =================================
// Active Section Highlighter
// =================================

class ActiveSectionHighlighter {
    constructor() {
        this.sections = $$('section[id]');
        this.navLinks = $$('.nav-links a[href^="#"]');
        this.init();
    }

    init() {
        if (!this.sections.length || !this.navLinks.length) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -66% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target.id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveLink(id) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
}

// =================================
// Performance Monitoring
// =================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            // Monitor long tasks
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Log performance metrics if needed
                    console.log('Performance entry:', entry);
                }
            });

            try {
                observer.observe({ entryTypes: ['navigation', 'paint'] });
            } catch (e) {
                // PerformanceObserver not fully supported
                console.log('PerformanceObserver not fully supported');
            }
        }
    }
}

// =================================
// Preloader (Optional)
// =================================

class Preloader {
    constructor() {
        this.preloader = $('.preloader');
        this.init();
    }

    init() {
        if (!this.preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.preloader.style.opacity = '0';
                setTimeout(() => {
                    this.preloader.style.display = 'none';
                }, 300);
            }, 500);
        });
    }
}

// =================================
// Initialize Everything
// =================================

class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initComponents());
        } else {
            this.initComponents();
        }
    }

    initComponents() {
        // Initialize all components
        new MobileMenu();
        new SmoothScroll();
        new ScrollHeader();
        new ScrollReveal();
        new ActiveSectionHighlighter();

        // Optional components (uncomment to enable)
        // new CursorTrail();
        // new PerformanceMonitor();
        // new Preloader();

        // Optional typing effect for hero title
        // const heroTitle = $('.hero-title');
        // if (heroTitle) {
        //     new TypingEffect(heroTitle, [
        //         'I build secure digital systems.',
        //         'I create innovative solutions.',
        //         'I solve complex problems.'
        //     ]);
        // }

        console.log('%c🚀 Portfolio loaded successfully!', 'color: #64ffda; font-size: 16px; font-weight: bold;');
    }
}

// Start the application
new App();

// =================================
// Export for use in other modules (if needed)
// =================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileMenu,
        SmoothScroll,
        ScrollHeader,
        ScrollReveal,
        CursorTrail,
        TypingEffect,
        ActiveSectionHighlighter
    };
}
