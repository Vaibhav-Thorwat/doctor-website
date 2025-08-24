// Medical Services Website JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('Medical Services Website loaded successfully!');

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight + 
                                       document.querySelector('.top-info-bar').offsetHeight;
                    window.scrollTo({
                        top: targetElement.offsetTop - navbarHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Services Carousel Functionality
    const servicesCarouselWrapper = document.querySelector('.services-carousel-wrapper');
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceCards = Array.from(servicesGrid.children);
    const dotsContainer = document.querySelector('.carousel-dots');
    let dots = [];
    let autoScrollInterval;
    let currentIndex = 0;

    // Initialize carousel dots
    const initializeDots = () => {
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        dots = [];

        // Create dots based on number of cards
        const totalCards = serviceCards.length;
        const visibleCards = Math.floor(servicesCarouselWrapper.clientWidth / (serviceCards[0].offsetWidth + 30));
        const totalDots = Math.max(1, totalCards - visibleCards + 1);

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                scrollToIndex(i);
                stopAutoScroll();
                startAutoScroll();
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    };

    // Scroll to specific index
    const scrollToIndex = (index) => {
        if (!serviceCards.length) return;
        
        const cardWidth = serviceCards[0].offsetWidth + 30; // Card width + gap
        const scrollPosition = index * cardWidth;
        
        servicesCarouselWrapper.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        currentIndex = index;
        updateDots();
    };

    // Update active dot
    const updateDots = () => {
        if (!dots.length) return;

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Auto scroll functionality
    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            const maxIndex = dots.length - 1;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            scrollToIndex(currentIndex);
        }, 4000); // Auto scroll every 4 seconds
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    // Handle manual scroll to update dots
    const handleScroll = () => {
        if (!serviceCards.length || !dots.length) return;
        
        const scrollLeft = servicesCarouselWrapper.scrollLeft;
        const cardWidth = serviceCards[0].offsetWidth + 30;
        const newIndex = Math.round(scrollLeft / cardWidth);
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < dots.length) {
            currentIndex = newIndex;
            updateDots();
        }
    };

    // Initialize carousel if elements exist
    if (servicesCarouselWrapper && servicesGrid && serviceCards.length > 0) {
        // Wait for images to load before initializing
        setTimeout(() => {
            initializeDots();
            startAutoScroll();
        }, 100);

        // Event listeners
        servicesCarouselWrapper.addEventListener('mouseenter', stopAutoScroll);
        servicesCarouselWrapper.addEventListener('mouseleave', startAutoScroll);
        servicesCarouselWrapper.addEventListener('scroll', handleScroll);

        // Drag functionality
        let isDown = false;
        let startX;
        let scrollLeft;

        servicesCarouselWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            servicesCarouselWrapper.style.cursor = 'grabbing';
            startX = e.pageX - servicesCarouselWrapper.offsetLeft;
            scrollLeft = servicesCarouselWrapper.scrollLeft;
            stopAutoScroll();
        });

        servicesCarouselWrapper.addEventListener('mouseleave', () => {
            isDown = false;
            servicesCarouselWrapper.style.cursor = 'grab';
            startAutoScroll();
        });

        servicesCarouselWrapper.addEventListener('mouseup', () => {
            isDown = false;
            servicesCarouselWrapper.style.cursor = 'grab';
            startAutoScroll();
        });

        servicesCarouselWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - servicesCarouselWrapper.offsetLeft;
            const walk = (x - startX) * 2;
            servicesCarouselWrapper.scrollLeft = scrollLeft - walk;
        });

        // Arrow navigation
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        if (leftArrow && rightArrow) {
            leftArrow.addEventListener('click', () => {
                const newIndex = currentIndex > 0 ? currentIndex - 1 : dots.length - 1;
                scrollToIndex(newIndex);
                stopAutoScroll();
                startAutoScroll();
            });

            rightArrow.addEventListener('click', () => {
                const newIndex = currentIndex < dots.length - 1 ? currentIndex + 1 : 0;
                scrollToIndex(newIndex);
                stopAutoScroll();
                startAutoScroll();
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            setTimeout(() => {
                initializeDots();
                scrollToIndex(0);
            }, 100);
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    const topInfoBar = document.querySelector('.top-info-bar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Stats counter animation
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + (stat.querySelector('span') ? '+' : '');
            }, 30);
        });
        
        statsAnimated = true;
    };

    // Intersection Observer for stats animation
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // FAQ Accordion functionality
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // Close other accordions when one is opened
            if (this.checked) {
                accordionToggles.forEach(otherToggle => {
                    if (otherToggle !== this) {
                        otherToggle.checked = false;
                    }
                });
            }
        });
    });

    // Testimonials carousel functionality
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-nav-dots .dot');
    const testimonialLeftArrow = document.getElementById('testimonialLeftArrow');
    const testimonialRightArrow = document.getElementById('testimonialRightArrow');
    let currentTestimonial = 0;
    let testimonialInterval;

    const showTestimonial = (index) => {
        testimonialCards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentTestimonial = index;
    };

    const nextTestimonial = () => {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
    };

    const prevTestimonial = () => {
        const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prev);
    };

    const startTestimonialCarousel = () => {
        testimonialInterval = setInterval(nextTestimonial, 5000); // Change every 5 seconds
    };

    const stopTestimonialCarousel = () => {
        clearInterval(testimonialInterval);
    };

    // Initialize testimonials
    if (testimonialCards.length > 0) {
        showTestimonial(0);
        startTestimonialCarousel();

        // Add click handler to left arrow
        if (testimonialLeftArrow) {
            testimonialLeftArrow.addEventListener('click', () => {
                prevTestimonial();
                stopTestimonialCarousel();
                startTestimonialCarousel();
            });
        }

        // Add click handler to right arrow
        if (testimonialRightArrow) {
            testimonialRightArrow.addEventListener('click', () => {
                nextTestimonial();
                stopTestimonialCarousel();
                startTestimonialCarousel();
            });
        }

        // Add click handlers to dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
                stopTestimonialCarousel();
                startTestimonialCarousel();
            });
        });

        // Pause on hover
        const testimonialSection = document.querySelector('.testimonials-section');
        if (testimonialSection) {
            testimonialSection.addEventListener('mouseenter', stopTestimonialCarousel);
            testimonialSection.addEventListener('mouseleave', startTestimonialCarousel);
        }
    }

    // Appointment form handling
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(appointmentForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            // Success message
            alert('Thank you for your appointment request! We will contact you soon.');
            appointmentForm.reset();
        });
    }

    // Service card hover effects
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Smooth scroll to top functionality
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Add scroll to top button
    const createScrollToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.className = 'scroll-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 150px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--orange);
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        button.addEventListener('click', scrollToTop);
        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            const footer = document.querySelector('.main-footer');
            if (footer) {
                const footerTop = footer.offsetTop;
                const scrollPosition = window.pageYOffset + window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                
                // Show button only when user is near or at the footer
                // Either when footer is visible or when user is at the bottom of the page
                if (scrollPosition >= footerTop || scrollPosition >= documentHeight - 50) {
                    button.style.display = 'flex';
                    button.style.justifyContent = 'center';
                    button.style.alignItems = 'center';
                } else {
                    button.style.display = 'none';
                }
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.backgroundColor = '#cc5200';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = 'var(--orange)';
        });
    };

    // Initialize scroll to top button
    createScrollToTopButton();

    // Smooth scroll animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sectionsToAnimate = document.querySelectorAll('.faq-appointment-section, .testimonials-section, .simple-approach-section');
    sectionsToAnimate.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // Form validation enhancement
    const validateForm = (form) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff6b6b';
                isValid = false;
            } else {
                input.style.borderColor = '#e1e5e9';
            }
        });

        return isValid;
    };

    // Add form validation to any forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // Enhanced mobile menu functionality (for future use)
    const createMobileMenu = () => {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelector('.nav-links');
        
        // Add mobile menu toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 10px;
        `;
        
        navbar.querySelector('.navbar-content').appendChild(mobileToggle);
        
        // Mobile menu functionality
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });
        
        // Close mobile menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
            });
        });
    };

    // Initialize mobile menu
    createMobileMenu();

    console.log('All website functionality initialized successfully!');

    // Initialize map at Maharashtra, India
var map = L.map('map').setView([19.7515, 75.7139], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker
var marker = L.marker([19.7515, 75.7139]).addTo(map);
marker.bindPopup("<b>Welcome!</b><br>This is Maharashtra.").openPopup();

});
// Modal logic for service cards
const serviceCards = document.querySelectorAll('.service-card');
const modal = document.getElementById('serviceModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.querySelector('.close-modal');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.getAttribute('data-img');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');

        modalImage.src = img;
        modalTitle.textContent = title;
        modalDescription.textContent = desc;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
const bookBtn = document.querySelector('#serviceModal .btn');
bookBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    modal.style.display = 'none'; // Close modal
    document.body.style.overflow = 'auto'; // Restore scroll

    // Scroll to the appointment section
    const appointmentSection = document.getElementById('appointment');
    if (appointmentSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight + 
                             document.querySelector('.top-info-bar').offsetHeight;
        window.scrollTo({
            top: appointmentSection.offsetTop - navbarHeight,
            behavior: 'smooth'
        });
    }
});
const consultancySelect = document.getElementById('consultancyType');
    const onlineFields = document.getElementById('onlineFields');

    consultancySelect.addEventListener('change', () => {
        if (consultancySelect.value === 'online') {
            onlineFields.style.display = 'block';
        } else {
            onlineFields.style.display = 'none';
        }
});
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.toggle-button');
    const toggleMenu = document.querySelector('.toggle-menu');
    const navLinks = document.querySelectorAll('.toggle-menu .nav-links a');

    toggleButton.addEventListener('click', () => {
        toggleMenu.classList.toggle('active');
        const isActive = toggleMenu.classList.contains('active');
        toggleButton.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu.classList.remove('active');
            toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
});
const swiper = new Swiper('.swiper', {
    slidesPerView: 4,
    centeredSlides: true,
    loop: true,
    spaceBetween: 40,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    speed: 800,
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
