// DOM Elements
const ctaButton = document.getElementById('ctaButton');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const signupForm = document.getElementById('signupForm');
const scrollTopButton = document.getElementById('scrollTop');
const featureCards = document.querySelectorAll('.feature-card');

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll to Top Functionality
function toggleScrollTopButton() {
    const scrolled = window.pageYOffset;
    const threshold = 300;
    
    if (scrolled > threshold) {
        scrollTopButton.classList.add('show');
    } else {
        scrollTopButton.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Modal Functionality
function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus first input for accessibility
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function handleModalClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitButton = event.target.querySelector('.modal-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for signing up! We\'ll be in touch soon.');
        closeModal();
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Scroll Animation for Feature Cards
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    featureCards.forEach(card => {
        observer.observe(card);
    });
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.src;
        });
    }
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes modal
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
        
        // Enter key on CTA button opens modal
        if (e.key === 'Enter' && document.activeElement === ctaButton) {
            e.preventDefault();
            openModal();
        }
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    const handleScroll = debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// Performance Optimization
function initPerformanceOptimizations() {
    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = 'assets/testimonial-1.svg';
    document.head.appendChild(preloadLink);
    
    // Add loading states
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', () => {
        form.classList.add('loading');
    });
}

// Error Handling
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });
    
    // Handle image loading errors
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            console.warn('Failed to load image:', img.src);
        });
    });
}

// Analytics (placeholder)
function trackEvent(eventName, eventData = {}) {
    // This would integrate with your analytics service
    console.log('Event tracked:', eventName, eventData);
}

// Event Listeners
function initEventListeners() {
    // Scroll events
    window.addEventListener('scroll', debounce(toggleScrollTopButton, 10));
    scrollTopButton.addEventListener('click', scrollToTop);
    
    // Modal events
    ctaButton.addEventListener('click', () => {
        openModal();
        trackEvent('cta_clicked');
    });
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', handleModalClick);
    
    // Form events
    signupForm.addEventListener('submit', handleFormSubmit);
    
    // Track feature card interactions
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            trackEvent('feature_card_hover', { cardIndex: index });
        });
    });
}

// Initialize Application
function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    try {
        initEventListeners();
        initSmoothScrolling();
        initKeyboardNavigation();
        initHeaderScrollEffect();
        initLazyLoading();
        initPerformanceOptimizations();
        initErrorHandling();
        animateOnScroll();
        
        // Track page load
        trackEvent('page_loaded');
        
        console.log('CloudSync Pro landing page initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Start the application
init();

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openModal,
        closeModal,
        scrollToTop,
        trackEvent
    };
}