const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const user = await db.get(`
            SELECT id, username, email, phone, address, created_at, updated_at
            FROM users 
            WHERE id = ? AND is_active = 1
        `, [userId]);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get user statistics
        const stats = await db.get(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
                SUM(total_amount) as total_spent
            FROM orders 
            WHERE user_id = ?
        `, [userId]);
        
        res.json({
            user,
            statistics: stats
        });
        
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            error: 'Failed to fetch profile',
            message: error.message
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email, phone, address } = req.body;
        
        // Validate required fields
        if (!username || !email) {
            return res.status(400).json({
                error: 'Username and email are required'
            });
        }
        
        // Check if username or email already exists (excluding current user)
        const existingUser = await db.get(`
            SELECT id FROM users 
            WHERE (username = ? OR email = ?) AND id != ? AND is_active = 1
        `, [username, email, userId]);
        
        if (existingUser) {
            return res.status(409).json({
                error: 'Username or email already exists'
            });
        }
        
        // Update user
        await db.run(`
            UPDATE users 
            SET username = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [username, email, phone, address, userId]);
        
        // Get updated user
        const updatedUser = await db.get(`
            SELECT id, username, email, phone, address, created_at, updated_at
            FROM users 
            WHERE id = ?
        `, [userId]);
        
        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
        
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            error: 'Failed to update profile',
            message: error.message
        });
    }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Current password and new password are required'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'New password must be at least 6 characters long'
            });
        }
        
        // Get current user
        const user = await db.get('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await db.run(`
            UPDATE users 
            SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [newPasswordHash, userId]);
        
        res.json({ message: 'Password changed successfully' });
        
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            error: 'Failed to change password',
            message: error.message
        });
    }
});

// Get user order history
router.get('/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 10, offset = 0, status } = req.query;
        
        let sql = `
            SELECT o.*, p.name as pharmacy_name, p.address as pharmacy_address
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
        
        res.json({
            orders,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: orders.length
            }
        });
        
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            error: 'Failed to fetch orders',
            message: error.message
        });
    }
});

// Get user reviews
router.get('/reviews', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 10, offset = 0 } = req.query;
        
        const reviews = await db.all(`
            SELECT r.*, p.name as pharmacy_name, p.address as pharmacy_address
            FROM reviews r
            JOIN pharmacies p ON r.pharmacy_id = p.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [userId, parseInt(limit), parseInt(offset)]);
        
        res.json({
            reviews,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: reviews.length
            }
        });
        
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            error: 'Failed to fetch reviews',
            message: error.message
        });
    }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({
                error: 'Password is required to delete account'
            });
        }
        
        // Get user and verify password
        const user = await db.get('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        
        // Check for pending orders
        const pendingOrders = await db.get(`
            SELECT COUNT(*) as count 
            FROM orders 
            WHERE user_id = ? AND status IN ('pending', 'confirmed', 'preparing', 'ready')
        `, [userId]);
        
        if (pendingOrders.count > 0) {
            return res.status(400).json({
                error: 'Cannot delete account with pending orders. Please complete or cancel all orders first.'
            });
        }
        
        // Soft delete user (set is_active to 0)
        await db.run(`
            UPDATE users 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [userId]);
        
        res.json({ message: 'Account deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({
            error: 'Failed to delete account',
            message: error.message
        });
    }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get recent orders
        const recentOrders = await db.all(`
            SELECT o.*, p.name as pharmacy_name
            FROM orders o
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
            LIMIT 5
        `, [userId]);
        
        // Get order statistics
        const orderStats = await db.get(`
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                SUM(CASE WHEN status IN ('pending', 'confirmed', 'preparing', 'ready') THEN 1 ELSE 0 END) as active_orders,
                SUM(total_amount) as total_spent,
                AVG(total_amount) as avg_order_value
            FROM orders 
            WHERE user_id = ?
        `, [userId]);
        
        // Get favorite pharmacies (most ordered from)
        const favoritePharmacies = await db.all(`
            SELECT p.*, COUNT(o.id) as order_count
            FROM pharmacies p
            JOIN orders o ON p.id = o.pharmacy_id
            WHERE o.user_id = ?
            GROUP BY p.id
            ORDER BY order_count DESC
            LIMIT 3
        `, [userId]);
        
        res.json({
            recentOrders,
            statistics: orderStats,
            favoritePharmacies
        });
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard data',
            message: error.message
        });
    }
});

module.exports = router;