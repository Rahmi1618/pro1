// Orders Page Specific JavaScript

// Sample orders data
const sampleOrders = [
    {
        id: 'ORD-2024-001',
        date: '2024-01-15T10:30:00Z',
        status: 'delivered',
        pharmacy: {
            id: 1,
            name: 'City Pharmacy',
            phone: '+251911234567'
        },
        items: [
            {
                id: 1,
                name: 'Paracetamol 500mg',
                brand: 'Panadol',
                quantity: 2,
                price: 25.50,
                total: 51.00
            }
        ],
        total: 51.00,
        deliveryAddress: '123 Main Street, Addis Ababa',
        paymentMethod: 'TeleBirr',
        deliveryTime: '45 minutes',
        tracking: [
            { status: 'Order Placed', time: '2024-01-15T10:30:00Z', completed: true },
            { status: 'Confirmed', time: '2024-01-15T10:35:00Z', completed: true },
            { status: 'Processing', time: '2024-01-15T10:45:00Z', completed: true },
            { status: 'Shipped', time: '2024-01-15T11:00:00Z', completed: true },
            { status: 'Delivered', time: '2024-01-15T11:15:00Z', completed: true }
        ]
    },
    {
        id: 'ORD-2024-002',
        date: '2024-01-14T14:20:00Z',
        status: 'shipped',
        pharmacy: {
            id: 2,
            name: 'Health Plus',
            phone: '+251911234568'
        },
        items: [
            {
                id: 2,
                name: 'Amoxicillin 250mg',
                brand: 'Amoxil',
                quantity: 1,
                price: 42.50,
                total: 42.50
            },
            {
                id: 3,
                name: 'Ibuprofen 400mg',
                brand: 'Advil',
                quantity: 1,
                price: 32.00,
                total: 32.00
            }
        ],
        total: 74.50,
        deliveryAddress: '456 Oak Avenue, Addis Ababa',
        paymentMethod: 'TeleBirr',
        deliveryTime: '30 minutes',
        tracking: [
            { status: 'Order Placed', time: '2024-01-14T14:20:00Z', completed: true },
            { status: 'Confirmed', time: '2024-01-14T14:25:00Z', completed: true },
            { status: 'Processing', time: '2024-01-14T14:35:00Z', completed: true },
            { status: 'Shipped', time: '2024-01-14T14:50:00Z', completed: true, active: true },
            { status: 'Out for Delivery', time: null, completed: false },
            { status: 'Delivered', time: null, completed: false }
        ]
    },
    {
        id: 'ORD-2024-003',
        date: '2024-01-13T09:15:00Z',
        status: 'processing',
        pharmacy: {
            id: 3,
            name: 'MedCare',
            phone: '+251911234569'
        },
        items: [
            {
                id: 4,
                name: 'Metformin 500mg',
                brand: 'Glucophage',
                quantity: 3,
                price: 38.50,
                total: 115.50
            }
        ],
        total: 115.50,
        deliveryAddress: '789 Pine Street, Addis Ababa',
        paymentMethod: 'TeleBirr',
        deliveryTime: '60 minutes',
        tracking: [
            { status: 'Order Placed', time: '2024-01-13T09:15:00Z', completed: true },
            { status: 'Confirmed', time: '2024-01-13T09:20:00Z', completed: true },
            { status: 'Processing', time: '2024-01-13T09:30:00Z', completed: true, active: true },
            { status: 'Shipped', time: null, completed: false },
            { status: 'Delivered', time: null, completed: false }
        ]
    },
    {
        id: 'ORD-2024-004',
        date: '2024-01-12T16:45:00Z',
        status: 'cancelled',
        pharmacy: {
            id: 4,
            name: 'Wellness Pharmacy',
            phone: '+251911234570'
        },
        items: [
            {
                id: 5,
                name: 'Vitamin D3 1000IU',
                brand: "Nature's Bounty",
                quantity: 1,
                price: 29.00,
                total: 29.00
            }
        ],
        total: 29.00,
        deliveryAddress: '321 Elm Street, Addis Ababa',
        paymentMethod: 'TeleBirr',
        deliveryTime: 'N/A',
        cancelReason: 'Changed my mind',
        tracking: [
            { status: 'Order Placed', time: '2024-01-12T16:45:00Z', completed: true },
            { status: 'Cancelled', time: '2024-01-12T16:50:00Z', completed: true }
        ]
    }
];

let allOrders = [...sampleOrders];
let filteredOrders = [...sampleOrders];
let currentOrderId = null;

// Initialize orders page
document.addEventListener('DOMContentLoaded', function() {
    initializeOrdersPage();
    setupOrderEventListeners();
    loadOrders();
    updateOrderStats();
});

function initializeOrdersPage() {
    // Check if user is logged in
    if (!currentUser) {
        showLoginPrompt();
        return;
    }
    
    // Load user's orders (in real app, this would be an API call)
    loadUserOrders();
}

function setupOrderEventListeners() {
    // Filter event listeners
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const pharmacyFilter = document.getElementById('pharmacy-filter');
    const orderSearch = document.getElementById('order-search');
    
    if (statusFilter) statusFilter.addEventListener('change', filterOrders);
    if (dateFilter) dateFilter.addEventListener('change', filterOrders);
    if (pharmacyFilter) pharmacyFilter.addEventListener('change', filterOrders);
    if (orderSearch) orderSearch.addEventListener('input', filterOrders);
    
    // Form submissions
    const quickOrderForm = document.getElementById('quick-order-form');
    const cancelForm = document.getElementById('cancel-form');
    
    if (quickOrderForm) quickOrderForm.addEventListener('submit', handleQuickOrder);
    if (cancelForm) cancelForm.addEventListener('submit', handleOrderCancellation);
}

function loadUserOrders() {
    // In a real app, this would fetch orders from the server
    // For now, we'll use the sample data
    allOrders = sampleOrders.map(order => ({
        ...order,
        userId: currentUser?.id || 1
    }));
    
    filteredOrders = [...allOrders];
}

function loadOrders() {
    const ordersGrid = document.getElementById('orders-grid');
    const emptyState = document.getElementById('empty-orders');
    
    if (!ordersGrid) return;
    
    if (filteredOrders.length === 0) {
        ordersGrid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    // Show loading state
    ordersGrid.innerHTML = Array(3).fill(0).map(() => 
        '<div class="order-card loading" style="height: 200px;"></div>'
    ).join('');
    
    // Simulate loading delay
    setTimeout(() => {
        ordersGrid.innerHTML = filteredOrders.map(order => createOrderCard(order)).join('');
    }, 800);
}

function createOrderCard(order) {
    const orderDate = new Date(order.date).toLocaleDateString();
    const orderTime = new Date(order.date).toLocaleTimeString();
    
    return `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-info">
                    <h3>Order ${order.id}</h3>
                    <p class="order-id">${orderDate} at ${orderTime}</p>
                </div>
                <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>${item.brand} - Qty: ${item.quantity}</p>
                        </div>
                        <div class="item-price">ETB ${item.total.toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-footer">
                <div class="order-total">Total: ETB ${order.total.toFixed(2)}</div>
                <div class="order-actions">
                    <button class="btn btn-outline" onclick="showOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${order.status === 'shipped' || order.status === 'processing' ? 
                        `<button class="btn" onclick="trackOrder('${order.id}')">
                            <i class="fas fa-truck"></i> Track
                        </button>` : ''
                    }
                    ${order.status === 'pending' || order.status === 'confirmed' ? 
                        `<button class="btn btn-error" onclick="showCancelModal('${order.id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>` : ''
                    }
                </div>
            </div>
        </div>
    `;
}

function filterOrders() {
    const status = document.getElementById('status-filter')?.value || '';
    const dateRange = document.getElementById('date-filter')?.value || '';
    const pharmacy = document.getElementById('pharmacy-filter')?.value || '';
    const searchTerm = document.getElementById('order-search')?.value.toLowerCase() || '';
    
    filteredOrders = allOrders.filter(order => {
        // Status filter
        if (status && order.status !== status) return false;
        
        // Pharmacy filter
        if (pharmacy && order.pharmacy.name.toLowerCase().replace(/\s+/g, '-') !== pharmacy) return false;
        
        // Search filter
        if (searchTerm) {
            const searchableText = `${order.id} ${order.items.map(item => item.name).join(' ')}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) return false;
        }
        
        // Date filter
        if (dateRange) {
            const orderDate = new Date(order.date);
            const now = new Date();
            
            switch (dateRange) {
                case 'today':
                    if (orderDate.toDateString() !== now.toDateString()) return false;
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (orderDate < weekAgo) return false;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    if (orderDate < monthAgo) return false;
                    break;
            }
        }
        
        return true;
    });
    
    loadOrders();
    updateOrderStats();
}

function updateOrderStats() {
    const totalOrders = document.getElementById('total-orders');
    const pendingOrders = document.getElementById('pending-orders');
    const deliveredOrders = document.getElementById('delivered-orders');
    
    if (totalOrders) totalOrders.textContent = allOrders.length;
    if (pendingOrders) {
        const pending = allOrders.filter(order => 
            ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
        ).length;
        pendingOrders.textContent = pending;
    }
    if (deliveredOrders) {
        const delivered = allOrders.filter(order => order.status === 'delivered').length;
        deliveredOrders.textContent = delivered;
    }
}

function showOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-modal');
    const details = document.getElementById('order-details');
    
    const orderDate = new Date(order.date).toLocaleDateString();
    const orderTime = new Date(order.date).toLocaleTimeString();
    
    details.innerHTML = `
        <div class="order-summary">
            <div class="order-header-details">
                <h3>Order ${order.id}</h3>
                <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <p><strong>Date:</strong> ${orderDate} at ${orderTime}</p>
            <p><strong>Pharmacy:</strong> ${order.pharmacy.name}</p>
            <p><strong>Phone:</strong> ${order.pharmacy.phone}</p>
            <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            ${order.deliveryTime !== 'N/A' ? `<p><strong>Estimated Delivery:</strong> ${order.deliveryTime}</p>` : ''}
            ${order.cancelReason ? `<p><strong>Cancellation Reason:</strong> ${order.cancelReason}</p>` : ''}
        </div>
        
        <div class="order-items-detail">
            <h4>Items Ordered</h4>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Brand</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.brand}</td>
                            <td>${item.quantity}</td>
                            <td>ETB ${item.price.toFixed(2)}</td>
                            <td class="price-cell">ETB ${item.total.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4"><strong>Total Amount</strong></td>
                        <td class="price-cell"><strong>ETB ${order.total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        <div class="order-actions-detail">
            ${order.status === 'shipped' || order.status === 'processing' ? 
                `<button class="btn" onclick="trackOrder('${order.id}')">
                    <i class="fas fa-truck"></i> Track Order
                </button>` : ''
            }
            ${order.status === 'pending' || order.status === 'confirmed' ? 
                `<button class="btn btn-error" onclick="showCancelModal('${order.id}')">
                    <i class="fas fa-times"></i> Cancel Order
                </button>` : ''
            }
            <button class="btn btn-outline" onclick="contactPharmacy('${order.pharmacy.phone}')">
                <i class="fas fa-phone"></i> Contact Pharmacy
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function trackOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('tracking-modal');
    const details = document.getElementById('tracking-details');
    
    details.innerHTML = `
        <div class="tracking-header">
            <h3>Order ${order.id}</h3>
            <p>Estimated delivery: ${order.deliveryTime}</p>
        </div>
        
        <div class="tracking-timeline">
            ${order.tracking.map(step => `
                <div class="timeline-item ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}">
                    <div class="timeline-content">
                        <h4>${step.status}</h4>
                        ${step.time ? `
                            <div class="timeline-time">
                                ${new Date(step.time).toLocaleDateString()} at ${new Date(step.time).toLocaleTimeString()}
                            </div>
                        ` : '<p>Pending</p>'}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="tracking-actions">
            <button class="btn btn-outline" onclick="refreshTracking('${orderId}')">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <button class="btn" onclick="contactPharmacy('${order.pharmacy.phone}')">
                <i class="fas fa-phone"></i> Contact Pharmacy
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showCancelModal(orderId) {
    currentOrderId = orderId;
    const modal = document.getElementById('cancel-modal');
    modal.style.display = 'block';
}

function handleQuickOrder(e) {
    e.preventDefault();
    
    const medicine = document.getElementById('quick-medicine').value;
    const quantity = parseInt(document.getElementById('quick-quantity').value);
    const pharmacy = document.getElementById('quick-pharmacy').value;
    const notes = document.getElementById('quick-notes').value;
    
    if (!medicine || !quantity || !pharmacy) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    showLoading();
    
    // Create pending order for payment
    const pendingOrder = {
        id: `ORD-2024-${String(allOrders.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString(),
        status: 'pending_payment',
        pharmacy: {
            id: 1,
            name: pharmacy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            phone: '+251911234567'
        },
        items: [{
            id: Date.now(),
            name: medicine,
            brand: 'Generic',
            quantity: quantity,
            price: 25.00,
            total: 25.00 * quantity
        }],
        subtotal: 25.00 * quantity,
        deliveryFee: 15.00,
        serviceFee: 5.00,
        total: (25.00 * quantity) + 15.00 + 5.00,
        deliveryAddress: '123 Main Street, Addis Ababa',
        deliveryTime: '45 minutes',
        notes: notes
    };
    
    // Store pending order
    localStorage.setItem('pendingOrderId', pendingOrder.id);
    localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    
    setTimeout(() => {
        hideLoading();
        closeModal();
        
        // Redirect to payment page
        window.location.href = './payment.html?order=' + pendingOrder.id;
        
    }, 1000);
}

function handleOrderCancellation(e) {
    e.preventDefault();
    
    const reason = document.getElementById('cancel-reason').value;
    const comments = document.getElementById('cancel-comments').value;
    
    if (!reason) {
        showAlert('Please select a reason for cancellation.', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate cancellation
    setTimeout(() => {
        hideLoading();
        closeModal();
        
        // Update order status
        const orderIndex = allOrders.findIndex(o => o.id === currentOrderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = 'cancelled';
            allOrders[orderIndex].cancelReason = reason;
            allOrders[orderIndex].cancelComments = comments;
            allOrders[orderIndex].tracking.push({
                status: 'Cancelled',
                time: new Date().toISOString(),
                completed: true
            });
        }
        
        filteredOrders = [...allOrders];
        loadOrders();
        updateOrderStats();
        
        showAlert('Order cancelled successfully.', 'info');
        
        // Reset form
        document.getElementById('cancel-form').reset();
        currentOrderId = null;
        
    }, 1500);
}

function refreshOrders() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        loadOrders();
        showAlert('Orders refreshed successfully.', 'success');
    }, 1000);
}

function refreshTracking(orderId) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        trackOrder(orderId);
        showAlert('Tracking information updated.', 'success');
    }, 1000);
}

function exportOrders() {
    // Create CSV content
    const csvContent = [
        ['Order ID', 'Date', 'Status', 'Pharmacy', 'Items', 'Total'],
        ...filteredOrders.map(order => [
            order.id,
            new Date(order.date).toLocaleDateString(),
            order.status,
            order.pharmacy.name,
            order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
            `ETB ${order.total.toFixed(2)}`
        ])
    ].map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showAlert('Orders exported successfully.', 'success');
}

function contactPharmacy(phone) {
    if (confirm(`Call ${phone}?`)) {
        window.location.href = `tel:${phone}`;
    }
}

function showNewOrderModal() {
    const modal = document.getElementById('new-order-modal');
    modal.style.display = 'block';
}

function showLoginPrompt() {
    const ordersGrid = document.getElementById('orders-grid');
    if (ordersGrid) {
        ordersGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sign-in-alt"></i>
                <h3>Please Login</h3>
                <p>You need to be logged in to view your orders.</p>
                <a href="../login.html" class="btn btn-success">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            </div>
        `;
    }
}