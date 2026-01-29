// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const predictBtn = document.getElementById('predictBtn');
    const resultsSection = document.getElementById('resultsSection');
    
    // Add input animations
    addInputAnimations();
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await makePrediction();
    });
    
    // Add real-time validation feedback
    addValidationFeedback();
});

// Make prediction function
async function makePrediction() {
    const predictBtn = document.getElementById('predictBtn');
    const resultsSection = document.getElementById('resultsSection');
    
    // Show loading state
    predictBtn.classList.add('loading');
    predictBtn.disabled = true;
    
    // Collect form data
    const formData = {
        property_type: parseInt(document.getElementById('property_type').value),
        bhk: parseInt(document.getElementById('bhk').value),
        size_sqft: parseFloat(document.getElementById('size_sqft').value),
        price_per_sqft: parseFloat(document.getElementById('price_per_sqft').value),
        furnished_status: parseInt(document.getElementById('furnished_status').value),
        total_floors: parseInt(document.getElementById('total_floors').value),
        age_of_property: parseInt(document.getElementById('age_of_property').value),
        nearby_schools: parseInt(document.getElementById('nearby_schools').value),
        nearby_hospitals: parseInt(document.getElementById('nearby_hospitals').value),
        public_transport: parseInt(document.getElementById('public_transport').value),
        parking_space: parseInt(document.getElementById('parking_space').value),
        security: parseInt(document.getElementById('security').value),
        amenities: parseInt(document.getElementById('amenities').value),
        facing: parseInt(document.getElementById('facing').value),
        owner_type: parseInt(document.getElementById('owner_type').value),
        availability_status: parseInt(document.getElementById('availability_status').value)
    };
    
    try {
        // Make API call
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display results
            displayResults(data);
            
            // Scroll to results
            setTimeout(() => {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        } else {
            showError(data.error || 'Prediction failed. Please try again.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        // Remove loading state
        predictBtn.classList.remove('loading');
        predictBtn.disabled = false;
    }
}

// Display results with animations
function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    const priceValue = document.getElementById('priceValue');
    const priceCrores = document.getElementById('priceCrores');
    const rangeLower = document.getElementById('rangeLower');
    const rangeUpper = document.getElementById('rangeUpper');
    const rangeIndicator = document.getElementById('rangeIndicator');
    const featuresCount = document.getElementById('featuresCount');
    
    // Show results section
    resultsSection.classList.add('show');
    
    // Animate price value with counter
    animateCounter(priceValue, 0, data.predicted_price, 1500, '₹ ', ' Lakhs');
    animateCounter(priceCrores, 0, data.predicted_price_crores, 1500, '₹ ', ' Crores');
    
    // Set range values
    rangeLower.textContent = `₹ ${data.confidence_lower.toFixed(2)} L`;
    rangeUpper.textContent = `₹ ${data.confidence_upper.toFixed(2)} L`;
    
    // Animate range bar
    rangeIndicator.style.width = '100%';
    
    // Set features count
    featuresCount.textContent = data.features_used;
    
    // Add celebration animation
    createConfetti();
}

// Counter animation
function animateCounter(element, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        element.textContent = prefix + current.toFixed(2) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.opacity = '0.8';
            
            document.body.appendChild(confetti);
            
            const duration = 2000 + Math.random() * 1000;
            const endX = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 0.8 },
                { transform: `translateY(${window.innerHeight}px) translateX(${endX}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }, i * 30);
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-exclamation-circle" style="font-size: 24px;"></i>
            <div>
                <div style="font-weight: 600; margin-bottom: 5px;">Prediction Error</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Reset form function
function resetForm() {
    const form = document.getElementById('predictionForm');
    const resultsSection = document.getElementById('resultsSection');
    
    // Hide results with animation
    resultsSection.style.animation = 'scaleOut 0.3s ease-out';
    setTimeout(() => {
        resultsSection.classList.remove('show');
        resultsSection.style.animation = '';
    }, 300);
    
    // Reset form
    form.reset();
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Add input animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateX(5px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateX(0)';
        });
        
        // Add change animation
        input.addEventListener('change', function() {
            this.style.animation = 'inputPulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// Add validation feedback
function addValidationFeedback() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            
            if (value < min || value > max) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '';
            }
        });
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    @keyframes inputPulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('predictionForm').dispatchEvent(new Event('submit'));
    }
    
    // Esc to reset
    if (e.key === 'Escape') {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection.classList.contains('show')) {
            resetForm();
        }
    }
});

// Add smooth scroll for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Performance optimization: Lazy load images if any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console message
console.log('%c🏠 Indian House Price Predictor', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cModel Accuracy: 98.23%', 'color: #10b981; font-size: 14px;');
console.log('%cPowered by Random Forest ML Algorithm', 'color: #8b5cf6; font-size: 12px;');
