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

    // ================= Services Carousel =================
    const servicesCarouselWrapper = document.querySelector('.services-carousel-wrapper');
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceCards = servicesGrid ? Array.from(servicesGrid.children) : [];
    const dotsContainer = document.querySelector('.carousel-dots');
    let dots = [], autoScrollInterval, currentIndex = 0;

    const initializeDots = () => {
        if (!dotsContainer || !serviceCards.length) return;
        dotsContainer.innerHTML = '';
        dots = [];
        const totalCards = serviceCards.length;
        const visibleCards = Math.floor(servicesCarouselWrapper.clientWidth / (serviceCards[0].offsetWidth + 30));
        const totalDots = Math.max(1, totalCards - visibleCards + 1);
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                scrollToIndex(i);
                stopAutoScroll();
                startAutoScroll();
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    };

    const scrollToIndex = (index) => {
        if (!serviceCards.length) return;
        const cardWidth = serviceCards[0].offsetWidth + 30;
        const scrollPosition = index * cardWidth;
        servicesCarouselWrapper.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        currentIndex = index;
        updateDots();
    };

    const updateDots = () => {
        if (!dots.length) return;
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
    };

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            const maxIndex = dots.length - 1;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            scrollToIndex(currentIndex);
        }, 4000);
    };
    const stopAutoScroll = () => clearInterval(autoScrollInterval);

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

    if (servicesCarouselWrapper && servicesGrid && serviceCards.length > 0) {
        setTimeout(() => { initializeDots(); startAutoScroll(); }, 100);
        servicesCarouselWrapper.addEventListener('mouseenter', stopAutoScroll);
        servicesCarouselWrapper.addEventListener('mouseleave', startAutoScroll);
        servicesCarouselWrapper.addEventListener('scroll', handleScroll);

        // Drag scroll
        let isDown = false, startX, scrollLeft;
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
                scrollToIndex(newIndex); stopAutoScroll(); startAutoScroll();
            });
            rightArrow.addEventListener('click', () => {
                const newIndex = currentIndex < dots.length - 1 ? currentIndex + 1 : 0;
                scrollToIndex(newIndex); stopAutoScroll(); startAutoScroll();
            });
        }
        window.addEventListener('resize', () => {
            setTimeout(() => { initializeDots(); scrollToIndex(0); }, 100);
        });
    }

// Modal setup
const serviceCardElements = document.querySelectorAll('.service-card');
const modal = document.getElementById('serviceModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.querySelector('.close-modal');

serviceCardElements.forEach(card => {
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
    // ================= Navbar scroll effect =================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        navbar.style.boxShadow = scrollTop > 100 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
    });

    // ================= Stats counter =================
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
                if (current >= target) { current = target; clearInterval(timer); }
                stat.textContent = Math.floor(current) + (stat.querySelector('span') ? '+' : '');
            }, 30);
        });
        statsAnimated = true;
    };
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) animateStats(); });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // ================= Testimonials carousel =================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-nav-dots .dot');
    const testimonialLeftArrow = document.getElementById('testimonialLeftArrow');
    const testimonialRightArrow = document.getElementById('testimonialRightArrow');
    let currentTestimonial = 0, testimonialInterval;

    const showTestimonial = (index) => {
        testimonialCards.forEach((c, i) => c.classList.toggle('active', i === index));
        testimonialDots.forEach((d, i) => d.classList.toggle('active', i === index));
        currentTestimonial = index;
    };
    const nextTestimonial = () => showTestimonial((currentTestimonial + 1) % testimonialCards.length);
    const prevTestimonial = () => showTestimonial((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length);
    const startTestimonialCarousel = () => testimonialInterval = setInterval(nextTestimonial, 5000);
    const stopTestimonialCarousel = () => clearInterval(testimonialInterval);

    if (testimonialCards.length > 0) {
        showTestimonial(0);
        startTestimonialCarousel();
        if (testimonialLeftArrow) testimonialLeftArrow.addEventListener('click', () => { prevTestimonial(); stopTestimonialCarousel(); startTestimonialCarousel(); });
        if (testimonialRightArrow) testimonialRightArrow.addEventListener('click', () => { nextTestimonial(); stopTestimonialCarousel(); startTestimonialCarousel(); });
        testimonialDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => { showTestimonial(idx); stopTestimonialCarousel(); startTestimonialCarousel(); });
        });
        const testimonialSection = document.querySelector('.testimonials-section');
        if (testimonialSection) {
            testimonialSection.addEventListener('mouseenter', stopTestimonialCarousel);
            testimonialSection.addEventListener('mouseleave', startTestimonialCarousel);
        }
    }

    // ================= Appointment form =================
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitButton = appointmentForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(appointmentForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const phone = formData.get('phone');
                const consultancyType = formData.get('consultancyType');
                const onlineDate = formData.get('onlineDate');
                const onlineTime = formData.get('onlineTime');
                const message = formData.get('message');

                // Validation
                if (!name || !email || !phone || !consultancyType) {
                    throw new Error('Please fill in all required fields.');
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
                    throw new Error('Please enter a valid phone number.');
                }

                // Validate online consultation fields
                if (consultancyType === 'online') {
                    if (!onlineDate || !onlineTime) {
                        throw new Error('Please select date and time for online consultation.');
                    }
                    
                    // Check if selected date is not in the past
                    const selectedDateTime = new Date(`${onlineDate}T${onlineTime}`);
                    const now = new Date();
                    if (selectedDateTime <= now) {
                        throw new Error('Please select a future date and time for online consultation.');
                    }
                }

                // Prepare data object
                const appointmentData = {
                    name: name,
                    email: email,
                    phone: phone,
                    consultancyType: consultancyType,
                    onlineDate: onlineDate,
                    onlineTime: onlineTime,
                    message: message
                };

                // Submit to Google Forms first (primary)
                let success = false;
                try {
                    await submitToGoogleForms(appointmentData);
                    success = true;
                    showSuccessMessage('Thank you for your appointment request! We will contact you soon.');
                } catch (googleError) {
                    console.warn('Google Forms submission failed, attempting local server as fallback:', googleError);
                    // Fallback to Flask backend
                    try {
                        const response = await fetch('/submit-appointment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(appointmentData)
                        });
                        if (response.ok) {
                            const result = await response.json();
                            if (result.success) {
                                success = true;
                                showSuccessMessage(result.message || 'Thank you for your appointment request! We will contact you soon.');
                            } else {
                                throw new Error(result.message || 'Server error occurred');
                            }
                        } else {
                            throw new Error('Server response error');
                        }
                    } catch (flaskError) {
                        console.error('Both Google Forms and local server submission failed:', flaskError);
                        throw new Error('Unable to submit your request. Please try again or contact us directly at +91 8459333946.');
                    }
                }

                if (success) {
                    appointmentForm.reset();
                    const onlineFieldsContainer = document.getElementById('onlineFields');
                    if (onlineFieldsContainer) {
                        onlineFieldsContainer.style.display = 'none';
                    }
                }

            } catch (error) {
                console.error('Form submission error:', error);
                showErrorMessage(error.message);
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // Helper function to submit to Google Forms
    async function submitToGoogleForms(data) {
        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfOOMCkYwttcvepDoEgOzQOCw0fQEm881apF0-e06a679-L-w/formResponse';
        
        const googleFormData = new FormData();
        googleFormData.append('entry.573906072', data.name);
        googleFormData.append('entry.1663572915', data.email);
        googleFormData.append('entry.669286527', data.phone);
        // Map consultancy type to match Google Form options exactly
        const consultancyTypeMapping = {
            'offline': 'Offline',
            'online': 'Online'
        };
        googleFormData.append('entry.1209364589', consultancyTypeMapping[data.consultancyType] || data.consultancyType);
        
        // Handle date and time for online consultations
        let dateTimeString = 'N/A';
        if (data.consultancyType === 'online' && data.onlineDate && data.onlineTime) {
            dateTimeString = `${data.onlineDate} at ${data.onlineTime}`;
        }
        const combinedMessage = data.message ? `${data.message} | Preferred: ${dateTimeString}` : dateTimeString;
        googleFormData.append('entry.482941717', combinedMessage);

        // Log the data being sent for debugging
        console.log('🚀 Submitting to Google Form:', {
            url: googleFormUrl,
            name: data.name,
            email: data.email,
            phone: data.phone,
            consultancyType: data.consultancyType,
            combinedMessage: combinedMessage
        });

        // Submit to Google Form with timeout and better error handling
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.error('❌ Google Forms submission timeout after 8 seconds');
                reject(new Error('Google Forms submission timeout - please check your internet connection'));
            }, 8000); // 8 second timeout

            fetch(googleFormUrl, {
                method: 'POST',
                body: googleFormData,
                mode: 'no-cors'
            }).then(() => {
                clearTimeout(timeout);
                console.log('✅ Google Forms submission completed (no-cors mode)');
                resolve();
            }).catch((error) => {
                clearTimeout(timeout);
                console.error('❌ Google Forms submission failed:', error);
                reject(new Error(`Google Forms submission failed: ${error.message}`));
            });
        });
    }

    // Helper function to show success message
    function showSuccessMessage(message) {
        // Create and show success notification
        const notification = createNotification(message, 'success');
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Helper function to show error message
    function showErrorMessage(message) {
        // Create and show error notification
        const notification = createNotification(message, 'error');
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 7000);
    }

    // Helper function to create notification
    function createNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
            ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
        `;
        notification.textContent = message;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        return notification;
    }

    // ================= Scroll-to-top button =================
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const createScrollToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.className = 'scroll-to-top';
        button.style.cssText = `
            position: fixed; bottom: 150px; right: 20px;
            width: 50px; height: 50px; border-radius: 50%;
            background-color: var(--orange); color: white;
            border: none; cursor: pointer; display: none;
            z-index: 1000; transition: all 0.3s ease;
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
                if (scrollPosition >= footerTop || scrollPosition >= documentHeight - 50) {
                    button.style.display = 'flex';
                    button.style.justifyContent = 'center';
                    button.style.alignItems = 'center';
                } else {
                    button.style.display = 'none';
                }
            }
        });
    };
    createScrollToTopButton();

    // ================= Consultancy Type Handler =================
    const consultancyTypeSelect = document.getElementById('consultancyType');
    const onlineFields = document.getElementById('onlineFields');
    
    if (consultancyTypeSelect && onlineFields) {
        consultancyTypeSelect.addEventListener('change', function() {
            if (this.value === 'online') {
                onlineFields.style.display = 'block';
                // Make date and time required for online consultations
                document.getElementById('onlineDate').required = true;
                document.getElementById('onlineTime').required = true;
            } else {
                onlineFields.style.display = 'none';
                // Remove required attribute when not online
                document.getElementById('onlineDate').required = false;
                document.getElementById('onlineTime').required = false;
            }
        });
    }

    // ================= Section animations =================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    const sectionsToAnimate = document.querySelectorAll('.faq-appointment-section, .testimonials-section, .simple-approach-section');
    sectionsToAnimate.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // ================= Mobile Menu with Overlay =================
    const toggleButton = document.querySelector('.toggle-button');   // hamburger
    const toggleMenu = document.querySelector('.toggle-menu');       // slide-in panel
    const closeBtn = document.getElementById('closeToggleMenu');     // × button

    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    const openMenu = () => {
        toggleMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    };
    const closeMenu = () => {
        toggleMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    if (toggleButton) toggleButton.addEventListener('click', (e) => { e.stopPropagation(); openMenu(); });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.toggle-menu .nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu if click outside
    document.addEventListener('click', (e) => {
        if (!toggleMenu.classList.contains('active')) return;
        if (!toggleMenu.contains(e.target) && !toggleButton.contains(e.target)) closeMenu();
    });

    // Ensure menu closes on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) closeMenu();
    });

    // ================= Our Gallery Swiper =================
    const gallerySwiper = new Swiper('.swiper', {
      slidesPerView: 3,
      spaceBetween: 40,
      loop: true,
      centeredSlides: false,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      speed: 800,
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1200: { slidesPerView: 3 }
      },
    });

    console.log('All website functionality initialized successfully!');
});