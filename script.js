// Fallback function to make AOS elements visible (moved to top for immediate access)
function makeAOSElementsVisible() {
    document.querySelectorAll('[data-aos]').forEach(function(element) {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.transition = 'opacity 0.3s ease';
    });
}

// Immediate execution to ensure content is visible ASAP
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeAOSElementsVisible);
} else {
    makeAOSElementsVisible();
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Immediate fallback for content visibility
    makeAOSElementsVisible();
    
    // Initialize all components
    try {
        initializeNavigation();
        initializeCountdown();
        initializeAnimations();
        initializeFormHandling();
        initializeScrollEffects();
        initializeParallaxEffects();
    } catch (error) {
        console.warn('Error during initialization:', error);
        // Ensure content is visible even if there are errors
        makeAOSElementsVisible();
    }
    
    // Additional safety check after 1 second to ensure all content is visible
    setTimeout(function() {
        if (document.querySelectorAll('[data-aos]').length > 0) {
            document.querySelectorAll('[data-aos]').forEach(function(element) {
                const isVisible = window.getComputedStyle(element).opacity !== '0';
                if (!isVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                    element.style.transition = 'opacity 0.3s ease';
                }
            });
        }
    }, 1000);
});

// Navigation functionality
function initializeNavigation() {
    // Create mobile menu
    function createMobileMenu() {
        // Check if mobile menu already exists
        if (document.querySelector('.mobile-nav-menu')) {
            return;
        }

        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-nav-menu';
        
        // Get navigation links from the desktop menu
        const desktopLinks = document.querySelectorAll('.nav-menu a');
        
        desktopLinks.forEach(link => {
            const mobileLink = document.createElement('a');
            mobileLink.href = link.href;
            mobileLink.textContent = link.textContent;
            mobileLink.className = 'mobile-nav-link';
            
            // Copy classes for styling
            if (link.classList.contains('active')) {
                mobileLink.classList.add('active');
            }
            if (link.classList.contains('proposal-link')) {
                mobileLink.classList.add('proposal-link');
                mobileLink.target = '_blank';
            }
            
            mobileMenu.appendChild(mobileLink);
        });

        document.body.appendChild(mobileMenu);
        return mobileMenu;
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenuToggle) {
        let mobileMenu = null;
        let isMenuOpen = false;

        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu toggle clicked');
            
            // Create mobile menu if it doesn't exist
            if (!mobileMenu) {
                mobileMenu = createMobileMenu();
            }
            
            mobileMenuToggle.classList.toggle('active');
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                console.log('Opening mobile menu');
                mobileMenu.classList.add('active');
                
                // Create overlay
                let overlay = document.querySelector('.mobile-menu-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'mobile-menu-overlay';
                    document.body.appendChild(overlay);
                    overlay.addEventListener('click', closeMobileMenu);
                }
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                closeMobileMenu();
            }
        });

        // Close mobile menu function
        function closeMobileMenu() {
            console.log('Closing mobile menu');
            isMenuOpen = false;
            mobileMenuToggle.classList.remove('active');
            
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            
            const overlay = document.querySelector('.mobile-menu-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
            document.body.style.overflow = '';
        }

        // Close menu when clicking links
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('mobile-nav-link')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on window resize if screen becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMobileMenu();
            }
        });
    } else {
        console.log('Mobile menu toggle not found');
    }

    // Navbar scroll effect
    let ticking = false;
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// Countdown timer to July 4, 2033
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    // Only initialize countdown if the element exists (index page)
    if (!countdownElement) {
        return;
    }
    
    const targetDate = new Date('2033-07-04T00:00:00-05:00').getTime(); // Chicago time (CDT)

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = '<div class="countdown-item"><div class="number">OPEN</div><div class="label">NOW</div></div>';
            return;
        }

        const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
        const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div class="countdown-item">
                <div class="number">${years}</div>
                <div class="label">Years</div>
            </div>
            <div class="countdown-item">
                <div class="number">${days}</div>
                <div class="label">Days</div>
            </div>
            <div class="countdown-item">
                <div class="number">${hours}</div>
                <div class="label">Hours</div>
            </div>
            <div class="countdown-item">
                <div class="number">${minutes}</div>
                <div class="label">Minutes</div>
            </div>
            <div class="countdown-item">
                <div class="number">${seconds}</div>
                <div class="label">Seconds</div>
            </div>
        `;
    }

    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize scroll animations
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll) with fallback
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        } catch (error) {
            console.warn('AOS initialization failed:', error);
            // Fallback: make all AOS elements visible
            makeAOSElementsVisible();
        }
    } else {
        // AOS not loaded, make all elements visible
        makeAOSElementsVisible();
    }

    // Add intersection observer for custom animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat, .concept-card, .attraction-card, .impact-item').forEach(el => {
        observer.observe(el);
    });
}

// Form handling
function initializeFormHandling() {
    const form = document.getElementById('newsletter-form');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[name="email"]').value;
            const name = form.querySelector('input[name="name"]').value;
            const message = form.querySelector('textarea[name="message"]').value;
            const checkbox = form.querySelector('input[name="consent"]').checked;
            
            if (!email || !name || !checkbox) {
                alert('Please fill in all required fields and consent to receiving communications.');
                return;
            }
            
            const submitButton = form.querySelector('button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                // Submit to Formspree
                const response = await fetch('https://formspree.io/f/xdkdebqe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        name: name,
                        message: message,
                        consent: checkbox
                    })
                });
                
                if (response.ok) {
                    // Replace the entire contact form with thank you message
                    const contactForm = document.querySelector('.contact-form');
                    contactForm.innerHTML = `
                        <div class="thank-you-message">
                            <h3>Petition Received</h3>
                            <div class="thank-you-content">
                                <div class="thank-you-icon">✓</div>
                                <p>Your request has been submitted to Despot Park Command.</p>
                                <p>Expect a response from our Ministry of Visitor Relations within 24-48 hours.</p>
                                <p><strong>Compliance is appreciated, Comrade ${name}.</strong></p>
                            </div>
                        </div>
                    `;
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                alert('Failed to submit petition. Please try again or contact the Ministry directly.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Notification system (removed - using inline form messages instead)

// Scroll effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, #dc2626, #f59e0b);
        z-index: 10001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Parallax effects
function initializeParallaxEffects() {
    // Disable parallax on mobile devices to prevent overlay issues
    if (window.innerWidth <= 768) return;
    
    const parallaxElements = document.querySelectorAll('.hero::before, .concept-art');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('concept-art')) {
                element.style.transform = `translateY(${rate * 0.3}px)`;
            }
        });
    });
    
    // Disable parallax on window resize if screen becomes mobile size
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            parallaxElements.forEach(element => {
                if (element.classList.contains('concept-art')) {
                    element.style.transform = 'none';
                }
            });
        }
    });
}

// Number animation for stats
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize number animations when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statElement = entry.target.querySelector('h3');
            const text = statElement.textContent;
            
            if (text.includes('110')) {
                animateNumber(statElement, 110);
            } else if (text.includes('2.9')) {
                statElement.textContent = '0';
                animateNumber(statElement, 2.9);
                setTimeout(() => {
                    statElement.textContent = '$2.9B';
                }, 2000);
            } else if (text.includes('2033')) {
                animateNumber(statElement, 2033);
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stat elements (only if they exist)
const statElements = document.querySelectorAll('.stat');
if (statElements.length > 0) {
    statElements.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Easter eggs and interactive elements
function initializeEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            alert('Comrade! You have unlocked the secret of the revolution! 🎉');
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 3000);
        }
    });
}

// Initialize easter eggs
initializeEasterEggs();

// Initialize mobile-specific features
initializeMobileFeatures();

// Performance optimizations
function optimizePerformance() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounced scroll handler
    let ticking = false;
    function updateScrollAnimations() {
        // Your scroll animations here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimations);
            ticking = true;
        }
    });
}

// Initialize performance optimizations
optimizePerformance();

// FAQ toggle functionality (handled by inline script in faqs.html)
// function initializeFAQs() - removed to prevent conflicts

// Mobile-specific features
function initializeMobileFeatures() {
    // Improve touch interactions
    const touchElements = document.querySelectorAll('.cta-button, .concept-card, .attraction-card, .value-card');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Handle viewport height changes (mobile address bar)
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
    
    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('.cta-button, button');
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
    
    // Smooth scroll polyfill for older mobile browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Export functions for potential external use
window.DespotPark = {
    animateNumber,
    initializeCountdown,
    initializeMobileFeatures
}; 