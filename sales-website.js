// Stunning Sales Website JavaScript
class SalesWebsite {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeAnimations();
        this.initializeScrollEffects();
    }

    initializeElements() {
        // Navigation elements
        this.navbar = document.querySelector('.navbar');
        this.navMenu = document.querySelector('.nav-menu');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Hero elements
        this.heroTitle = document.querySelector('.hero-title');
        this.heroButtons = document.querySelectorAll('.hero-buttons button');
        
        // Product elements
        this.productCards = document.querySelectorAll('.product-card');
        this.addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        // CTA elements
        this.ctaButton = document.querySelector('.cta-button');
        
        // Newsletter form
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.newsletterInput = document.querySelector('.newsletter-form input');
        this.newsletterButton = document.querySelector('.newsletter-form button');
    }

    bindEvents() {
        // Mobile menu toggle
        this.hamburger?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleNavbarScroll());
        
        // Product card interactions
        this.productCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleProductHover(card, true));
            card.addEventListener('mouseleave', () => this.handleProductHover(card, false));
        });
        
        // Add to cart buttons
        this.addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleAddToCart(e));
        });
        
        // CTA button
        this.ctaButton?.addEventListener('click', () => this.handleCTAClick());
        
        // Newsletter form
        this.newsletterForm?.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        
        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    initializeAnimations() {
        // Animate hero elements on load
        setTimeout(() => {
            this.animateHeroElements();
        }, 100);
        
        // Add floating animation to shapes
        this.animateFloatingShapes();
        
        // Add parallax effect to hero section
        this.setupParallax();
    }

    initializeScrollEffects() {
        // Initialize scroll reveal animations
        this.setupScrollReveal();
        
        // Add smooth reveal for sections
        this.revealSections();
    }

    toggleMobileMenu() {
        this.navMenu?.classList.toggle('active');
        this.hamburger?.classList.toggle('active');
        
        // Animate hamburger
        const spans = this.hamburger?.querySelectorAll('span');
        if (spans) {
            spans.forEach((span, index) => {
                if (this.navMenu?.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            this.navMenu?.classList.remove('active');
        }
    }

    handleNavbarScroll() {
        if (window.scrollY > 100) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }

    handleProductHover(card, isHovering) {
        const image = card.querySelector('.product-image-placeholder');
        const overlay = card.querySelector('.product-overlay');
        
        if (isHovering) {
            image?.style.transform = 'scale(1.1)';
            overlay?.style.opacity = '1';
        } else {
            image?.style.transform = 'scale(1)';
            overlay?.style.opacity = '0';
        }
    }

    handleAddToCart(e) {
        e.preventDefault();
        const button = e.target;
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Add loading state
        const originalText = button.textContent;
        button.textContent = 'Adding...';
        button.disabled = true;
        
        // Simulate adding to cart
        setTimeout(() => {
            button.textContent = '✓ Added!';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Show success notification
            this.showNotification(`${productName} added to cart!`, 'success');
            
            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        }, 1000);
    }

    handleCTAClick() {
        // Smooth scroll to products section
        const productsSection = document.querySelector('#products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = this.newsletterInput?.value;
        
        if (email && this.validateEmail(email)) {
            // Add loading state
            const originalText = this.newsletterButton.textContent;
            this.newsletterButton.textContent = 'Subscribing...';
            this.newsletterButton.disabled = true;
            
            // Simulate subscription
            setTimeout(() => {
                this.newsletterButton.textContent = '✓ Subscribed!';
                this.newsletterButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                
                this.showNotification('Successfully subscribed to newsletter!', 'success');
                
                // Reset form
                setTimeout(() => {
                    this.newsletterInput.value = '';
                    this.newsletterButton.textContent = originalText;
                    this.newsletterButton.disabled = false;
                    this.newsletterButton.style.background = '';
                }, 2000);
            }, 1000);
        } else {
            this.showNotification('Please enter a valid email address', 'error');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                        type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    animateHeroElements() {
        // Animate title lines
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Animate subtitle
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            setTimeout(() => {
                subtitle.style.opacity = '0.9';
                subtitle.style.transform = 'translateY(0)';
            }, 800);
        }
        
        // Animate buttons
        this.heroButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 1000 + (index * 200));
        });
        
        // Animate stats
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, 1400 + (index * 100));
        });
    }

    animateFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const randomDelay = Math.random() * 5;
            const randomDuration = 5 + Math.random() * 10;
            
            shape.style.animationDelay = `${randomDelay}s`;
            shape.style.animationDuration = `${randomDuration}s`;
        });
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.shape, .floating-cards .card');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);
        
        // Observe elements
        const animateElements = document.querySelectorAll('.product-card, .feature-item, .testimonial-card');
        animateElements.forEach(el => observer.observe(el));
    }

    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .features-content, .cta-content');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }

    revealSections() {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transition = 'opacity 0.8s ease';
            sectionObserver.observe(section);
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .section-visible {
        opacity: 1 !important;
    }
`;
document.head.appendChild(style);

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SalesWebsite();
});
