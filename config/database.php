<?php
// Database configuration
class Database {
    private $host = 'localhost';
    private $db_name = 'pharmacare_db';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

// Create database tables if they don't exist
function createTables() {
    $database = new Database();
    $db = $database->getConnection();
    
    // Users table
    $query = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $db->exec($query);
    
    // Pharmacies table
    $query = "CREATE TABLE IF NOT EXISTS pharmacies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($query);
    
    // Medicines table
    $query = "CREATE TABLE IF NOT EXISTS medicines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        brand VARCHAR(100),
        category VARCHAR(50),
        description TEXT,
        active_ingredient VARCHAR(100),
        dosage VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($query);
    
    // Pharmacy medicines (inventory)
    $query = "CREATE TABLE IF NOT EXISTS pharmacy_medicines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pharmacy_id INT,
        medicine_id INT,
        price DECIMAL(10, 2),
        stock_quantity INT DEFAULT 0,
        availability_status ENUM('In Stock', 'Limited Stock', 'Out of Stock') DEFAULT 'In Stock',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id),
        FOREIGN KEY (medicine_id) REFERENCES medicines(id)
    )";
    $db->exec($query);
    
    // Orders table
    $query = "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        pharmacy_id INT,
        medicine_id INT,
        quantity INT DEFAULT 1,
        total_price DECIMAL(10, 2),
        status ENUM('Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled') DEFAULT 'Pending',
        payment_method VARCHAR(50),
        payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
        delivery_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id),
        FOREIGN KEY (medicine_id) REFERENCES medicines(id)
    )";
    $db->exec($query);
    
    // User searches (for AI learning)
    $query = "CREATE TABLE IF NOT EXISTS user_searches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        search_query VARCHAR(255),
        results_count INT,
        clicked_medicine_id INT,
        search_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (clicked_medicine_id) REFERENCES medicines(id)
    )";
    $db->exec($query);
    
    insertSampleData($db);
}

function insertSampleData($db) {
    // Insert sample pharmacies
    $query = "INSERT IGNORE INTO pharmacies (id, name, address, phone, latitude, longitude) VALUES
        (1, 'City Pharmacy', '123 Main Street, Addis Ababa', '+251911234567', 9.0320, 38.7469),
        (2, 'Health Plus', '456 Bole Road, Addis Ababa', '+251911234568', 9.0120, 38.7569),
        (3, 'MedCare', '789 Piazza, Addis Ababa', '+251911234569', 9.0420, 38.7369),
        (4, 'Wellness Pharmacy', '321 Merkato, Addis Ababa', '+251911234570', 9.0220, 38.7669)";
    $db->exec($query);
    
    // Insert sample medicines
    $query = "INSERT IGNORE INTO medicines (id, name, brand, category, description, active_ingredient, dosage) VALUES
        (1, 'Paracetamol 500mg', 'Panadol', 'Pain Relief', 'Effective pain relief and fever reducer', 'Paracetamol', '500mg'),
        (2, 'Amoxicillin 250mg', 'Amoxil', 'Antibiotic', 'Broad-spectrum antibiotic for bacterial infections', 'Amoxicillin', '250mg'),
        (3, 'Ibuprofen 400mg', 'Advil', 'Anti-inflammatory', 'Non-steroidal anti-inflammatory drug', 'Ibuprofen', '400mg'),
        (4, 'Aspirin 100mg', 'Aspirin', 'Pain Relief', 'Low-dose aspirin for heart health', 'Acetylsalicylic Acid', '100mg'),
        (5, 'Omeprazole 20mg', 'Losec', 'Antacid', 'Proton pump inhibitor for acid reflux', 'Omeprazole', '20mg')";
    $db->exec($query);
    
    // Insert sample inventory
    $query = "INSERT IGNORE INTO pharmacy_medicines (pharmacy_id, medicine_id, price, stock_quantity, availability_status) VALUES
        (1, 1, 25.50, 100, 'In Stock'),
        (2, 1, 23.00, 50, 'In Stock'),
        (3, 1, 27.00, 10, 'Limited Stock'),
        (1, 2, 45.00, 30, 'In Stock'),
        (2, 2, 42.50, 0, 'Out of Stock'),
        (4, 2, 48.00, 25, 'In Stock'),
        (2, 3, 32.00, 40, 'In Stock'),
        (3, 3, 35.50, 60, 'In Stock'),
        (4, 3, 30.00, 80, 'In Stock')";
    $db->exec($query);
}

// Initialize database
createTables();
?>