// Pages Specific JavaScript

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializePageAnimations();
    setupFormHandlers();
    setupInteractiveElements();
});

// Page Animations
function initializePageAnimations() {
    const animatedElements = document.querySelectorAll('.category-card, .faq-item, .support-option, .feature-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Form Handlers
function setupFormHandlers() {
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Registration form
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationForm);
    }
    
    // Feedback form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackForm);
    }
    
    // Report issue form
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportForm);
    }
}

// Interactive Elements
function setupInteractiveElements() {
    // FAQ toggles
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => toggleFAQ(question));
    });
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category') || 'general';
            showCategory(category);
        });
    });
}

// Help Center Functions
function searchHelp() {
    const query = document.getElementById('help-search').value.trim();
    if (!query) {
        showAlert('Please enter a search term.', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate search
    setTimeout(() => {
        hideLoading();
        showAlert(`Found ${Math.floor(Math.random() * 20) + 5} articles for "${query}"`, 'success');
        
        // In a real app, this would filter and display search results
        displaySearchResults(query);
    }, 1500);
}

function displaySearchResults(query) {
    // Simulate search results display
    const resultsHTML = `
        <div class="search-results">
            <h3>Search Results for "${query}"</h3>
            <div class="result-item">
                <h4>How to search for medicines</h4>
                <p>Learn how to effectively search for medicines using our advanced search features...</p>
            </div>
            <div class="result-item">
                <h4>Understanding prescription requirements</h4>
                <p>Information about which medicines require prescriptions and how to upload them...</p>
            </div>
        </div>
    `;
    
    // This would replace the FAQ section with search results
    console.log('Search results would be displayed here');
}

function showCategory(category) {
    showAlert(`Showing articles for ${category.replace('-', ' ')} category.`, 'info');
    
    // In a real app, this would filter articles by category
    const categoryData = {
        'getting-started': {
            title: 'Getting Started',
            articles: [
                'Creating your account',
                'Setting up your profile',
                'Understanding the dashboard',
                'First medicine search'
            ]
        },
        'ordering': {
            title: 'Ordering Medicines',
            articles: [
                'How to place an order',
                'Selecting pharmacies',
                'Order confirmation process',
                'Modifying orders'
            ]
        },
        'payments': {
            title: 'Payments & Billing',
            articles: [
                'TeleBirr payment setup',
                'Bank transfer instructions',
                'Payment security',
                'Refund process'
            ]
        }
    };
    
    const data = categoryData[category] || categoryData['getting-started'];
    console.log(`Would show ${data.articles.length} articles for ${data.title}`);
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function openLiveChat() {
    // Open the chatbot
    if (typeof toggleChatbot === 'function') {
        toggleChatbot();
    } else {
        showAlert('Live chat is opening...', 'info');
    }
}

// Form Handlers
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.email || !data.message) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading();
        showAlert('Thank you for contacting us! We\'ll get back to you within 24 hours.', 'success');
        e.target.reset();
    }, 2000);
}

function handleRegistrationForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validation
    if (!data.pharmacyName || !data.ownerName || !data.email || !data.phone) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!data.terms) {
        showAlert('Please accept the terms and conditions.', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate registration
    setTimeout(() => {
        hideLoading();
        showAlert('Registration submitted successfully! We\'ll review your application and contact you within 2-3 business days.', 'success');
        e.target.reset();
    }, 3000);
}

function handleFeedbackForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!data.feedback) {
        showAlert('Please enter your feedback.', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showAlert('Thank you for your feedback! Your input helps us improve our services.', 'success');
        e.target.reset();
    }, 1500);
}

function handleReportForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!data.issueType || !data.description) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        const ticketNumber = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        showAlert(`Issue reported successfully! Your ticket number is ${ticketNumber}. We'll investigate and respond soon.`, 'success');
        e.target.reset();
    }, 2000);
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Dashboard Functions (for analytics page)
function initializeDashboard() {
    loadDashboardStats();
    setupCharts();
}

function loadDashboardStats() {
    // Simulate loading dashboard statistics
    const stats = {
        totalOrders: Math.floor(Math.random() * 1000) + 500,
        totalRevenue: Math.floor(Math.random() * 50000) + 25000,
        activePharmacies: Math.floor(Math.random() * 50) + 25,
        customerSatisfaction: (Math.random() * 0.5 + 4.5).toFixed(1)
    };
    
    // Update stat displays
    updateStatDisplay('total-orders', stats.totalOrders);
    updateStatDisplay('total-revenue', `ETB ${stats.totalRevenue.toLocaleString()}`);
    updateStatDisplay('active-pharmacies', stats.activePharmacies);
    updateStatDisplay('customer-satisfaction', `${stats.customerSatisfaction}/5.0`);
}

function updateStatDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function setupCharts() {
    // Placeholder for chart initialization
    // In a real app, this would use Chart.js or similar library
    console.log('Charts would be initialized here');
}

// Export functions for global use
window.searchHelp = searchHelp;
window.showCategory = showCategory;
window.toggleFAQ = toggleFAQ;
window.openLiveChat = openLiveChat;