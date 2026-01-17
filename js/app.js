// Global variables
let currentUser = null;
let medicines = [];
let pharmacies = [];
let userLocation = null;

// API helper function for authenticated requests
async function makeAuthenticatedRequest(url, options = {}) {
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
        throw new Error('No authentication token found');
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    const response = await fetch(url, mergedOptions);
    
    // Handle token expiration
    if (response.status === 401) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        currentUser = null;
        updateAuthUI();
        showAlert('Session expired. Please login again.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        throw new Error('Authentication expired');
    }
    
    return response;
}

// Backend API functions
async function searchMedicinesFromBackend(query, filters = {}) {
    try {
        const params = new URLSearchParams({
            action: 'search',
            q: query,
            ...filters,
            limit: 20
        });
        
        const response = await fetch(`backend/medicines.php?${params}`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to search medicines');
        }
    } catch (error) {
        console.error('Medicine search error:', error);
        throw error;
    }
}

async function getPharmaciesFromBackend(filters = {}) {
    try {
        const params = new URLSearchParams({
            action: 'list',
            limit: 20,
            ...filters
        });
        
        const response = await fetch(`backend/pharmacies.php?${params}`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to get pharmacies');
        }
    } catch (error) {
        console.error('Pharmacies fetch error:', error);
        throw error;
    }
}

async function createOrderInBackend(orderData) {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('Please login to place an order');
        }
        
        const response = await fetch('backend/orders.php?action=create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to create order');
        }
    } catch (error) {
        console.error('Order creation error:', error);
        throw error;
    }
}

// Sample data
const sampleMedicines = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        brand: "Panadol",
        category: "Pain Relief",
        description: "Effective pain relief and fever reducer",
        image: "https://via.placeholder.com/100x100?text=💊",
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 25.50, distance: 0.5, availability: "In Stock" },
            { id: 2, name: "Health Plus", price: 23.00, distance: 1.2, availability: "In Stock" },
            { id: 3, name: "MedCare", price: 27.00, distance: 2.1, availability: "Limited Stock" }
        ]
    },
    {
        id: 2,
        name: "Amoxicillin 250mg",
        brand: "Amoxil",
        category: "Antibiotic",
        description: "Broad-spectrum antibiotic for bacterial infections",
        image: "https://via.placeholder.com/100x100?text=💊",
        pharmacies: [
            { id: 1, name: "City Pharmacy", price: 45.00, distance: 0.5, availability: "In Stock" },
            { id: 2, name: "Health Plus", price: 42.50, distance: 1.2, availability: "Out of Stock" },
            { id: 4, name: "Wellness Pharmacy", price: 48.00, distance: 0.8, availability: "In Stock" }
        ]
    },
    {
        id: 3,
        name: "Ibuprofen 400mg",
        brand: "Advil",
        category: "Anti-inflammatory",
        description: "Non-steroidal anti-inflammatory drug",
        image: "https://via.placeholder.com/100x100?text=💊",
        pharmacies: [
            { id: 2, name: "Health Plus", price: 32.00, distance: 1.2, availability: "In Stock" },
            { id: 3, name: "MedCare", price: 35.50, distance: 2.1, availability: "In Stock" },
            { id: 4, name: "Wellness Pharmacy", price: 30.00, distance: 0.8, availability: "In Stock" }
        ]
    }
];

// Fallback function for mobile navigation toggle
// Enhanced mobile navigation toggle function
function toggleMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    console.log('toggleMobileNav called', { navToggle, navMenu }); // Debug log
    
    if (navToggle && navMenu) {
        const isActive = navToggle.classList.contains('active');
        
        // Toggle classes
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
        
        // Update toggle text
        const toggleText = navToggle.querySelector('.nav-toggle-text');
        if (toggleText) {
            toggleText.textContent = isActive ? 'Menu' : 'Close';
        }
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
                if (toggleText) {
                    toggleText.textContent = 'Menu';
                }
            });
        });
        
        console.log('Mobile nav toggled successfully'); // Debug log
    } else {
        console.error('Navigation elements not found:', { navToggle, navMenu });
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu && navMenu.classList.contains('active')) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
            
            const toggleText = navToggle.querySelector('.nav-toggle-text');
            if (toggleText) {
                toggleText.textContent = 'Menu';
            }
        }
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
            
            const toggleText = navToggle.querySelector('.nav-toggle-text');
            if (toggleText) {
                toggleText.textContent = 'Menu';
            }
        }
    }
});

// Make function globally available
window.toggleMobileNav = toggleMobileNav;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    requestLocation();
    
    // Add active class to current page navigation
    setActiveNavigation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize intersection observer for animations
    initializeScrollAnimations();
});

function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initializeSmoothScrolling() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navToggle = document.getElementById('nav-toggle');
                const navMenu = document.getElementById('nav-menu');
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }
        });
    });
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .step-item, .popular-card, .testimonial-card');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

function initializeApp() {
    medicines = sampleMedicines;
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');
    
    if (savedUser && authToken) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Hide loading screen when page is fully loaded
window.addEventListener('load', function() {
    console.log('Page loaded successfully');
});
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('medicine-search');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMedicine();
        }
    });
    
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        console.log('Nav toggle elements found'); // Debug log
        
        // Add event listener as backup to onclick
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Nav toggle clicked via event listener'); // Debug log
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
        
    } else {
        console.log('Nav toggle elements not found:', { navToggle, navMenu }); // Debug log
    }
    
    // Form submissions
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('payment-form').addEventListener('submit', handlePayment);
    
    // Modal close events
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('Location obtained:', userLocation);
            },
            function(error) {
                console.log('Location access denied:', error);
                // Use default location (Addis Ababa)
                userLocation = { lat: 9.0320, lng: 38.7469 };
            }
        );
    }
}

// Search functionality
async function searchMedicine() {
    const query = document.getElementById('medicine-search').value.trim();
    if (!query) {
        showAlert('Please enter a medicine name to search', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Search medicines from backend
        const results = await searchMedicinesFromBackend(query);
        
        hideLoading();
        displaySearchResults(results, query);
        
        // Generate AI recommendations
        if (results.length > 0) {
            generateRecommendations(results[0]);
        }
    } catch (error) {
        hideLoading();
        console.error('Search error:', error);
        showAlert('Failed to search medicines. Please try again.', 'error');
    }
}

function displaySearchResults(results, query) {
    const resultsSection = document.getElementById('search-results');
    const medicineList = document.getElementById('medicine-list');
    
    if (results.length === 0) {
        medicineList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3>No medicines found for "${query}"</h3>
                <p>Try searching with different keywords or check the spelling.</p>
            </div>
        `;
    } else {
        medicineList.innerHTML = results.map(medicine => createMedicineCard(medicine)).join('');
    }
    
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}
function createMedicineCard(medicine) {
    const availablePharmacies = medicine.pharmacies || [];
    const inStockPharmacies = availablePharmacies.filter(p => p.availability === 'In Stock');
    const bestPrice = inStockPharmacies.length > 0 ? 
        Math.min(...inStockPharmacies.map(p => p.price)) : 
        (availablePharmacies.length > 0 ? availablePharmacies[0].price : 0);
    
    return `
        <div class="medicine-card" data-medicine-id="${medicine.id}">
            <div class="medicine-header">
                <div class="medicine-icon">
                    <i class="fas fa-pills"></i>
                </div>
                <div>
                    <h3>${medicine.name}</h3>
                    <p style="color: var(--text-secondary); margin: 0;">${medicine.brand || 'Generic'}</p>
                    <span class="category-badge" style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${medicine.category}</span>
                </div>
            </div>
            <div class="price">
                ETB ${bestPrice.toFixed(2)}
                <span class="price-badge">Best Price</span>
            </div>
            <div class="pharmacy">
                <i class="fas fa-store"></i>
                Available at ${inStockPharmacies.length} pharmacies
                ${medicine.requires_prescription ? '<i class="fas fa-prescription" title="Prescription Required" style="margin-left: 10px; color: #f59e0b;"></i>' : ''}
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${medicine.description || 'No description available'}</p>
            <div class="medicine-actions">
                <button class="btn" onclick="comparePrices(${medicine.id})">
                    <i class="fas fa-chart-bar"></i> Compare Prices
                </button>
                <button class="btn btn-success" onclick="orderMedicine(${medicine.id})" ${inStockPharmacies.length === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${inStockPharmacies.length > 0 ? 'Order Now' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
}

function comparePrices(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;
    
    const comparisonSection = document.getElementById('price-comparison');
    const comparisonTable = document.getElementById('comparison-table');
    
    const sortedPharmacies = medicine.pharmacies.sort((a, b) => a.price - b.price);
    const bestPrice = sortedPharmacies[0].price;
    
    comparisonTable.innerHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Pharmacy</th>
                    <th>Price (ETB)</th>
                    <th>Distance</th>
                    <th>Availability</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${sortedPharmacies.map(pharmacy => `
                    <tr class="${pharmacy.price === bestPrice ? 'best-price' : ''}">
                        <td>
                            <strong>${pharmacy.name}</strong>
                            ${pharmacy.price === bestPrice ? '<span style="margin-left: 0.5rem; color: var(--secondary-color);">🏆 Best Price</span>' : ''}
                        </td>
                        <td class="price-cell">ETB ${pharmacy.price.toFixed(2)}</td>
                        <td>${pharmacy.distance} km</td>
                        <td>
                            <span class="status-badge ${pharmacy.availability === 'In Stock' ? 'in-stock' : pharmacy.availability === 'Limited Stock' ? 'limited' : 'out-of-stock'}">
                                ${pharmacy.availability}
                            </span>
                        </td>
                        <td>
                            ${pharmacy.availability !== 'Out of Stock' ? 
                                `<button class="btn btn-success" onclick="orderFromPharmacy(${medicineId}, ${pharmacy.id})">
                                    <i class="fas fa-shopping-cart"></i> Order
                                </button>` : 
                                '<span style="color: var(--text-secondary);">Unavailable</span>'
                            }
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    comparisonSection.classList.remove('hidden');
    comparisonSection.scrollIntoView({ behavior: 'smooth' });
}
function generateRecommendations(medicine) {
    const recommendationsSection = document.getElementById('recommendations');
    const recommendationList = document.getElementById('recommendation-list');
    
    // AI-based recommendations
    const recommendations = [
        {
            type: "Best Value",
            title: "Recommended Pharmacy",
            description: "Based on price, distance, and availability analysis",
            pharmacy: medicine.pharmacies.find(p => p.availability === 'In Stock'),
            metrics: [
                { icon: "fas fa-dollar-sign", label: "Price", value: "Best Deal" },
                { icon: "fas fa-map-marker-alt", label: "Distance", value: "0.5 km" },
                { icon: "fas fa-clock", label: "Delivery", value: "30 min" }
            ]
        },
        {
            type: "Alternative",
            title: "Similar Medicine Available",
            description: "Generic alternative with same active ingredient at lower cost",
            pharmacy: null,
            metrics: [
                { icon: "fas fa-percentage", label: "Savings", value: "25%" },
                { icon: "fas fa-shield-alt", label: "Quality", value: "FDA Approved" },
                { icon: "fas fa-pills", label: "Dosage", value: "Same" }
            ]
        }
    ];
    
    recommendationList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="ai-badge">
                <i class="fas fa-robot"></i>
                AI ${rec.type}
            </div>
            <div class="recommendation-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
                <div class="recommendation-metrics">
                    ${rec.metrics.map(metric => `
                        <div class="metric">
                            <i class="${metric.icon}"></i>
                            <span>${metric.label}: <span class="metric-value">${metric.value}</span></span>
                        </div>
                    `).join('')}
                </div>
                ${rec.pharmacy ? `
                    <button class="btn btn-success" onclick="orderFromPharmacy(${medicine.id}, ${rec.pharmacy.id})">
                        <i class="fas fa-shopping-cart"></i> Order from ${rec.pharmacy.name}
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    recommendationsSection.classList.remove('hidden');
}

// Authentication functions
function showLogin() {
    document.getElementById('login-modal').style.display = 'block';
}

function showRegister() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('register-modal').style.display = 'block';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        // Simple validation (in real app, this would be server-side)
        if (username && password) {
            currentUser = {
                id: 1,
                username: username,
                email: username + '@example.com',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeModal();
            showAlert('Login successful! Welcome back.', 'success');
        } else {
            showAlert('Invalid credentials. Please try again.', 'error');
        }
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value;
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        if (username && email && password && phone) {
            currentUser = {
                id: Date.now(),
                username: username,
                email: email,
                phone: phone,
                registrationTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeModal();
            showAlert('Account created successfully! Welcome to PharmaCare.', 'success');
        } else {
            showAlert('Please fill in all fields.', 'error');
        }
    }, 1000);
}

function updateAuthUI() {
    const authMenu = document.getElementById('auth-menu');
    if (currentUser) {
        const displayName = currentUser.first_name ? 
            `${currentUser.first_name} ${currentUser.last_name}` : 
            currentUser.username;
        authMenu.innerHTML = `
            <span style="margin-right: 1rem; color: var(--text-secondary);">Welcome, ${displayName}</span>
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        authMenu.innerHTML = '<a href="login.html">Login</a>';
    }
}

function logout() {
    // Call backend logout API if token exists
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        fetch('backend/api/auth/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        }).catch(error => {
            console.error('Logout API error:', error);
        });
    }
    
    // Clear local storage
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    updateAuthUI();
    showAlert('Logged out successfully.', 'info');
}
function orderMedicine(medicineId) {
    if (!currentUser) {
        showAlert('Please login to place an order.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const medicine = medicines.find(m => m.id === medicineId);
    const bestPharmacy = medicine.pharmacies
        .filter(p => p.availability === 'In Stock')
        .sort((a, b) => a.price - b.price)[0];
    
    orderFromPharmacy(medicineId, bestPharmacy.id);
}

function orderFromPharmacy(medicineId, pharmacyId) {
    if (!currentUser) {
        showAlert('Please login to place an order.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const medicine = medicines.find(m => m.id === medicineId);
    const pharmacy = medicine.pharmacies.find(p => p.id === pharmacyId);
    
    if (!pharmacy || pharmacy.availability === 'Out of Stock') {
        showAlert('This medicine is not available at the selected pharmacy.', 'error');
        return;
    }
    
    // Show payment modal
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.innerHTML = `
        <div class="payment-summary">
            <h4>Order Summary</h4>
            <div class="order-item">
                <div class="item-info">
                    <strong>${medicine.name}</strong>
                    <p>${medicine.brand} - ${pharmacy.name}</p>
                </div>
                <div class="item-price">ETB ${pharmacy.price.toFixed(2)}</div>
            </div>
            <div class="order-total">
                <strong>Total: ETB ${pharmacy.price.toFixed(2)}</strong>
            </div>
        </div>
    `;
    
    document.getElementById('payment-modal').style.display = 'block';
}

function handlePayment(e) {
    e.preventDefault();
    
    const phone = document.getElementById('telebirr-phone').value;
    
    if (!phone) {
        showAlert('Please enter your TeleBirr phone number.', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate payment processing
    setTimeout(() => {
        hideLoading();
        closeModal();
        
        // Simulate successful payment
        if (Math.random() > 0.1) { // 90% success rate
            showAlert('Payment successful! Your order has been placed and will be delivered soon.', 'success');
            
            // Show order confirmation
            setTimeout(() => {
                showAlert('Order confirmed! Estimated delivery: 30-45 minutes.', 'info');
            }, 2000);
        } else {
            showAlert('Payment failed. Please try again or contact support.', 'error');
        }
    }, 2000);
}
// Utility functions
function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading"></div>
            <p>Processing...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    alertDiv.innerHTML = `
        <i class="${icon}"></i>
        ${message}
    `;
    
    // Insert at the top of the page
    const navbar = document.querySelector('.navbar');
    navbar.insertAdjacentElement('afterend', alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
    
    // Add click to dismiss
    alertDiv.addEventListener('click', () => {
        alertDiv.remove();
    });
}

// Add some CSS for status badges and order items
const additionalStyles = `
    <style>
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.in-stock {
            background: rgba(16, 185, 129, 0.1);
            color: #065f46;
        }
        
        .status-badge.limited {
            background: rgba(245, 158, 11, 0.1);
            color: #92400e;
        }
        
        .status-badge.out-of-stock {
            background: rgba(239, 68, 68, 0.1);
            color: #991b1b;
        }
        
        .payment-summary {
            background: var(--bg-light);
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
        }
        
        .payment-summary h4 {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .item-info p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .item-price {
            font-weight: 700;
            color: var(--secondary-color);
            font-size: 1.1rem;
        }
        
        .order-total {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid var(--border-color);
            text-align: right;
            font-size: 1.2rem;
            color: var(--text-primary);
        }
        
        .no-results {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
        }
        
        .no-results h3 {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
// AI Chatbot Functionality
let chatbotOpen = false;
let chatHistory = [];

// Chatbot knowledge base
const chatbotKnowledge = {
    medicines: {
        'paracetamol': {
            name: 'Paracetamol',
            uses: 'Pain relief and fever reduction',
            dosage: '500mg-1000mg every 4-6 hours',
            sideEffects: 'Generally safe when used as directed',
            price: 'ETB 23.00 - ETB 27.00'
        },
        'ibuprofen': {
            name: 'Ibuprofen',
            uses: 'Pain relief, inflammation reduction',
            dosage: '200mg-400mg every 4-6 hours',
            sideEffects: 'May cause stomach upset',
            price: 'ETB 30.00 - ETB 35.50'
        },
        'amoxicillin': {
            name: 'Amoxicillin',
            uses: 'Bacterial infections',
            dosage: 'As prescribed by doctor',
            sideEffects: 'May cause allergic reactions',
            price: 'ETB 42.50 - ETB 48.00'
        }
    },
    pharmacies: [
        { name: 'City Pharmacy', distance: '0.5 km', phone: '+251911234567' },
        { name: 'Health Plus', distance: '1.2 km', phone: '+251911234568' },
        { name: 'MedCare', distance: '2.1 km', phone: '+251911234569' },
        { name: 'Wellness Pharmacy', distance: '0.8 km', phone: '+251911234570' }
    ]
};

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    
    if (chatbotOpen) {
        closeChatbot();
    } else {
        chatbotWindow.classList.remove('hidden');
        chatbotToggle.style.transform = 'scale(0.9)';
        chatbotOpen = true;
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chatbot-message').focus();
        }, 300);
    }
}

function closeChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    
    chatbotWindow.classList.add('hidden');
    chatbotToggle.style.transform = 'scale(1)';
    chatbotOpen = false;
}

function minimizeChatbot() {
    closeChatbot();
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendQuickMessage(message) {
    document.getElementById('chatbot-message').value = message;
    sendChatMessage();
}

async function sendChatMessage() {
    const input = document.getElementById('chatbot-message');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and get response
    setTimeout(() => {
        hideTypingIndicator();
        const response = processUserMessage(message);
        addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Simulate thinking time
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = message;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in chat history
    chatHistory.push({ message, sender, timestamp: new Date() });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span>AI is thinking</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm here to help you with your pharmacy needs. What can I assist you with today?";
    }
    
    // Medicine information requests
    if (lowerMessage.includes('paracetamol') || lowerMessage.includes('panadol')) {
        return getMedicineInfo('paracetamol');
    }
    
    if (lowerMessage.includes('ibuprofen') || lowerMessage.includes('advil')) {
        return getMedicineInfo('ibuprofen');
    }
    
    if (lowerMessage.includes('amoxicillin') || lowerMessage.includes('amoxil')) {
        return getMedicineInfo('amoxicillin');
    }
    
    // Price comparison requests
    if (lowerMessage.includes('compare') && lowerMessage.includes('price')) {
        return "I can help you compare prices! Here's what I found:<br><br>" +
               "• <strong>Paracetamol 500mg:</strong> ETB 23.00 - ETB 27.00<br>" +
               "• <strong>Ibuprofen 400mg:</strong> ETB 30.00 - ETB 35.50<br>" +
               "• <strong>Amoxicillin 250mg:</strong> ETB 42.50 - ETB 48.00<br><br>" +
               "Would you like detailed price comparison for a specific medicine?";
    }
    
    // Pharmacy location requests
    if (lowerMessage.includes('pharmacy') || lowerMessage.includes('location') || lowerMessage.includes('nearest')) {
        return getPharmacyInfo();
    }
    
    // Order help
    if (lowerMessage.includes('order') || lowerMessage.includes('buy')) {
        return "I can help you place an order! Here's how:<br><br>" +
               "1. Search for the medicine you need<br>" +
               "2. Compare prices across pharmacies<br>" +
               "3. Select your preferred pharmacy<br>" +
               "4. Click 'Order Now' and complete payment<br><br>" +
               "You'll need to be logged in to place orders. Would you like me to help you find a specific medicine?";
    }
    
    // Payment information
    if (lowerMessage.includes('payment') || lowerMessage.includes('telebirr') || lowerMessage.includes('pay')) {
        return "We accept payments through TeleBirr! Here's how it works:<br><br>" +
               "• Secure mobile payment system<br>" +
               "• Instant payment confirmation<br>" +
               "• No additional fees<br>" +
               "• 24/7 payment support<br><br>" +
               "Simply enter your TeleBirr phone number during checkout and follow the prompts.";
    }
    
    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return "I'm here to help! I can assist you with:<br><br>" +
               "🔍 <strong>Medicine Search:</strong> Find any medicine and get detailed information<br>" +
               "💰 <strong>Price Comparison:</strong> Compare prices across all partner pharmacies<br>" +
               "📍 <strong>Pharmacy Locations:</strong> Find the nearest pharmacy to you<br>" +
               "🛒 <strong>Order Assistance:</strong> Help you place and track orders<br>" +
               "💊 <strong>Medicine Information:</strong> Dosage, uses, and side effects<br><br>" +
               "What would you like help with?";
    }
    
    // Side effects queries
    if (lowerMessage.includes('side effect') || lowerMessage.includes('adverse')) {
        return "I can provide general information about common side effects, but please remember:<br><br>" +
               "⚠️ <strong>Important:</strong> Always consult with a healthcare professional for medical advice<br><br>" +
               "Which medicine would you like to know about? I have information on:<br>" +
               "• Paracetamol<br>" +
               "• Ibuprofen<br>" +
               "• Amoxicillin<br>" +
               "• And many more!";
    }
    
    // Dosage queries
    if (lowerMessage.includes('dosage') || lowerMessage.includes('dose') || lowerMessage.includes('how much')) {
        return "Dosage information is crucial for safe medication use. I can provide general guidelines, but:<br><br>" +
               "⚠️ <strong>Always follow your doctor's prescription or package instructions</strong><br><br>" +
               "Which medicine do you need dosage information for? Please specify the medicine name and I'll help you.";
    }
    
    // Generic fallback responses
    const fallbackResponses = [
        "I understand you're asking about '" + message + "'. Could you please be more specific? I can help with medicine information, price comparisons, pharmacy locations, or order assistance.",
        "That's an interesting question! I specialize in pharmacy-related queries. Try asking me about medicines, prices, pharmacy locations, or how to place orders.",
        "I'd love to help you with that! I'm most knowledgeable about medicines, pharmacy services, and ordering. What specific information do you need?",
        "I'm here to assist with your pharmacy needs! You can ask me about medicine information, price comparisons, nearby pharmacies, or how to place orders. What would you like to know?"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

function getMedicineInfo(medicineName) {
    const medicine = chatbotKnowledge.medicines[medicineName];
    if (!medicine) return "I don't have information about that medicine yet.";
    
    return `<strong>${medicine.name}</strong><br><br>` +
           `<strong>Uses:</strong> ${medicine.uses}<br>` +
           `<strong>Typical Dosage:</strong> ${medicine.dosage}<br>` +
           `<strong>Side Effects:</strong> ${medicine.sideEffects}<br>` +
           `<strong>Price Range:</strong> ${medicine.price}<br><br>` +
           `⚠️ <strong>Note:</strong> This is general information. Always consult a healthcare professional for personalized medical advice.`;
}

function getPharmacyInfo() {
    let response = "Here are our partner pharmacies near you:<br><br>";
    
    chatbotKnowledge.pharmacies.forEach((pharmacy, index) => {
        response += `${index + 1}. <strong>${pharmacy.name}</strong><br>`;
        response += `   📍 Distance: ${pharmacy.distance}<br>`;
        response += `   📞 Phone: ${pharmacy.phone}<br><br>`;
    });
    
    response += "Would you like directions to any of these pharmacies or help finding a specific medicine?";
    return response;
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add chatbot initialization to existing DOMContentLoaded
    setTimeout(() => {
        // Show a welcome notification after page loads
        if (!localStorage.getItem('chatbot_welcomed')) {
            setTimeout(() => {
                showAlert('💬 Need help? Try our AI Assistant in the bottom right corner!', 'info');
                localStorage.setItem('chatbot_welcomed', 'true');
            }, 3000);
        }
    }, 1000);
    
    // Initialize newsletter form
    initializeNewsletterForm();
});

// Newsletter Form Functionality
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
}

function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const submitButton = e.target.querySelector('button');
    const originalButtonText = submitButton.innerHTML;
    
    if (!email) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Success animation
        const newsletterInput = document.querySelector('.newsletter-input');
        newsletterInput.classList.add('success');
        
        setTimeout(() => {
            newsletterInput.classList.remove('success');
        }, 600);
        
        // Clear form and show success message
        emailInput.value = '';
        showAlert('🎉 Successfully subscribed to our newsletter! You\'ll receive updates about new medicines, pharmacy partnerships, and health tips.', 'success');
        
        // Store subscription status
        localStorage.setItem('newsletter_subscribed', 'true');
        localStorage.setItem('newsletter_email', email);
        
    }, 2000);
}

// Footer Link Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // For links that don't have corresponding elements, show coming soon message
                e.preventDefault();
                showAlert('This feature is coming soon! Stay tuned for updates.', 'info');
            }
        });
    });
    
    // Add click handlers for footer links that don't have pages yet
    const comingSoonLinks = [
        '#prescription-upload', '#inventory-management', '#order-processing', 
        '#analytics-dashboard', '#delivery-coordination', '#customer-support',
        '#live-chat', '#cookie-policy', '#data-protection'
    ];
    
    comingSoonLinks.forEach(linkHref => {
        const links = document.querySelectorAll(`a[href="${linkHref}"]`);
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const linkText = this.textContent;
                showAlert(`${linkText} feature is coming soon! We're working hard to bring you this functionality.`, 'info');
            });
        });
    });
    
    // Social media link handlers
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').classList[1].split('-')[1];
            showAlert(`Follow us on ${platform.charAt(0).toUpperCase() + platform.slice(1)}! Social media integration coming soon.`, 'info');
        });
    });
});

// Footer Visibility Animation
function initializeFooterAnimations() {
    const footerSections = document.querySelectorAll('.footer-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    footerSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });
}

// Initialize footer animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeFooterAnimations, 1000);
});
// Enhanced Homepage Functionality

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const numberElement = counter.querySelector('.stat-number');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                numberElement.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                numberElement.textContent = target + '+';
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Quick Search Functionality
function quickSearch(medicine) {
    const searchInput = document.getElementById('medicine-search');
    searchInput.value = medicine;
    searchMedicine();
}

function searchMedicineByName(medicineName) {
    const searchInput = document.getElementById('medicine-search');
    searchInput.value = medicineName;
    searchMedicine();
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('search-results').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }, 500);
}

// Enhanced Testimonials Slider
let currentTestimonialIndex = 0;
let testimonials = [];
let dots = [];
let testimonialAutoplayInterval = null;

function initTestimonials() {
    // Get testimonial elements after DOM is loaded
    testimonials = document.querySelectorAll('.testimonial-card');
    dots = document.querySelectorAll('.dot');
    
    console.log('Testimonials initialized:', testimonials.length, 'testimonials found');
    
    if (testimonials.length > 0) {
        // Show first testimonial
        showTestimonial(0);
        
        // Start autoplay
        startTestimonialAutoplay();
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleTestimonialKeyboard);
        
        // Pause autoplay on hover
        const testimonialSection = document.querySelector('.testimonials-slider');
        if (testimonialSection) {
            testimonialSection.addEventListener('mouseenter', pauseTestimonialAutoplay);
            testimonialSection.addEventListener('mouseleave', startTestimonialAutoplay);
        }
    }
}

function showTestimonial(index) {
    if (testimonials.length === 0) return;
    
    // Ensure index is within bounds
    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;
    
    currentTestimonialIndex = index;
    
    // Hide all testimonials with fade effect
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active');
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateX(20px)';
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current testimonial with animation
    setTimeout(() => {
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
            testimonials[index].style.opacity = '1';
            testimonials[index].style.transform = 'translateX(0)';
        }
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }, 150);
    
    console.log('Showing testimonial:', index + 1, 'of', testimonials.length);
}

function nextTestimonial() {
    if (testimonials.length === 0) {
        console.warn('No testimonials found');
        return;
    }
    
    const nextIndex = (currentTestimonialIndex + 1) % testimonials.length;
    showTestimonial(nextIndex);
    
    // Reset autoplay timer
    resetTestimonialAutoplay();
}

function prevTestimonial() {
    if (testimonials.length === 0) {
        console.warn('No testimonials found');
        return;
    }
    
    const prevIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(prevIndex);
    
    // Reset autoplay timer
    resetTestimonialAutoplay();
}

function currentTestimonial(index) {
    if (testimonials.length === 0) {
        console.warn('No testimonials found');
        return;
    }
    
    const testimonialIndex = index - 1; // Convert from 1-based to 0-based index
    if (testimonialIndex >= 0 && testimonialIndex < testimonials.length) {
        showTestimonial(testimonialIndex);
        
        // Reset autoplay timer
        resetTestimonialAutoplay();
    }
}

function startTestimonialAutoplay() {
    if (testimonials.length <= 1) return; // Don't autoplay if only one testimonial
    
    pauseTestimonialAutoplay(); // Clear any existing interval
    
    testimonialAutoplayInterval = setInterval(() => {
        nextTestimonial();
    }, 5000); // Change every 5 seconds
}

function pauseTestimonialAutoplay() {
    if (testimonialAutoplayInterval) {
        clearInterval(testimonialAutoplayInterval);
        testimonialAutoplayInterval = null;
    }
}

function resetTestimonialAutoplay() {
    pauseTestimonialAutoplay();
    startTestimonialAutoplay();
}

function handleTestimonialKeyboard(e) {
    if (e.key === 'ArrowLeft') {
        prevTestimonial();
    } else if (e.key === 'ArrowRight') {
        nextTestimonial();
    }
}

// Make functions globally available
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.currentTestimonial = currentTestimonial;

// Hero Actions
function exploreFeatures() {
    document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function watchDemo() {
    // Create demo modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h2><i class="fas fa-play"></i> PharmaCare Demo</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 3rem;">
                    <div style="width: 200px; height: 200px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
                        <i class="fas fa-play" style="font-size: 4rem; color: white; margin-left: 0.5rem;"></i>
                    </div>
                    <h3>Demo Video Coming Soon!</h3>
                    <p>We're preparing an amazing demo video to show you all the features of PharmaCare. Stay tuned!</p>
                    <div style="margin-top: 2rem;">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-bell"></i> Notify Me When Ready
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function getStarted() {
    // Scroll to search or show registration
    const searchInput = document.getElementById('medicine-search');
    searchInput.focus();
    searchInput.scrollIntoView({ behavior: 'smooth' });
    
    // Add pulse animation to search
    searchInput.style.animation = 'pulse 1s ease-in-out 3';
}

function learnMore() {
    document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.feature-card, .step-item, .popular-card, .testimonial-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Newsletter subscription
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showAlert('Thank you for subscribing! You\'ll receive updates about new features and health tips.', 'success');
                this.reset();
            }
        });
    }
}

// Add pulse animation CSS
function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Enhanced search functionality
function enhancedSearchMedicine() {
    const searchTerm = document.getElementById('medicine-search').value.trim();
    
    if (!searchTerm) {
        showAlert('Please enter a medicine name or condition to search.', 'error');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        // Show search results section
        const resultsSection = document.getElementById('search-results');
        resultsSection.classList.remove('hidden');
        
        // Generate mock results
        const mockResults = generateMockSearchResults(searchTerm);
        displaySearchResults(mockResults);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        showAlert(`Found ${mockResults.length} results for "${searchTerm}"`, 'success');
    }, 1500);
}

function generateMockSearchResults(searchTerm) {
    const mockMedicines = [
        {
            name: searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1),
            genericName: 'Generic ' + searchTerm,
            price: Math.floor(Math.random() * 100) + 20,
            availability: Math.floor(Math.random() * 50) + 10,
            rating: (Math.random() * 2 + 3).toFixed(1),
            pharmacies: Math.floor(Math.random() * 30) + 15
        },
        {
            name: searchTerm + ' Plus',
            genericName: 'Enhanced ' + searchTerm,
            price: Math.floor(Math.random() * 150) + 30,
            availability: Math.floor(Math.random() * 40) + 5,
            rating: (Math.random() * 2 + 3).toFixed(1),
            pharmacies: Math.floor(Math.random() * 25) + 10
        },
        {
            name: searchTerm + ' Extra Strength',
            genericName: 'Strong ' + searchTerm,
            price: Math.floor(Math.random() * 200) + 50,
            availability: Math.floor(Math.random() * 35) + 8,
            rating: (Math.random() * 2 + 3).toFixed(1),
            pharmacies: Math.floor(Math.random() * 20) + 12
        }
    ];
    
    return mockMedicines;
}

function displaySearchResults(results) {
    const container = document.getElementById('medicine-list');
    
    container.innerHTML = results.map(medicine => `
        <div class="medicine-card">
            <div class="medicine-header">
                <h3>${medicine.name}</h3>
                <div class="medicine-rating">
                    <span class="stars">${'★'.repeat(Math.floor(medicine.rating))}${'☆'.repeat(5 - Math.floor(medicine.rating))}</span>
                    <span>${medicine.rating}</span>
                </div>
            </div>
            <p class="medicine-generic">${medicine.genericName}</p>
            <div class="medicine-details">
                <div class="medicine-price">ETB ${medicine.price}</div>
                <div class="medicine-availability">Available in ${medicine.pharmacies} pharmacies</div>
            </div>
            <div class="medicine-actions">
                <button class="btn btn-primary" onclick="comparePrices('${medicine.name}')">
                    <i class="fas fa-chart-bar"></i> Compare Prices
                </button>
                <button class="btn btn-outline" onclick="findPharmacies('${medicine.name}')">
                    <i class="fas fa-map-marker-alt"></i> Find Pharmacy
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    initializeApp();
    
    // Initialize new features
    animateCounters();
    initTestimonials(); // Initialize testimonials first
    initSmoothScrolling();
    initParallaxEffect();
    initScrollAnimations();
    initNewsletterForm();
    addPulseAnimation();
    
    // Override the original searchMedicine function
    window.searchMedicine = enhancedSearchMedicine;
    
    console.log('Enhanced homepage features initialized successfully!');
});

// Add some utility functions for better UX
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            }
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-info { border-left: 4px solid #3b82f6; }
            .notification-content { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
            .notification-close { background: none; border: none; cursor: pointer; color: #6b7280; }
            .notification-close:hover { color: #374151; }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Enhanced alert function
const originalShowAlert = window.showAlert;
window.showAlert = function(message, type) {
    if (originalShowAlert) {
        originalShowAlert(message, type);
    } else {
        showNotification(message, type);
    }
};
// Additional functions for hero section functionality
function findPharmacies(medicineName) {
    showAlert(`Finding pharmacies with ${medicineName} in stock...`, 'info');
    
    // Simulate finding pharmacies
    setTimeout(() => {
        window.location.href = './components/pharmacies.html';
    }, 1000);
}

// Initialize stats counter animation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = entry.target.querySelectorAll('.stat-item[data-count]');
                statItems.forEach(item => {
                    const target = parseInt(item.getAttribute('data-count'));
                    const numberElement = item.querySelector('.stat-number');
                    
                    if (target === 24) {
                        // Special case for 24/7
                        numberElement.textContent = '24/7';
                        return;
                    }
                    
                    let current = 0;
                    const increment = target / 50;
                    
                    const updateNumber = () => {
                        if (current < target) {
                            current += increment;
                            numberElement.textContent = Math.ceil(current) + '+';
                            requestAnimationFrame(updateNumber);
                        } else {
                            numberElement.textContent = target + '+';
                        }
                    };
                    
                    updateNumber();
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});
// Payment Integration Functions
function initializePaymentSystem() {
    // Check for completed orders on page load
    const completedOrder = localStorage.getItem('lastCompletedOrder');
    if (completedOrder) {
        const order = JSON.parse(completedOrder);
        // Add to orders list if not already there
        addCompletedOrderToHistory(order);
    }
    
    // Initialize cart indicator
    updateCartIndicator();
}

function addCompletedOrderToHistory(order) {
    // Get existing orders
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // Check if order already exists
    const existingOrder = orderHistory.find(o => o.id === order.id);
    if (!existingOrder) {
        // Add order with proper status
        const historyOrder = {
            ...order,
            status: order.paymentMethod === 'cash' ? 'confirmed' : 'paid',
            tracking: [
                { status: 'Order Placed', time: order.createdAt || new Date().toISOString(), completed: true },
                { status: 'Payment Confirmed', time: order.paidAt || new Date().toISOString(), completed: true },
                { status: 'Processing', time: null, completed: false, active: true },
                { status: 'Shipped', time: null, completed: false },
                { status: 'Delivered', time: null, completed: false }
            ]
        };
        
        orderHistory.unshift(historyOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    }
}

function createOrderFromCart() {
    const cart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + item.total, 0);
    const deliveryFee = 15.00;
    const serviceFee = 5.00;
    const total = subtotal + deliveryFee + serviceFee;
    
    // Group items by pharmacy
    const pharmacyGroups = cart.reduce((groups, item) => {
        const key = item.pharmacyId;
        if (!groups[key]) {
            groups[key] = {
                pharmacyId: item.pharmacyId,
                pharmacyName: item.pharmacyName,
                items: []
            };
        }
        groups[key].items.push(item);
        return groups;
    }, {});
    
    // For now, create single order (in real app, might split by pharmacy)
    const orderId = `ORD-2024-${Date.now().toString(36).toUpperCase()}`;
    
    const orderData = {
        id: orderId,
        items: cart.map(item => ({
            id: item.medicineId,
            name: item.name,
            brand: item.brand,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            prescription: item.prescription
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        serviceFee: serviceFee,
        discount: 0.00,
        total: total,
        pharmacy: {
            id: Object.values(pharmacyGroups)[0].pharmacyId,
            name: Object.values(pharmacyGroups)[0].pharmacyName,
            phone: '+251911234567'
        },
        deliveryAddress: currentUser?.address || '123 Main Street, Addis Ababa, Ethiopia',
        estimatedDelivery: '30-45 minutes',
        createdAt: new Date().toISOString()
    };
    
    // Store order data
    localStorage.setItem('pendingOrderId', orderId);
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    
    // Clear cart
    localStorage.removeItem('medicineCart');
    updateCartIndicator();
    
    // Redirect to payment
    window.location.href = './components/payment.html?order=' + orderId;
}

function updateCartIndicator() {
    const cart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart badges
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(badge => {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'block' : 'none';
    });
    
    // Update cart button text
    const cartButtons = document.querySelectorAll('.cart-button');
    cartButtons.forEach(button => {
        if (cartCount > 0) {
            button.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${cartCount})`;
        } else {
            button.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart`;
        }
    });
}

function showCart() {
    const cart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'info');
        return;
    }
    
    // Create cart modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'cart-modal';
    
    const subtotal = cart.reduce((total, item) => total + item.total, 0);
    const deliveryFee = 15.00;
    const serviceFee = 5.00;
    const total = subtotal + deliveryFee + serviceFee;
    
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h2><i class="fas fa-shopping-cart"></i> Your Cart</h2>
                <span class="close" onclick="closeCartModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item" data-medicine-id="${item.medicineId}" data-pharmacy-id="${item.pharmacyId}">
                            <div class="item-info">
                                <h4>${item.name}</h4>
                                <p>${item.brand} - ${item.pharmacyName}</p>
                                ${item.prescription ? '<span class="prescription-badge">Prescription Required</span>' : ''}
                            </div>
                            <div class="item-controls">
                                <button class="btn-small" onclick="updateCartQuantity(${item.medicineId}, ${item.pharmacyId}, -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="btn-small" onclick="updateCartQuantity(${item.medicineId}, ${item.pharmacyId}, 1)">+</button>
                            </div>
                            <div class="item-price">ETB ${item.total.toFixed(2)}</div>
                            <button class="btn-remove" onclick="removeFromCart(${item.medicineId}, ${item.pharmacyId})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cart-totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>ETB ${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Delivery Fee:</span>
                        <span>ETB ${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Service Fee:</span>
                        <span>ETB ${serviceFee.toFixed(2)}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Total:</span>
                        <span>ETB ${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeCartModal()">Continue Shopping</button>
                <button class="btn btn-success" onclick="proceedToCheckout()">
                    <i class="fas fa-credit-card"></i> Proceed to Checkout
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function updateCartQuantity(medicineId, pharmacyId, change) {
    let cart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    const itemIndex = cart.findIndex(item => 
        item.medicineId === medicineId && item.pharmacyId === pharmacyId
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].total = cart[itemIndex].price * cart[itemIndex].quantity;
        }
        
        localStorage.setItem('medicineCart', JSON.stringify(cart));
        updateCartIndicator();
        
        // Refresh cart modal
        closeCartModal();
        if (cart.length > 0) {
            showCart();
        }
    }
}

function removeFromCart(medicineId, pharmacyId) {
    let cart = JSON.parse(localStorage.getItem('medicineCart') || '[]');
    cart = cart.filter(item => 
        !(item.medicineId === medicineId && item.pharmacyId === pharmacyId)
    );
    
    localStorage.setItem('medicineCart', JSON.stringify(cart));
    updateCartIndicator();
    
    // Refresh cart modal
    closeCartModal();
    if (cart.length > 0) {
        showCart();
    } else {
        showAlert('Cart is now empty', 'info');
    }
}

function proceedToCheckout() {
    closeCartModal();
    createOrderFromCart();
}

// Initialize payment system on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentSystem();
});

// Global payment functions
window.createOrderFromCart = createOrderFromCart;
window.showCart = showCart;
window.closeCartModal = closeCartModal;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.proceedToCheckout = proceedToCheckout;