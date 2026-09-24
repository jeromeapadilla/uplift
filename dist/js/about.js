// About Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll for about page
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.about-content, .about-image, .value-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize animation states
    const initAnimations = function() {
        const aboutContent = document.querySelector('.about-content');
        const aboutImage = document.querySelector('.about-image');
        const valueCards = document.querySelectorAll('.value-card');
        
        if (aboutContent) {
            aboutContent.style.opacity = '0';
            aboutContent.style.transform = 'translateY(20px)';
            aboutContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        
        if (aboutImage) {
            aboutImage.style.opacity = '0';
            aboutImage.style.transform = 'translateY(20px)';
            aboutImage.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';
        }
        
        valueCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${0.1 * index}s, transform 0.6s ease ${0.1 * index}s`;
        });
    };
    
    // Only run about page specific JS if on about page
    if (document.querySelector('.about-section')) {
        initAnimations();
        window.addEventListener('scroll', animateOnScroll);
        // Trigger once on load in case elements are already in view
        animateOnScroll();
    }
    
    // Mobile menu toggle (reuse from main script)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
});