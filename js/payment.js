document.addEventListener('DOMContentLoaded', function() {
    // Initialize form and payment system
    const paymentForm = document.getElementById('payment-form');
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    paymentForm.prepend(errorMessage);

    // Package details
    const packages = {
        basic: { price: '299.00', name: 'Basic Website Package' },
        advanced: { price: '499.00', name: 'Advanced Website Package' },
        premium: { price: '799.00', name: 'Premium Website Package' }
    };

    // Initialize PayPal buttons
    function initPayPal() {
        if (typeof paypal === 'undefined') {
            setTimeout(initPayPal, 300);
            return;
        }

        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'paypal',
                height: 48
            },
            createOrder: function(data, actions) {
                // Validate form first
                if (!validateForm()) {
                    return false;
                }

                const selectedPackage = document.getElementById('package').value;
                const packageDetails = packages[selectedPackage];

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: packageDetails.price,
                            currency_code: 'CAD',
                            breakdown: {
                                item_total: {
                                    value: packageDetails.price,
                                    currency_code: 'CAD'
                                }
                            }
                        },
                        items: [{
                            name: packageDetails.name,
                            unit_amount: {
                                value: packageDetails.price,
                                currency_code: 'CAD'
                            },
                            quantity: '1',
                            category: 'DIGITAL_GOODS'
                        }],
                        description: packageDetails.name
                    }],
                    application_context: {
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'PAY_NOW'
                    }
                });
            },
            onApprove: function(data, actions) {
                // Show loading state
                showLoading(true);
                
                return actions.order.capture().then(function(details) {
                    // Process successful payment
                    processSuccessfulPayment(details);
                }).catch(function(err) {
                    // Handle capture error
                    showError('Payment processing failed. Please try again or contact support.');
                    showLoading(false);
                    console.error('Payment capture error:', err);
                });
            },
            onError: function(err) {
                showError('There was an error initializing the payment. Please try again.');
                console.error('PayPal error:', err);
            },
            onClick: function() {
                // Validate form when button is clicked
                if (!validateForm()) {
                    return false;
                }
            }
        }).render(paypalButtonContainer);
    }

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
                paypalButtonContainer.insertAdjacentHTML('afterend', loadingHTML);
            }
            paypalButtonContainer.style.display = 'none';
        } else {
            if (loadingDiv) loadingDiv.remove();
            paypalButtonContainer.style.display = 'block';
        }
    }

    // Process successful payment
    function processSuccessfulPayment(details) {
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const package = document.getElementById('package').value;
        const message = document.getElementById('message').value;
        const packageDetails = packages[package];
        
        // Submit data to server
        submitOrderData({
            name,
            email,
            message,
            package: packageDetails.name,
            amount: packageDetails.price,
            transactionId: details.id,
            payerEmail: details.payer.email_address,
            payerId: details.payer.payer_id
        }).then(() => {
            // Show success message
            showSuccessMessage(name, email, message, packageDetails, details.id);
        }).catch(error => {
            console.error('Submission error:', error);
            showError('Payment succeeded but we couldn\'t save your details. Please contact us with your transaction ID.');
            showLoading(false);
        });
    }

    // Submit data to server
    function submitOrderData(orderData) {
        return new Promise((resolve, reject) => {
            // In production, replace this with actual fetch to your backend
            console.log('Submitting order data:', orderData);
            
            // Example using FormSubmit.co (uncomment and replace email)
            /*
            fetch('https://formsubmit.co/ajax/your-email@example.com', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...orderData,
                    _subject: `New Order: ${orderData.package}`
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
            */
            
            // For demo purposes, simulate successful submission
            setTimeout(() => resolve({ status: 'success' }), 1500);
        });
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

    // Initialize PayPal buttons
    initPayPal();
});