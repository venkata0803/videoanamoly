document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to main container
    const container = document.querySelector('.container');
    container.classList.add('fade-in');

    // Add floating animation to logo
    const logo = document.querySelector('.logo');
    logo.classList.add('animate-float');

    // Add glow effect to upload box
    const uploadBox = document.querySelector('.upload-box');
    if (uploadBox) {
        uploadBox.classList.add('animate-glow');
    }

    // Add loading spinner during video upload
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', () => {
            const btn = form.querySelector('button');
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            btn.disabled = true;
            btn.appendChild(spinner);
        });
    }
});

// Smooth scroll animation
function smoothScroll(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}