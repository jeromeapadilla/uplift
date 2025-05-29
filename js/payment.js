document.addEventListener('DOMContentLoaded', function() {
    // Initialize form and payment system
    const paymentForm = document.getElementById('payment-form');
    const squarePaymentButton = document.getElementById('square-payment-button');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    paymentForm.prepend(errorMessage);

    // Package details
    const packages = {
        basic: { price: '299.00', name: 'Basic Website Package' },
        advanced: { price: '499.00', name: 'Advanced Website Package' },
        premium: { price: '799.00', name: 'Premium Website Package' }
    };

    // Add click handler to Square button
    squarePaymentButton.addEventListener('click', function(e) {
        // Validate form first
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
        
        // Show loading state
        showLoading(true);
        
        // In a real implementation, you might want to:
        // 1. Submit form data to your server
        // 2. Generate a unique order ID
        // 3. Update the Square payment link with order details
        
        // For demo purposes, we'll just proceed with the static link
    });

    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const package = document.getElementById('package').value;
        
        // Clear previous errors
        errorMessage.classList.remove('show');
        
        if (!name) {
            showError('Please enter your full name');
            return false;
        }
        
        if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            showError('Please enter a valid email address');
            return false;
        }
        
        if (!package) {
            showError('Please select a package');
            return false;
        }
        
        return true;
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Scroll to error
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show loading state
    function showLoading(show) {
        const loadingDiv = document.querySelector('.loading-state');
        if (show) {
            if (!loadingDiv) {
                const loadingHTML = `
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Processing your payment...</p>
                    </div>
                `;
                document.getElementById('square-payment-container').insertAdjacentHTML('afterend', loadingHTML);
            }
            squarePaymentButton.style.display = 'none';
        } else {
            if (loadingDiv) loadingDiv.remove();
            squarePaymentButton.style.display = 'inline-block';
        }
    }

    // Check for payment success in URL parameters (for when user returns from Square)
    function checkForSuccessfulPayment() {
        const urlParams = new URLSearchParams(window.location.search);
        const transactionId = urlParams.get('transactionId');
        
        if (transactionId) {
            // This would be where you verify the payment with your backend
            showSuccessMessage(
                urlParams.get('name') || 'Customer',
                urlParams.get('email') || '',
                urlParams.get('message') || '',
                packages[urlParams.get('package')] || { name: 'Website Package', price: '' },
                transactionId
            );
        }
    }

    // Show success message
    function showSuccessMessage(name, email, message, packageDetails, transactionId) {
        const paymentForm = document.getElementById('payment-form');
        
        paymentForm.innerHTML = `
            <div class="payment-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Payment Successful!</h3>
                <p>Thank you for your order.</p>
                
                <div class="payment-details">
                    <p><strong>Package:</strong> ${packageDetails.name}</p>
                    <p><strong>Amount:</strong> $${packageDetails.price} CAD</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
                    <p><strong>Transaction ID:</strong> ${transactionId}</p>
                    <p>We've sent a confirmation to your email. Our team will contact you within 24 hours.</p>
                </div>
                
                <div class="success-actions">
                    <a href="/" class="btn">Return Home</a>
                    <a href="mailto:hello@webcraft.ca" class="btn btn-secondary">Contact Support</a>
                </div>
            </div>
        `;
    }

    // Check for successful payment on page load
    checkForSuccessfulPayment();
});