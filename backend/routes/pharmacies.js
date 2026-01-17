const express = require('express');
const db = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all pharmacies
router.get('/', async (req, res) => {
    try {
        const { lat, lng, radius = 10, limit = 50, offset = 0 } = req.query;
        
        let sql = `
            SELECT p.*, 
                   COUNT(DISTINCT pm.medicine_id) as medicine_count,
                   AVG(r.rating) as avg_rating,
                   COUNT(DISTINCT r.id) as review_count
            FROM pharmacies p
            LEFT JOIN pharmacy_medicines pm ON p.id = pm.pharmacy_id
            LEFT JOIN reviews r ON p.id = r.pharmacy_id
            WHERE p.is_active = 1
        `;
        
        const params = [];
        
        // Add distance calculation if coordinates provided
        if (lat && lng) {
            sql = `
                SELECT p.*, 
                       COUNT(DISTINCT pm.medicine_id) as medicine_count,
                       AVG(r.rating) as avg_rating,
                       COUNT(DISTINCT r.id) as review_count,
                       (6371 * acos(cos(radians(?)) * cos(radians(p.latitude)) * 
                       cos(radians(p.longitude) - radians(?)) + sin(radians(?)) * 
                       sin(radians(p.latitude)))) AS distance
                FROM pharmacies p
                LEFT JOIN pharmacy_medicines pm ON p.id = pm.pharmacy_id
                LEFT JOIN reviews r ON p.id = r.pharmacy_id
                WHERE p.is_active = 1
            `;
            params.push(parseFloat(lat), parseFloat(lng), parseFloat(lat));
            
            if (radius) {
                sql += ' HAVING distance <= ?';
                params.push(parseFloat(radius));
            }
        }
        
        sql += ' GROUP BY p.id';
        
        if (lat && lng) {
            sql += ' ORDER BY distance ASC';
        } else {
            sql += ' ORDER BY p.name ASC';
        }
        
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const pharmacies = await db.all(sql, params);
        
        // Parse opening hours JSON
        pharmacies.forEach(pharmacy => {
            if (pharmacy.opening_hours) {
                try {
                    pharmacy.opening_hours = JSON.parse(pharmacy.opening_hours);
                } catch (e) {
                    pharmacy.opening_hours = null;
                }
            }
        });
        
        res.json({
            pharmacies,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: pharmacies.length
            }
        });
        
    } catch (error) {
        console.error('Error fetching pharmacies:', error);
        res.status(500).json({
            error: 'Failed to fetch pharmacies',
            message: error.message
        });
    }
});

// Get pharmacy by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const pharmacy = await db.get(`
            SELECT p.*, 
                   COUNT(DISTINCT pm.medicine_id) as medicine_count,
                   AVG(r.rating) as avg_rating,
                   COUNT(DISTINCT r.id) as review_count
            FROM pharmacies p
            LEFT JOIN pharmacy_medicines pm ON p.id = pm.pharmacy_id
            LEFT JOIN reviews r ON p.id = r.pharmacy_id
            WHERE p.id = ? AND p.is_active = 1
            GROUP BY p.id
        `, [id]);
        
        if (!pharmacy) {
            return res.status(404).json({ error: 'Pharmacy not found' });
        }
        
        // Parse opening hours
        if (pharmacy.opening_hours) {
            try {
                pharmacy.opening_hours = JSON.parse(pharmacy.opening_hours);
            } catch (e) {
                pharmacy.opening_hours = null;
            }
        }
        
        // Get medicines available at this pharmacy
        const medicines = await db.all(`
            SELECT m.*, pm.price, pm.stock_quantity, pm.availability_status
            FROM medicines m
            JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            WHERE pm.pharmacy_id = ? AND m.is_active = 1
            ORDER BY m.name ASC
        `, [id]);
        
        // Get recent reviews
        const reviews = await db.all(`
            SELECT r.*, u.username
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.pharmacy_id = ?
            ORDER BY r.created_at DESC
            LIMIT 10
        `, [id]);
        
        res.json({
            pharmacy,
            medicines,
            reviews
        });
        
    } catch (error) {
        console.error('Error fetching pharmacy:', error);
        res.status(500).json({
            error: 'Failed to fetch pharmacy',
            message: error.message
        });
    }
});

// Search pharmacies
router.post('/search', async (req, res) => {
    try {
        const { 
            query, 
            location, 
            services, 
            is24Hours, 
            minRating,
            sortBy = 'name',
            sortOrder = 'ASC',
            limit = 20,
            offset = 0
        } = req.body;
        
        let sql = `
            SELECT p.*, 
                   COUNT(DISTINCT pm.medicine_id) as medicine_count,
                   AVG(r.rating) as avg_rating,
                   COUNT(DISTINCT r.id) as review_count
            FROM pharmacies p
            LEFT JOIN pharmacy_medicines pm ON p.id = pm.pharmacy_id
            LEFT JOIN reviews r ON p.id = r.pharmacy_id
            WHERE p.is_active = 1
        `;
        
        const params = [];
        
        if (query) {
            sql += ' AND (p.name LIKE ? OR p.address LIKE ?)';
            params.push(`%${query}%`, `%${query}%`);
        }
        
        if (is24Hours !== undefined) {
            sql += ' AND p.is_24_hours = ?';
            params.push(is24Hours ? 1 : 0);
        }
        
        sql += ' GROUP BY p.id';
        
        if (minRating) {
            sql += ' HAVING avg_rating >= ?';
            params.push(parseFloat(minRating));
        }
        
        // Sorting
        const validSortFields = ['name', 'rating', 'medicine_count', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
            if (sortBy === 'rating') {
                sql += ` ORDER BY avg_rating ${sortOrder.toUpperCase()}`;
            } else {
                sql += ` ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;
            }
        } else {
            sql += ' ORDER BY p.name ASC';
        }
        
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const pharmacies = await db.all(sql, params);
        
        // Parse opening hours
        pharmacies.forEach(pharmacy => {
            if (pharmacy.opening_hours) {
                try {
                    pharmacy.opening_hours = JSON.parse(pharmacy.opening_hours);
                } catch (e) {
                    pharmacy.opening_hours = null;
                }
            }
        });
        
        res.json({
            pharmacies,
            query: req.body,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: pharmacies.length
            }
        });
        
    } catch (error) {
        console.error('Error searching pharmacies:', error);
        res.status(500).json({
            error: 'Search failed',
            message: error.message
        });
    }
});

// Add review for pharmacy
router.post('/:id/reviews', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userId;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                error: 'Rating must be between 1 and 5'
            });
        }
        
        // Check if pharmacy exists
        const pharmacy = await db.get('SELECT id FROM pharmacies WHERE id = ? AND is_active = 1', [id]);
        if (!pharmacy) {
            return res.status(404).json({ error: 'Pharmacy not found' });
        }
        
        // Check if user already reviewed this pharmacy
        const existingReview = await db.get(
            'SELECT id FROM reviews WHERE user_id = ? AND pharmacy_id = ?',
            [userId, id]
        );
        
        if (existingReview) {
            // Update existing review
            await db.run(
                'UPDATE reviews SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?',
                [rating, comment, existingReview.id]
            );
            
            res.json({ message: 'Review updated successfully' });
        } else {
            // Create new review
            const result = await db.run(
                'INSERT INTO reviews (user_id, pharmacy_id, rating, comment) VALUES (?, ?, ?, ?)',
                [userId, id, rating, comment]
            );
            
            res.status(201).json({
                message: 'Review added successfully',
                reviewId: result.id
            });
        }
        
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            error: 'Failed to add review',
            message: error.message
        });
    }
});

// Get pharmacy reviews
router.get('/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 20, offset = 0 } = req.query;
        
        const reviews = await db.all(`
            SELECT r.*, u.username, u.email
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.pharmacy_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [id, parseInt(limit), parseInt(offset)]);
        
        const totalReviews = await db.get(
            'SELECT COUNT(*) as count FROM reviews WHERE pharmacy_id = ?',
            [id]
        );
        
        const avgRating = await db.get(
            'SELECT AVG(rating) as avg_rating FROM reviews WHERE pharmacy_id = ?',
            [id]
        );
        
        res.json({
            reviews,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: totalReviews.count
            },
            statistics: {
                averageRating: avgRating.avg_rating || 0,
                totalReviews: totalReviews.count
            }
        });
        
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            error: 'Failed to fetch reviews',
            message: error.message
        });
    }
});

module.exports = router;