// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animation
const animateElements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach(element => {
    observer.observe(element);
});

// Initialize PayPal Hosted Buttons
function initPayPalButtons() {
    // Check if PayPal is loaded
    if (typeof paypal === 'undefined') {
        setTimeout(initPayPalButtons, 200);
        return;
    }

    // Basic Package Button
    paypal.HostedButtons({
        hostedButtonId: "293EJREBKU8M4", // Your actual Basic package button ID
        onApprove: (data, actions) => handlePaymentSuccess(data, "Basic Website Package - $299 CAD")
    }).render("#paypal-container-basic");

    // Advanced Package Button - REPLACE WITH YOUR ACTUAL BUTTON ID
    paypal.HostedButtons({
        hostedButtonId: "YOUR_ADVANCED_BUTTON_ID", 
        onApprove: (data, actions) => handlePaymentSuccess(data, "Advanced Website Package - $499 CAD")
    }).render("#paypal-container-advanced");

    // Premium Package Button - REPLACE WITH YOUR ACTUAL BUTTON ID
    paypal.HostedButtons({
        hostedButtonId: "YOUR_PREMIUM_BUTTON_ID",
        onApprove: (data, actions) => handlePaymentSuccess(data, "Premium Website Package - $799+ CAD")
    }).render("#paypal-container-premium");
}

function handlePaymentSuccess(data, packageName) {
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Hide all payment options
    document.querySelectorAll('.payment-option').forEach(el => {
        el.style.display = 'none';
    });
    
    // Hide optional fields
    document.querySelector('textarea.form-control').style.display = 'none';
    document.querySelector('label[for="message"]').style.display = 'none';
    
    // Show success message
    const paymentForm = document.getElementById('payment-form');
    const successHTML = `
        <div class="payment-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Payment Successful!</h3>
            <p>Thank you for purchasing our ${packageName}.</p>
            <div class="payment-details">
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${message ? `<p><strong>Project Details:</strong> ${message}</p>` : ''}
                <p><strong>Transaction ID:</strong> ${data.orderID}</p>
            </div>
        </div>
    `;
    
    // Insert success message before the payment note
    const paymentNote = document.querySelector('.payment-note');
    paymentNote.insertAdjacentHTML('beforebegin', successHTML);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize PayPal buttons
    initPayPalButtons();
    
    // Form validation
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            this.reportValidity();
            return false;
        }
        return true;
    });
});