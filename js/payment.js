// Payment Page JavaScript with Stripe Integration

// Stripe configuration
const stripe = Stripe('pk_test_51234567890abcdef'); // Replace with your actual Stripe publishable key
const elements = stripe.elements();

// Global variables
let currentOrder = null;
let cardElement = null;
let selectedPaymentMethod = 'card';

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentPage();
    setupStripeElements();
    setupPaymentMethodSelection();
    setupEventListeners();
});

function initializePaymentPage() {
    // Load order data from localStorage
    const orderId = new URLSearchParams(window.location.search).get('order');
    const orderData = localStorage.getItem('pendingOrder');
    
    if (!orderId || !orderData) {
        showAlert('No order found. Redirecting to medicines page...', 'error');
        setTimeout(() => {
            window.location.href = './medicines.html';
        }, 2000);
        return;
    }
    
    currentOrder = JSON.parse(orderData);
    displayOrderSummary();
    updatePaymentButton();
}

function displayOrderSummary() {
    if (!currentOrder) return;
    
    // Display order items
    const orderItems = document.getElementById('order-items');
    orderItems.innerHTML = currentOrder.items.map(item => `
        <div class="order-item">
            <div class="item-image">
                <i class="fas fa-pills"></i>
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.brand}</p>
                <div class="item-meta">
                    <span>Qty: ${item.quantity}</span>
                    ${item.prescription ? '<span class="prescription-badge">Prescription</span>' : ''}
                </div>
            </div>
            <div class="item-price">
                ETB ${item.total.toFixed(2)}
            </div>
        </div>
    `).join('');
    
    // Display totals
    document.getElementById('subtotal').textContent = `ETB ${currentOrder.subtotal.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = `ETB ${currentOrder.deliveryFee.toFixed(2)}`;
    document.getElementById('service-fee').textContent = `ETB ${currentOrder.serviceFee.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `ETB ${currentOrder.total.toFixed(2)}`;
    
    // Display delivery info
    document.getElementById('delivery-address').textContent = currentOrder.deliveryAddress;
    document.getElementById('delivery-time').textContent = currentOrder.estimatedDelivery;
    document.getElementById('pharmacy-name').textContent = currentOrder.pharmacy.name;
    
    // Set payment reference for bank transfer
    document.getElementById('payment-reference').textContent = currentOrder.id;
}

function setupStripeElements() {
    // Create card element
    cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '12px',
            },
            invalid: {
                color: '#9e2146',
            },
        },
    });
    
    cardElement.mount('#card-element');
    
    // Handle real-time validation errors from the card Element
    cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
            displayError.style.display = 'block';
        } else {
            displayError.textContent = '';
            displayError.style.display = 'none';
        }
    });
}

function setupPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            paymentForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to selected method
            this.classList.add('active');
            this.querySelector('input[type="radio"]').checked = true;
            
            // Show corresponding form
            selectedPaymentMethod = this.dataset.method;
            document.getElementById(`${selectedPaymentMethod}-payment`).classList.add('active');
            
            updatePaymentButton();
        });
    });
}

function setupEventListeners() {
    // Promo code application
    document.getElementById('promo-code').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });
    
    // File upload for bank transfer
    const receiptUpload = document.getElementById('receipt-upload');
    if (receiptUpload) {
        receiptUpload.addEventListener('change', handleReceiptUpload);
    }
    
    // Address form submission
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', handleAddressChange);
    }
}

function updatePaymentButton() {
    const payButton = document.getElementById('pay-button');
    const payButtonText = document.getElementById('pay-button-text');
    const payAmount = document.getElementById('pay-amount');
    
    if (!currentOrder) return;
    
    payAmount.textContent = `ETB ${currentOrder.total.toFixed(2)}`;
    
    switch (selectedPaymentMethod) {
        case 'card':
            payButtonText.textContent = 'Pay with Card';
            payButton.innerHTML = `
                <i class="fas fa-credit-card"></i>
                <span>Pay with Card</span>
                <span>ETB ${currentOrder.total.toFixed(2)}</span>
            `;
            break;
        case 'telebirr':
            payButtonText.textContent = 'Pay with TeleBirr';
            payButton.innerHTML = `
                <i class="fas fa-mobile-alt"></i>
                <span>Pay with TeleBirr</span>
                <span>ETB ${currentOrder.total.toFixed(2)}</span>
            `;
            break;
        case 'bank':
            payButtonText.textContent = 'Submit Bank Transfer';
            payButton.innerHTML = `
                <i class="fas fa-university"></i>
                <span>Submit Transfer</span>
                <span>ETB ${currentOrder.total.toFixed(2)}</span>
            `;
            break;
        case 'cash':
            payButtonText.textContent = 'Place Order (COD)';
            payButton.innerHTML = `
                <i class="fas fa-money-bill-wave"></i>
                <span>Place Order</span>
                <span>ETB ${currentOrder.total.toFixed(2)}</span>
            `;
            break;
    }
}

async function processPayment() {
    if (!currentOrder) {
        showAlert('Order data not found', 'error');
        return;
    }
    
    // Show processing modal
    showProcessingModal();
    
    try {
        switch (selectedPaymentMethod) {
            case 'card':
                await processCardPayment();
                break;
            case 'telebirr':
                await processTeleBirrPayment();
                break;
            case 'bank':
                await processBankTransfer();
                break;
            case 'cash':
                await processCashOnDelivery();
                break;
            default:
                throw new Error('Invalid payment method');
        }
    } catch (error) {
        hideProcessingModal();
        showAlert(`Payment failed: ${error.message}`, 'error');
    }
}

async function processCardPayment() {
    const cardholderName = document.getElementById('cardholder-name').value;
    const billingEmail = document.getElementById('billing-email').value;
    
    if (!cardholderName || !billingEmail) {
        throw new Error('Please fill in all required fields');
    }
    
    // Create payment intent on your server
    const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: Math.round(currentOrder.total * 100), // Convert to cents
            currency: 'etb',
            orderId: currentOrder.id,
            customerEmail: billingEmail
        }),
    });
    
    const { clientSecret } = await paymentIntentResponse.json();
    
    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: cardholderName,
                email: billingEmail,
                address: {
                    line1: document.getElementById('billing-address').value,
                    city: document.getElementById('billing-city').value,
                    state: document.getElementById('billing-state').value,
                    postal_code: document.getElementById('billing-zip').value,
                }
            }
        }
    });
    
    if (error) {
        throw new Error(error.message);
    }
    
    if (paymentIntent.status === 'succeeded') {
        await completeOrder({
            paymentMethod: 'card',
            paymentId: paymentIntent.id,
            status: 'paid'
        });
    }
}

async function processTeleBirrPayment() {
    const phoneNumber = document.getElementById('telebirr-phone').value;
    
    if (!phoneNumber) {
        throw new Error('Please enter your TeleBirr phone number');
    }
    
    // Simulate TeleBirr payment process
    await simulatePaymentProcess('telebirr');
    
    await completeOrder({
        paymentMethod: 'telebirr',
        paymentId: `TB-${Date.now()}`,
        phoneNumber: phoneNumber,
        status: 'paid'
    });
}

async function processBankTransfer() {
    const receiptFile = document.getElementById('receipt-upload').files[0];
    
    if (!receiptFile) {
        throw new Error('Please upload your transfer receipt');
    }
    
    // Simulate bank transfer processing
    await simulatePaymentProcess('bank');
    
    await completeOrder({
        paymentMethod: 'bank',
        paymentId: `BT-${Date.now()}`,
        receiptUploaded: true,
        status: 'pending_verification'
    });
}

async function processCashOnDelivery() {
    // Simulate COD processing
    await simulatePaymentProcess('cash');
    
    await completeOrder({
        paymentMethod: 'cash',
        paymentId: `COD-${Date.now()}`,
        status: 'confirmed'
    });
}

async function simulatePaymentProcess(method) {
    // Simulate processing steps
    const steps = document.querySelectorAll('.processing-steps .step');
    
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        steps[i].classList.add('active');
    }
    
    // Additional delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
}

async function completeOrder(paymentData) {
    // Update order with payment information
    const completedOrder = {
        ...currentOrder,
        payment: paymentData,
        status: paymentData.status,
        completedAt: new Date().toISOString()
    };
    
    // Save to localStorage (in real app, send to server)
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    orders.push(completedOrder);
    localStorage.setItem('userOrders', JSON.stringify(orders));
    
    // Clear pending order
    localStorage.removeItem('pendingOrder');
    localStorage.removeItem('pendingOrderId');
    
    // Hide processing modal and show success
    hideProcessingModal();
    showSuccessModal(completedOrder);
}

function showProcessingModal() {
    const modal = document.getElementById('payment-processing-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideProcessingModal() {
    const modal = document.getElementById('payment-processing-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function showSuccessModal(order) {
    const modal = document.getElementById('payment-success-modal');
    
    // Update success modal content
    document.getElementById('confirmation-order-id').textContent = order.id;
    document.getElementById('confirmation-amount').textContent = `ETB ${order.total.toFixed(2)}`;
    document.getElementById('confirmation-delivery').textContent = order.estimatedDelivery;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function applyPromoCode() {
    const promoCode = document.getElementById('promo-code').value.trim().toUpperCase();
    
    if (!promoCode) {
        showAlert('Please enter a promo code', 'error');
        return;
    }
    
    // Simulate promo code validation
    const validCodes = {
        'WELCOME10': { discount: 0.10, description: '10% off your first order' },
        'HEALTH20': { discount: 0.20, description: '20% off health supplements' },
        'SAVE5': { discount: 5, description: 'ETB 5 off any order' }
    };
    
    if (validCodes[promoCode]) {
        const promo = validCodes[promoCode];
        let discountAmount = 0;
        
        if (promo.discount < 1) {
            // Percentage discount
            discountAmount = currentOrder.subtotal * promo.discount;
        } else {
            // Fixed amount discount
            discountAmount = promo.discount;
        }
        
        // Update order total
        currentOrder.discount = discountAmount;
        currentOrder.total = currentOrder.subtotal + currentOrder.deliveryFee + currentOrder.serviceFee - discountAmount;
        
        // Update display
        const discountRow = document.getElementById('discount-row');
        discountRow.style.display = 'flex';
        document.getElementById('discount-amount').textContent = `-ETB ${discountAmount.toFixed(2)}`;
        document.getElementById('grand-total').textContent = `ETB ${currentOrder.total.toFixed(2)}`;
        
        updatePaymentButton();
        showAlert(`Promo code applied! ${promo.description}`, 'success');
        
        // Disable promo input
        document.getElementById('promo-code').disabled = true;
        document.querySelector('.promo-section button').disabled = true;
        document.querySelector('.promo-section button').textContent = 'Applied';
    } else {
        showAlert('Invalid promo code', 'error');
    }
}

function changeDeliveryAddress() {
    const modal = document.getElementById('address-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function handleAddressChange(e) {
    e.preventDefault();
    
    const newAddress = document.getElementById('new-address').value;
    const newCity = document.getElementById('new-city').value;
    const newDistrict = document.getElementById('new-district').value;
    const contactPhone = document.getElementById('contact-phone').value;
    
    const fullAddress = `${newAddress}, ${newDistrict}, ${newCity}`;
    
    // Update order
    currentOrder.deliveryAddress = fullAddress;
    currentOrder.contactPhone = contactPhone;
    
    // Update display
    document.getElementById('delivery-address').textContent = fullAddress;
    
    // Save updated order
    localStorage.setItem('pendingOrder', JSON.stringify(currentOrder));
    
    closeModal();
    showAlert('Delivery address updated', 'success');
}

function handleReceiptUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showAlert('Please upload a valid image (JPG, PNG) or PDF file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'error');
        return;
    }
    
    // Update upload area
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.innerHTML = `
        <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
        <p style="color: var(--success-color);">Receipt uploaded successfully</p>
        <small>${file.name}</small>
    `;
    
    showAlert('Receipt uploaded successfully', 'success');
}

function editOrder() {
    // Go back to medicines page
    window.location.href = './medicines.html';
}

function goBack() {
    // Go back to previous page
    window.history.back();
}

function viewOrderDetails() {
    // Redirect to orders page
    window.location.href = './orders.html';
}

function trackOrder() {
    // Redirect to order tracking
    window.location.href = `./orders.html?track=${currentOrder.id}`;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = '';
}

// Utility functions
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Global functions
window.processPayment = processPayment;
window.applyPromoCode = applyPromoCode;
window.changeDeliveryAddress = changeDeliveryAddress;
window.editOrder = editOrder;
window.goBack = goBack;
window.viewOrderDetails = viewOrderDetails;
window.trackOrder = trackOrder;
window.closeModal = closeModal;