/**
 * Martel Paints - Main JavaScript File
 * Comprehensive functionality for the website
 * @version 1.0.0
 * @author Martel Paints
 */

// ============================================================================
// DOM Content Loaded Event
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    TypingEffect.init();
    ParticleSystem.init();
    CounterAnimation.init();
    TestimonialSlider.init();
    OrderForm.init();
    ScrollAnimations.init();
    FloatingElements.init();
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
});

// ============================================================================
// Preloader Module
// ============================================================================
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        
        // Hide preloader after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }
};

// ============================================================================
// Navigation Module
// ============================================================================
const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navOverlay = document.getElementById('navOverlay');
        this.navMenuClose = document.getElementById('navMenuClose');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dropdowns = document.querySelectorAll('.has-dropdown');
        this.isMobile = window.innerWidth <= 992;
        
        this.bindEvents();
        this.handleScroll();
        this.handleResize();
    },
    
    bindEvents() {
        // Hamburger menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        // Close button click
        if (this.navMenuClose) {
            this.navMenuClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMenu();
            });
        }
        
        // Overlay click to close
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Close menu on link click (mobile) - only for non-dropdown items
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const parent = link.parentElement;
                
                if (parent.classList.contains('has-dropdown')) {
                    // On mobile, toggle dropdown
                    if (this.isMobile) {
                        e.preventDefault();
                        this.toggleDropdown(parent);
                    }
                    // On desktop, let the link work normally (smooth scroll)
                } else {
                    // Regular link - close menu and navigate
                    this.closeMenu();
                    this.setActiveLink(link);
                }
            });
        });
        
        // Scroll event for navbar styling
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    },
    
    toggleMenu() {
        const isOpen = this.navMenu.classList.contains('active');
        
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },
    
    openMenu() {
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        if (this.navOverlay) {
            this.navOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
        
        // Close all dropdowns when opening menu
        this.dropdowns.forEach(d => d.classList.remove('active'));
    },
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        if (this.navOverlay) {
            this.navOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
        
        // Close all dropdowns
        this.dropdowns.forEach(d => d.classList.remove('active'));
    },
    
    toggleDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');
        
        // Close all other dropdowns
        this.dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active', !isActive);
    },
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    },
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        this.updateActiveLinkOnScroll();
    },
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 992;
        
        // If transitioning from mobile to desktop, close the menu
        if (wasMobile && !this.isMobile) {
            this.closeMenu();
        }
    },
    
    updateActiveLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

// ============================================================================
// Typing Effect Module
// ============================================================================
const TypingEffect = {
    init() {
        this.element = document.getElementById('typingText');
        if (!this.element) return;
        
        this.words = ['Color', 'Style', 'Beauty', 'Elegance', 'Perfection'];
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;
        
        this.type();
    },
    
    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
};

// ============================================================================
// Particle System Module
// ============================================================================
const ParticleSystem = {
    init() {
        this.container = document.getElementById('particles');
        if (!this.container) return;
        
        this.particleCount = 30;
        this.colors = ['#FF6B35', '#F7C600', '#1A365D'];
        
        this.createParticles();
    },
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 15 + 5;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 10;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                opacity: ${Math.random() * 0.5 + 0.2};
            `;
            
            this.container.appendChild(particle);
        }
    }
};

// ============================================================================
// Counter Animation Module
// ============================================================================
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        if (this.counters.length === 0) return;
        
        this.animateOnScroll();
        window.addEventListener('scroll', () => this.animateOnScroll());
    },
    
    animateOnScroll() {
        this.counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                this.animateCounter(counter);
            }
        });
    },
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }
};

// ============================================================================
// Testimonial Slider Module
// ============================================================================
const TestimonialSlider = {
    init() {
        this.slider = document.querySelector('.testimonials-slider');
        this.track = document.querySelector('.testimonials-track');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.dotsContainer = document.querySelector('.testimonials-dots');
        
        if (!this.slider || this.cards.length === 0) return;
        
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.visibleCards = this.getVisibleCards();
        this.maxIndex = this.cards.length - this.visibleCards;
        
        this.createDots();
        this.bindEvents();
        this.updateSlider();
        this.startAutoPlay();
    },
    
    getVisibleCards() {
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    },
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i <= this.maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        this.dots = this.dotsContainer.querySelectorAll('.testimonial-dot');
    },
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.next();
                else this.prev();
                isDragging = false;
            }
        });
        
        this.slider.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.visibleCards = this.getVisibleCards();
            this.maxIndex = this.cards.length - this.visibleCards;
            this.createDots();
            this.updateSlider();
        });
    },
    
    prev() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updateSlider();
    },
    
    next() {
        this.currentIndex = Math.min(this.maxIndex, this.currentIndex + 1);
        this.updateSlider();
    },
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    },
    
    updateSlider() {
        if (!this.track) return;
        
        const gap = 24; // Space between cards
        this.cardWidth = this.cards[0].offsetWidth + gap;
        const translateX = -this.currentIndex * this.cardWidth;
        
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.maxIndex;
            this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
        }
    },
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex < this.maxIndex) {
                this.next();
            } else {
                this.currentIndex = 0;
                this.updateSlider();
            }
        }, 5000);
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });
        
        this.slider.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
};

// ============================================================================
// Order Form Module
// ============================================================================
const OrderForm = {
    init() {
        this.form = document.getElementById('orderForm');
        if (!this.form) return;
        
        this.whatsappNumber = '254766707022';
        this.bindEvents();
    },
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        this.clearError(field);
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9]{10,}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    },
    
    showError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(errorElement);
        }
    },
    
    clearError(field) {
        field.classList.remove('error');
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    },
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Build WhatsApp message
        const formData = new FormData(this.form);
        const message = this.buildWhatsAppMessage(formData);
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Show success notification
        this.showNotification('Thank you! Redirecting to WhatsApp...', 'success');
        
        // Reset form
        this.form.reset();
    },
    
    buildWhatsAppMessage(formData) {
        const fullName = formData.get('fullName');
        const phone = formData.get('phone');
        const email = formData.get('email') || 'Not provided';
        const category = formData.get('productCategory');
        const quantity = formData.get('quantity');
        const details = formData.get('productDetails') || 'Not specified';
        const location = formData.get('deliveryLocation');
        const message = formData.get('message') || 'No additional message';
        
        return `
🎨 *NEW ORDER - MARTEL PAINTS* 🎨

👤 *Customer Details:*
Name: ${fullName}
Phone: ${phone}
Email: ${email}

📦 *Order Details:*
Category: ${category}
Quantity: ${quantity}
Product Details: ${details}

📍 *Delivery Location:*
${location}

📝 *Additional Message:*
${message}

---
Sent from Martel Paints Website
        `.trim();
    },
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
};

// ============================================================================
// Scroll Animations Module
// ============================================================================
const ScrollAnimations = {
    init() {
        this.scrollTopBtn = document.getElementById('scrollTop');
        this.animatedElements = document.querySelectorAll('[data-animate]');
        
        this.bindEvents();
        this.handleScroll();
    },
    
    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        
        if (this.scrollTopBtn) {
            this.scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },
    
    handleScroll() {
        // Show/hide scroll to top button
        if (this.scrollTopBtn) {
            if (window.scrollY > 500) {
                this.scrollTopBtn.classList.add('visible');
            } else {
                this.scrollTopBtn.classList.remove('visible');
            }
        }
        
        // Animate elements on scroll
        this.animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                element.classList.add('animated');
            }
        });
    }
};

// ============================================================================
// Floating Elements Module
// ============================================================================
const FloatingElements = {
    init() {
        this.floatingElements = document.querySelectorAll('.image-float, .float-1, .float-2');
        this.addParallaxEffect();
    },
    
    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            this.floatingElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function}
 */
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

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset from viewport edge
 * @returns {boolean}
 */
function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string}
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================================
// CSS Animation Keyframes (injected via JS)
// ============================================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
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
    
    .notification {
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545 !important;
    }
    
    .error-message {
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    /* Loading state for buttons */
    .btn-loading {
        position: relative;
        pointer-events: none;
    }
    
    .btn-loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Image lazy loading placeholder */
    .img-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;
document.head.appendChild(styleSheet);

// ============================================================================
// Gallery Lightbox (Simple Implementation)
// ============================================================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (!img) return;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const overlay = lightbox.querySelector('.lightbox-overlay');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            z-index: 1;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            border-radius: 8px;
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close handlers
        const closeLightbox = () => {
            lightbox.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    });
});

// ============================================================================
// Newsletter Form Handler
// ============================================================================
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            // Show success message
            const notification = document.createElement('div');
            notification.className = 'notification notification-success';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Thank you for subscribing!</span>
            `;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                background: #28a745;
                color: white;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
            
            this.reset();
        }
    });
});

// ============================================================================
// Console Welcome Message
// ============================================================================
console.log('%c🎨 Welcome to Martel Paints! 🎨', 'color: #FF6B35; font-size: 24px; font-weight: bold;');
console.log('%cLife is art, live yours in color.', 'color: #1A365D; font-size: 14px;');
console.log('%cContact us: 0766 707 022', 'color: #25D366; font-size: 12px;');
