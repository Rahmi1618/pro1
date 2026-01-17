const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, 'pharmacare.db');
    }

    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                } else {
                    console.log('📊 Connected to SQLite database');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const tables = [
            // Users table
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )`,

            // Pharmacies table
            `CREATE TABLE IF NOT EXISTS pharmacies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                address TEXT NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(100),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                opening_hours TEXT,
                is_24_hours BOOLEAN DEFAULT 0,
                rating DECIMAL(3, 2) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )`,

            // Medicines table
            `CREATE TABLE IF NOT EXISTS medicines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                brand VARCHAR(100),
                category VARCHAR(50),
                description TEXT,
                dosage VARCHAR(50),
                side_effects TEXT,
                requires_prescription BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )`,

            // Pharmacy medicines (inventory)
            `CREATE TABLE IF NOT EXISTS pharmacy_medicines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pharmacy_id INTEGER NOT NULL,
                medicine_id INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock_quantity INTEGER DEFAULT 0,
                availability_status VARCHAR(20) DEFAULT 'In Stock',
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id),
                FOREIGN KEY (medicine_id) REFERENCES medicines (id),
                UNIQUE(pharmacy_id, medicine_id)
            )`,

            // Orders table
            `CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                pharmacy_id INTEGER NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                delivery_address TEXT,
                phone VARCHAR(20),
                payment_method VARCHAR(20) DEFAULT 'telebirr',
                payment_status VARCHAR(20) DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id)
            )`,

            // Order items table
            `CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                medicine_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price DECIMAL(10, 2) NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (medicine_id) REFERENCES medicines (id)
            )`,

            // Reviews table
            `CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                pharmacy_id INTEGER NOT NULL,
                rating INTEGER CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (pharmacy_id) REFERENCES pharmacies (id)
            )`
        ];

        for (const table of tables) {
            await this.run(table);
        }

        console.log('✅ Database tables created successfully');
        await this.seedData();
    }

    async seedData() {
        // Check if data already exists
        const userCount = await this.get('SELECT COUNT(*) as count FROM users');
        if (userCount.count > 0) {
            console.log('📊 Database already seeded');
            return;
        }

        console.log('🌱 Seeding database with sample data...');

        // Seed users
        const hashedPassword = await bcrypt.hash('password123', 10);
        await this.run(`INSERT INTO users (username, email, password_hash, phone, address) VALUES 
            ('john_doe', 'john@example.com', ?, '+251911234567', 'Kombolcha, Ethiopia'),
            ('jane_smith', 'jane@example.com', ?, '+251911234568', 'Dessie, Ethiopia'),
            ('admin', 'admin@pharmacare.et', ?, '+251911234569', 'Addis Ababa, Ethiopia')
        `, [hashedPassword, hashedPassword, hashedPassword]);

        // Seed pharmacies
        await this.run(`INSERT INTO pharmacies (name, address, phone, email, latitude, longitude, opening_hours, is_24_hours, rating) VALUES 
            ('Kombolcha Central Pharmacy', 'Main Street, Near Hospital, Kombolcha', '+251911234567', 'info@kombolichacentral.com', 11.0815, 39.7267, '{"monday":"7:00-22:00","tuesday":"7:00-22:00","wednesday":"7:00-22:00","thursday":"7:00-22:00","friday":"7:00-22:00","saturday":"8:00-21:00","sunday":"9:00-20:00"}', 1, 4.8),
            ('Dessie Road Pharmacy', 'Dessie Road, Near Bus Station, Kombolcha', '+251911234568', 'contact@dessieroadpharmacy.com', 11.0845, 39.7298, '{"monday":"6:30-23:00","tuesday":"6:30-23:00","wednesday":"6:30-23:00","thursday":"6:30-23:00","friday":"6:30-23:00","saturday":"7:00-22:00","sunday":"8:00-21:00"}', 0, 4.6),
            ('Wollo University Pharmacy', 'University Campus, KIT, Kombolcha', '+251911234569', 'pharmacy@wku.edu.et', 11.0789, 39.7234, '{"monday":"8:00-18:00","tuesday":"8:00-18:00","wednesday":"8:00-18:00","thursday":"8:00-18:00","friday":"8:00-18:00","saturday":"9:00-16:00","sunday":"closed"}', 0, 4.7),
            ('Bati Road Health Pharmacy', 'Bati Road, Near Health Center, Kombolcha', '+251911234570', 'info@batiroadhealth.com', 11.0798, 39.7301, '{"monday":"7:00-21:00","tuesday":"7:00-21:00","wednesday":"7:00-21:00","thursday":"7:00-21:00","friday":"7:00-21:00","saturday":"8:00-20:00","sunday":"9:00-19:00"}', 0, 4.4),
            ('Kombolcha Express Pharmacy', 'Commercial District, Market Area, Kombolcha', '+251911234571', 'express@kombolichaexpress.com', 11.0832, 39.7289, '{"monday":"6:00-23:00","tuesday":"6:00-23:00","wednesday":"6:00-23:00","thursday":"6:00-23:00","friday":"6:00-23:00","saturday":"6:00-23:00","sunday":"7:00-22:00"}', 1, 4.5),
            ('Family Care Pharmacy', 'Residential Area, Near Primary School, Kombolcha', '+251911234572', 'care@familycarepharmacy.com', 11.0801, 39.7245, '{"monday":"8:00-20:00","tuesday":"8:00-20:00","wednesday":"8:00-20:00","thursday":"8:00-20:00","friday":"8:00-20:00","saturday":"9:00-19:00","sunday":"10:00-18:00"}', 0, 4.3)
        `);

        // Seed medicines
        await this.run(`INSERT INTO medicines (name, brand, category, description, dosage, side_effects, requires_prescription) VALUES 
            ('Paracetamol 500mg', 'Panadol', 'Pain Relief', 'Effective pain relief and fever reducer', '500mg-1000mg every 4-6 hours', 'Generally safe when used as directed', 0),
            ('Ibuprofen 400mg', 'Advil', 'Anti-inflammatory', 'Non-steroidal anti-inflammatory drug', '200mg-400mg every 4-6 hours', 'May cause stomach upset', 0),
            ('Amoxicillin 250mg', 'Amoxil', 'Antibiotic', 'Broad-spectrum antibiotic for bacterial infections', 'As prescribed by doctor', 'May cause allergic reactions', 1),
            ('Omeprazole 20mg', 'Losec', 'Acid Reducer', 'Proton pump inhibitor for acid reflux', '20mg once daily', 'Headache, nausea', 0),
            ('Metformin 500mg', 'Glucophage', 'Diabetes', 'Type 2 diabetes medication', '500mg twice daily with meals', 'Nausea, diarrhea', 1),
            ('Amlodipine 5mg', 'Norvasc', 'Blood Pressure', 'Calcium channel blocker for hypertension', '5mg once daily', 'Swelling, dizziness', 1),
            ('Cetirizine 10mg', 'Zyrtec', 'Antihistamine', 'Allergy relief medication', '10mg once daily', 'Drowsiness', 0),
            ('Aspirin 100mg', 'Cardio Aspirin', 'Blood Thinner', 'Low-dose aspirin for heart protection', '100mg once daily', 'Stomach irritation', 0)
        `);

        // Seed pharmacy medicines (inventory)
        const pharmacies = await this.all('SELECT id FROM pharmacies');
        const medicines = await this.all('SELECT id FROM medicines');
        
        for (const pharmacy of pharmacies) {
            for (const medicine of medicines) {
                const price = (Math.random() * 50 + 10).toFixed(2); // Random price between 10-60 ETB
                const stock = Math.floor(Math.random() * 100) + 10; // Random stock 10-110
                const availability = stock > 20 ? 'In Stock' : stock > 5 ? 'Limited Stock' : 'Out of Stock';
                
                await this.run(`INSERT INTO pharmacy_medicines (pharmacy_id, medicine_id, price, stock_quantity, availability_status) VALUES (?, ?, ?, ?, ?)`,
                    [pharmacy.id, medicine.id, price, stock, availability]);
            }
        }

        console.log('✅ Database seeded successfully');
    }

    // Helper methods
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

const database = new Database();
module.exports = database;