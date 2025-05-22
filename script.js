document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        alert('Thank you for choosing our plan! We will contact you shortly.');
    });
});
