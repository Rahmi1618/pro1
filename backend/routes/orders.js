const express = require('express');
const db = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status, limit = 20, offset = 0 } = req.query;
        
        let sql = `
            SELECT o.*, p.name as pharmacy_name, p.address as pharmacy_address, p.phone as pharmacy_phone
            FROM orders o
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.user_id = ?
        `;
        
        const params = [userId];
        
        if (status) {
            sql += ' AND o.status = ?';
            params.push(status);
        }
        
        sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const orders = await db.all(sql, params);
        
        // Get order items for each order
        for (const order of orders) {
            const items = await db.all(`
                SELECT oi.*, m.name as medicine_name, m.brand, m.category
                FROM order_items oi
                JOIN medicines m ON oi.medicine_id = m.id
                WHERE oi.order_id = ?
            `, [order.id]);
            
            order.items = items;
        }
        
        res.json({
            orders,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: orders.length
            }
        });
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            error: 'Failed to fetch orders',
            message: error.message
        });
    }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        const order = await db.get(`
            SELECT o.*, p.name as pharmacy_name, p.address as pharmacy_address, 
                   p.phone as pharmacy_phone, p.email as pharmacy_email
            FROM orders o
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.id = ? AND o.user_id = ?
        `, [id, userId]);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Get order items
        const items = await db.all(`
            SELECT oi.*, m.name as medicine_name, m.brand, m.category, m.description
            FROM order_items oi
            JOIN medicines m ON oi.medicine_id = m.id
            WHERE oi.order_id = ?
        `, [id]);
        
        order.items = items;
        
        res.json({ order });
        
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            error: 'Failed to fetch order',
            message: error.message
        });
    }
});

// Create new order
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { 
            pharmacy_id, 
            items, 
            delivery_address, 
            phone, 
            payment_method = 'telebirr' 
        } = req.body;
        
        if (!pharmacy_id || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'Pharmacy ID and items are required'
            });
        }
        
        if (!delivery_address || !phone) {
            return res.status(400).json({
                error: 'Delivery address and phone number are required'
            });
        }
        
        // Validate pharmacy exists
        const pharmacy = await db.get('SELECT id FROM pharmacies WHERE id = ? AND is_active = 1', [pharmacy_id]);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Pharmacy not found' });
        }
        
        // Calculate total amount and validate items
        let totalAmount = 0;
        const validatedItems = [];
        
        for (const item of items) {
            const { medicine_id, quantity } = item;
            
            if (!medicine_id || !quantity || quantity <= 0) {
                return res.status(400).json({
                    error: 'Invalid item: medicine_id and positive quantity required'
                });
            }
            
            // Get medicine price and availability
            const pharmacyMedicine = await db.get(`
                SELECT pm.price, pm.stock_quantity, pm.availability_status, m.name
                FROM pharmacy_medicines pm
                JOIN medicines m ON pm.medicine_id = m.id
                WHERE pm.pharmacy_id = ? AND pm.medicine_id = ?
            `, [pharmacy_id, medicine_id]);
            
            if (!pharmacyMedicine) {
                return res.status(400).json({
                    error: `Medicine not available at selected pharmacy: ${medicine_id}`
                });
            }
            
            if (pharmacyMedicine.availability_status === 'Out of Stock') {
                return res.status(400).json({
                    error: `Medicine out of stock: ${pharmacyMedicine.name}`
                });
            }
            
            if (pharmacyMedicine.stock_quantity < quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${pharmacyMedicine.name}. Available: ${pharmacyMedicine.stock_quantity}`
                });
            }
            
            const itemTotal = pharmacyMedicine.price * quantity;
            totalAmount += itemTotal;
            
            validatedItems.push({
                medicine_id,
                quantity,
                unit_price: pharmacyMedicine.price,
                total_price: itemTotal
            });
        }
        
        // Create order
        const orderResult = await db.run(`
            INSERT INTO orders (user_id, pharmacy_id, total_amount, delivery_address, phone, payment_method)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [userId, pharmacy_id, totalAmount, delivery_address, phone, payment_method]);
        
        const orderId = orderResult.id;
        
        // Create order items
        for (const item of validatedItems) {
            await db.run(`
                INSERT INTO order_items (order_id, medicine_id, quantity, unit_price, total_price)
                VALUES (?, ?, ?, ?, ?)
            `, [orderId, item.medicine_id, item.quantity, item.unit_price, item.total_price]);
            
            // Update stock
            await db.run(`
                UPDATE pharmacy_medicines 
                SET stock_quantity = stock_quantity - ?,
                    availability_status = CASE 
                        WHEN stock_quantity - ? <= 0 THEN 'Out of Stock'
                        WHEN stock_quantity - ? <= 5 THEN 'Limited Stock'
                        ELSE 'In Stock'
                    END
                WHERE pharmacy_id = ? AND medicine_id = ?
            `, [item.quantity, item.quantity, item.quantity, pharmacy_id, item.medicine_id]);
        }
        
        // Get created order with details
        const order = await db.get(`
            SELECT o.*, p.name as pharmacy_name
            FROM orders o
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.id = ?
        `, [orderId]);
        
        res.status(201).json({
            message: 'Order created successfully',
            order,
            items: validatedItems
        });
        
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            error: 'Failed to create order',
            message: error.message
        });
    }
});

// Update order status
router.patch('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payment_status } = req.body;
        const userId = req.user.userId;
        
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
        
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
            });
        }
        
        if (payment_status && !validPaymentStatuses.includes(payment_status)) {
            return res.status(400).json({
                error: 'Invalid payment status. Valid statuses: ' + validPaymentStatuses.join(', ')
            });
        }
        
        // Check if order exists and belongs to user
        const order = await db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Update order
        const updates = [];
        const params = [];
        
        if (status) {
            updates.push('status = ?');
            params.push(status);
        }
        
        if (payment_status) {
            updates.push('payment_status = ?');
            params.push(payment_status);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid updates provided' });
        }
        
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);
        
        await db.run(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
        
        // Get updated order
        const updatedOrder = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
        
        res.json({
            message: 'Order updated successfully',
            order: updatedOrder
        });
        
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            error: 'Failed to update order',
            message: error.message
        });
    }
});

// Cancel order
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        // Check if order exists and belongs to user
        const order = await db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Check if order can be cancelled
        if (['delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                error: 'Cannot cancel order with status: ' + order.status
            });
        }
        
        // Get order items to restore stock
        const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [id]);
        
        // Restore stock for each item
        for (const item of items) {
            await db.run(`
                UPDATE pharmacy_medicines 
                SET stock_quantity = stock_quantity + ?,
                    availability_status = CASE 
                        WHEN stock_quantity + ? > 20 THEN 'In Stock'
                        WHEN stock_quantity + ? > 5 THEN 'Limited Stock'
                        ELSE availability_status
                    END
                WHERE pharmacy_id = ? AND medicine_id = ?
            `, [item.quantity, item.quantity, item.quantity, order.pharmacy_id, item.medicine_id]);
        }
        
        // Update order status to cancelled
        await db.run(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            ['cancelled', id]
        );
        
        res.json({ message: 'Order cancelled successfully' });
        
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            error: 'Failed to cancel order',
            message: error.message
        });
    }
});

// Get order statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const stats = await db.get(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(total_amount) as total_spent,
                AVG(total_amount) as avg_order_value
            FROM orders 
            WHERE user_id = ?
        `, [userId]);
        
        res.json({ statistics: stats });
        
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({
            error: 'Failed to fetch statistics',
            message: error.message
        });
    }
});

module.exports = router;