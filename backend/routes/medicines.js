const express = require('express');
const db = require('../db');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all medicines
router.get('/', async (req, res) => {
    try {
        const { category, search, limit = 50, offset = 0 } = req.query;
        
        let sql = `
            SELECT m.*, 
                   COUNT(pm.id) as pharmacy_count,
                   MIN(pm.price) as min_price,
                   MAX(pm.price) as max_price,
                   AVG(pm.price) as avg_price
            FROM medicines m
            LEFT JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            WHERE m.is_active = 1
        `;
        
        const params = [];
        
        if (category) {
            sql += ' AND m.category = ?';
            params.push(category);
        }
        
        if (search) {
            sql += ' AND (m.name LIKE ? OR m.brand LIKE ? OR m.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        sql += ' GROUP BY m.id ORDER BY m.name LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const medicines = await db.all(sql, params);
        
        res.json({
            medicines,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: medicines.length
            }
        });
        
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({
            error: 'Failed to fetch medicines',
            message: error.message
        });
    }
});

// Get medicine by ID with pharmacy availability
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get medicine details
        const medicine = await db.get(
            'SELECT * FROM medicines WHERE id = ? AND is_active = 1',
            [id]
        );
        
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        
        // Get pharmacy availability
        const pharmacies = await db.all(`
            SELECT p.id, p.name, p.address, p.phone, p.latitude, p.longitude,
                   pm.price, pm.stock_quantity, pm.availability_status,
                   p.rating, p.is_24_hours
            FROM pharmacies p
            JOIN pharmacy_medicines pm ON p.id = pm.pharmacy_id
            WHERE pm.medicine_id = ? AND p.is_active = 1
            ORDER BY pm.price ASC
        `, [id]);
        
        res.json({
            medicine,
            pharmacies
        });
        
    } catch (error) {
        console.error('Error fetching medicine:', error);
        res.status(500).json({
            error: 'Failed to fetch medicine',
            message: error.message
        });
    }
});

// Search medicines with advanced filters
router.post('/search', async (req, res) => {
    try {
        const { 
            query, 
            category, 
            priceRange, 
            requiresPrescription, 
            location,
            sortBy = 'name',
            sortOrder = 'ASC',
            limit = 20,
            offset = 0
        } = req.body;
        
        let sql = `
            SELECT DISTINCT m.*, 
                   MIN(pm.price) as min_price,
                   MAX(pm.price) as max_price,
                   COUNT(DISTINCT pm.pharmacy_id) as pharmacy_count
            FROM medicines m
            LEFT JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            LEFT JOIN pharmacies p ON pm.pharmacy_id = p.id
            WHERE m.is_active = 1
        `;
        
        const params = [];
        
        if (query) {
            sql += ` AND (m.name LIKE ? OR m.brand LIKE ? OR m.description LIKE ? OR m.category LIKE ?)`;
            params.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
        }
        
        if (category) {
            sql += ' AND m.category = ?';
            params.push(category);
        }
        
        if (requiresPrescription !== undefined) {
            sql += ' AND m.requires_prescription = ?';
            params.push(requiresPrescription ? 1 : 0);
        }
        
        if (priceRange && priceRange.min !== undefined) {
            sql += ' AND pm.price >= ?';
            params.push(priceRange.min);
        }
        
        if (priceRange && priceRange.max !== undefined) {
            sql += ' AND pm.price <= ?';
            params.push(priceRange.max);
        }
        
        sql += ' GROUP BY m.id';
        
        // Sorting
        const validSortFields = ['name', 'min_price', 'max_price', 'pharmacy_count', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
            sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        } else {
            sql += ' ORDER BY m.name ASC';
        }
        
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const medicines = await db.all(sql, params);
        
        res.json({
            medicines,
            query: {
                query,
                category,
                priceRange,
                requiresPrescription,
                sortBy,
                sortOrder
            },
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: medicines.length
            }
        });
        
    } catch (error) {
        console.error('Error searching medicines:', error);
        res.status(500).json({
            error: 'Search failed',
            message: error.message
        });
    }
});

// Get medicine categories
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await db.all(`
            SELECT category, COUNT(*) as count
            FROM medicines 
            WHERE is_active = 1 AND category IS NOT NULL
            GROUP BY category
            ORDER BY count DESC, category ASC
        `);
        
        res.json({ categories });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            error: 'Failed to fetch categories',
            message: error.message
        });
    }
});

// Add new medicine (admin only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, brand, category, description, dosage, side_effects, requires_prescription } = req.body;
        
        if (!name || !category) {
            return res.status(400).json({
                error: 'Name and category are required'
            });
        }
        
        const result = await db.run(`
            INSERT INTO medicines (name, brand, category, description, dosage, side_effects, requires_prescription)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [name, brand, category, description, dosage, side_effects, requires_prescription ? 1 : 0]);
        
        const medicine = await db.get('SELECT * FROM medicines WHERE id = ?', [result.id]);
        
        res.status(201).json({
            message: 'Medicine added successfully',
            medicine
        });
        
    } catch (error) {
        console.error('Error adding medicine:', error);
        res.status(500).json({
            error: 'Failed to add medicine',
            message: error.message
        });
    }
});

module.exports = router;