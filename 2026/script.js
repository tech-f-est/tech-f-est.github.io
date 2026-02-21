// ========================================
// Language Switcher
// ========================================
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'fr';
        this.init();
    }

    init() {
        this.setLanguage(this.currentLang);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const langSwitch = document.querySelector('.lang-switch');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => {
                const newLang = this.currentLang === 'fr' ? 'en' : 'fr';
                this.setLanguage(newLang);
            });
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;

        // Update all elements with language-specific content
        const elements = document.querySelectorAll('[data-fr][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else if (element.tagName === 'BUTTON') {
                    element.textContent = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update language switch button
        this.updateLanguageButton();
    }

    updateLanguageButton() {
        const langFr = document.querySelector('.lang-fr');
        const langEn = document.querySelector('.lang-en');

        if (langFr && langEn) {
            if (this.currentLang === 'fr') {
                langFr.classList.add('active');
                langEn.classList.remove('active');
            } else {
                langFr.classList.remove('active');
                langEn.classList.add('active');
            }
        }
    }
}

// ========================================
// Theme Manager (Dark/Light Mode)
// ========================================
class ThemeManager {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    init() {
        this.setTheme(this.currentTheme);
        this.attachEventListeners();
        this.watchSystemTheme();
    }

    attachEventListeners() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// ========================================
// Mobile Menu
// ========================================
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on a link
        const menuLinks = this.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu on window resize to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded',
            this.menu.classList.contains('active'));
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
}

// ========================================
// Smooth Scroll
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle all anchor links that start with #
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// Intersection Observer for Animations
// ========================================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe cards and sections
        const elementsToAnimate = document.querySelectorAll(`
            .stat-card,
            .benefit-card,
            .highlight-card,
            .testimonial-card,
            .package-card,
            .why-card,
            .contact-card
        `);

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new LanguageManager();
    new ThemeManager();
    new MobileMenu();
    new SmoothScroll();
    new ScrollAnimations();

    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');
});

// ========================================
// Performance: Preload critical resources
// ========================================
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload images or other resources here if needed
    });
}
