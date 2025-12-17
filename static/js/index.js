// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page initialized');
    
    // Initialize all modules
    initNavigation();
    initAnimations();
    initCounters();
    initSmoothScroll();
    initTestimonials();
    initBackToTop();
    initMobileMenu();
    
    // Preload images
    preloadImages();
});

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Update desktop nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update mobile nav links
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile menu when clicking on links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) && 
            mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Animations
function initAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // If it's a counter element, start counting
                if (entry.target.classList.contains('stat-number')) {
                    const finalValue = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, finalValue);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.feature-card, .step, .destination-card, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // Observe counter elements
    const counterElements = document.querySelectorAll('.stat-number');
    counterElements.forEach(el => observer.observe(el));
}

// Counter Animation
function initCounters() {
    // This is handled by the intersection observer above
}

function animateCounter(element, finalValue) {
    let currentValue = 0;
    const increment = finalValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        
        // Format number
        let displayValue;
        if (finalValue >= 1000) {
            displayValue = Math.floor(currentValue / 1000) + 'K+';
        } else {
            displayValue = Math.floor(currentValue);
        }
        
        element.textContent = displayValue;
    }, 30);
}

// Smooth Scroll
function initSmoothScroll() {
    // This is handled by the navigation function
}

// Testimonials Slider
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Simple auto-rotate testimonials
    setInterval(() => {
        testimonialCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
        });
        
        testimonialCards[currentIndex].style.opacity = '1';
        testimonialCards[currentIndex].style.transform = 'scale(1)';
        
        currentIndex = (currentIndex + 1) % testimonialCards.length;
    }, 5000);
    
    // Initialize first card
    if (testimonialCards.length > 0) {
        testimonialCards[0].style.opacity = '1';
        testimonialCards[0].style.transform = 'scale(1)';
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Image Preloading
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1562887189-e5d078343de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .step,
    .destination-card,
    .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.animate,
    .step.animate,
    .destination-card.animate,
    .testimonial-card.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .step:nth-child(1).animate { transition-delay: 0.1s; }
    .step:nth-child(2).animate { transition-delay: 0.2s; }
    .step:nth-child(3).animate { transition-delay: 0.3s; }
    .step:nth-child(4).animate { transition-delay: 0.4s; }
    
    .feature-card:nth-child(1).animate { transition-delay: 0.1s; }
    .feature-card:nth-child(2).animate { transition-delay: 0.2s; }
    .feature-card:nth-child(3).animate { transition-delay: 0.3s; }
    .feature-card:nth-child(4).animate { transition-delay: 0.4s; }
    .feature-card:nth-child(5).animate { transition-delay: 0.5s; }
    .feature-card:nth-child(6).animate { transition-delay: 0.6s; }
    
    /* Animated bus track */
    .animated-bus::before {
        content: '';
        position: absolute;
        bottom: -10px;
        left: -100px;
        right: -100px;
        height: 4px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            var(--secondary) 20%, 
            var(--secondary) 80%, 
            transparent 100%
        );
        border-radius: 2px;
    }
    
    /* Pulse animation for CTA buttons */
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
        }
    }
    
    .btn-primary {
        animation: pulse 2s infinite;
    }
    
    /* Loading animation for images */
    .destination-image img {
        filter: blur(5px);
        transition: filter 0.5s ease;
    }
    
    .destination-image img.loaded {
        filter: blur(0);
    }
`;
document.head.appendChild(style);

// Image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Form handling for newsletter (if added later)
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Terima kasih! Anda telah berlangganan newsletter kami.', 'success');
                this.reset();
            }, 1000);
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="position: fixed; top: 30px; right: 30px; background: ${type === 'success' ? '#2ecc71' : '#3498db'}; 
             color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); 
             display: flex; align-items: center; gap: 10px; z-index: 10000; transform: translateX(120%); 
             transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.querySelector('div').style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.querySelector('div').style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 5000);
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Add loaded class to body for any post-load animations
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats, .hero-cta');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});