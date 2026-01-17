<?php
/**
 * Medicines API for PharmaCare
 * Handles medicine search and information
 */

require_once 'config.php';
setCorsHeaders();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDB();
    
    if ($action === 'search' && $method === 'GET') {
        // Search medicines
        $query = $_GET['q'] ?? '';
        $category = $_GET['category'] ?? '';
        $limit = min((int)($_GET['limit'] ?? 20), 50);
        
        $sql = "
            SELECT 
                m.*,
                GROUP_CONCAT(
                    CONCAT(p.name, '|', pm.price, '|', pm.availability, '|', p.id)
                    SEPARATOR ';'
                ) as pharmacies_data
            FROM medicines m
            LEFT JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            LEFT JOIN pharmacies p ON pm.pharmacy_id = p.id
            WHERE 1=1
        ";
        
        $params = [];
        
        if (!empty($query)) {
            $sql .= " AND (m.name LIKE ? OR m.brand LIKE ? OR m.category LIKE ?)";
            $searchTerm = "%$query%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        if (!empty($category)) {
            $sql .= " AND m.category = ?";
            $params[] = $category;
        }
        
        $sql .= " GROUP BY m.id ORDER BY m.name LIMIT ?";
        $params[] = $limit;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $medicines = $stmt->fetchAll();
        
        // Process pharmacy data
        foreach ($medicines as &$medicine) {
            $medicine['pharmacies'] = [];
            if ($medicine['pharmacies_data']) {
                $pharmacyEntries = explode(';', $medicine['pharmacies_data']);
                foreach ($pharmacyEntries as $entry) {
                    $parts = explode('|', $entry);
                    if (count($parts) === 4) {
                        $medicine['pharmacies'][] = [
                            'id' => (int)$parts[3],
                            'name' => $parts[0],
                            'price' => (float)$parts[1],
                            'availability' => $parts[2]
                        ];
                    }
                }
            }
            unset($medicine['pharmacies_data']);
        }
        
        sendSuccess($medicines);
        
    } elseif ($action === 'compare' && $method === 'GET') {
        // Compare prices for a specific medicine
        $medicineId = (int)($_GET['medicine_id'] ?? 0);
        
        if (!$medicineId) {
            sendError('Medicine ID is required');
        }
        
        $stmt = $pdo->prepare("
            SELECT 
                m.*,
                p.id as pharmacy_id,
                p.name as pharmacy_name,
                p.address as pharmacy_address,
                p.phone as pharmacy_phone,
                p.rating as pharmacy_rating,
                pm.price,
                pm.stock_quantity,
                pm.availability
            FROM medicines m
            JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            JOIN pharmacies p ON pm.pharmacy_id = p.id
            WHERE m.id = ?
            ORDER BY pm.price ASC
        ");
        
        $stmt->execute([$medicineId]);
        $results = $stmt->fetchAll();
        
        if (empty($results)) {
            sendError('Medicine not found');
        }
        
        $medicine = [
            'id' => $results[0]['id'],
            'name' => $results[0]['name'],
            'brand' => $results[0]['brand'],
            'category' => $results[0]['category'],
            'description' => $results[0]['description'],
            'requires_prescription' => (bool)$results[0]['requires_prescription'],
            'pharmacies' => []
        ];
        
        foreach ($results as $row) {
            $medicine['pharmacies'][] = [
                'id' => (int)$row['pharmacy_id'],
                'name' => $row['pharmacy_name'],
                'address' => $row['pharmacy_address'],
                'phone' => $row['pharmacy_phone'],
                'rating' => (float)$row['pharmacy_rating'],
                'price' => (float)$row['price'],
                'stock_quantity' => (int)$row['stock_quantity'],
                'availability' => $row['availability']
            ];
        }
        
        sendSuccess($medicine);
        
    } elseif ($action === 'categories' && $method === 'GET') {
        // Get medicine categories
        $stmt = $pdo->prepare("SELECT DISTINCT category FROM medicines WHERE category IS NOT NULL ORDER BY category");
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        sendSuccess($categories);
        
    } else {
        sendError('Invalid action or method');
    }
    
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
?>