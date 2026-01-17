<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$database = new Database();
$db = $database->getConnection();

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'search':
        searchMedicines($db, $_GET);
        break;
    case 'compare':
        comparePrices($db, $_GET);
        break;
    case 'recommend':
        getRecommendations($db, $_GET);
        break;
    default:
        getAllMedicines($db);
}

function searchMedicines($db, $params) {
    $query = $params['q'] ?? '';
    $userId = $params['user_id'] ?? null;
    
    if (empty($query)) {
        echo json_encode(['success' => false, 'message' => 'Search query is required']);
        return;
    }
    
    try {
        // Log search for AI learning
        if ($userId) {
            logSearch($db, $userId, $query);
        }
        
        $searchQuery = "
            SELECT DISTINCT 
                m.id, m.name, m.brand, m.category, m.description, m.active_ingredient, m.dosage,
                COUNT(pm.id) as pharmacy_count,
                MIN(pm.price) as min_price,
                MAX(pm.price) as max_price
            FROM medicines m
            LEFT JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            WHERE (m.name LIKE :query OR m.brand LIKE :query OR m.category LIKE :query OR m.active_ingredient LIKE :query)
            AND pm.availability_status != 'Out of Stock'
            GROUP BY m.id
            ORDER BY 
                CASE 
                    WHEN m.name LIKE :exact_query THEN 1
                    WHEN m.brand LIKE :exact_query THEN 2
                    ELSE 3
                END,
                m.name
        ";
        
        $stmt = $db->prepare($searchQuery);
        $likeQuery = '%' . $query . '%';
        $exactQuery = $query . '%';
        $stmt->bindParam(':query', $likeQuery);
        $stmt->bindParam(':exact_query', $exactQuery);
        $stmt->execute();
        
        $medicines = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get pharmacy details for each medicine
        foreach ($medicines as &$medicine) {
            $medicine['pharmacies'] = getPharmaciesForMedicine($db, $medicine['id']);
        }
        
        echo json_encode([
            'success' => true,
            'data' => $medicines,
            'count' => count($medicines)
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Search failed: ' . $e->getMessage()]);
    }
}

function getPharmaciesForMedicine($db, $medicineId) {
    $query = "
        SELECT 
            p.id, p.name, p.address, p.phone, p.latitude, p.longitude,
            pm.price, pm.stock_quantity, pm.availability_status,
            ROUND(
                6371 * acos(
                    cos(radians(9.0320)) * cos(radians(p.latitude)) * 
                    cos(radians(p.longitude) - radians(38.7469)) + 
                    sin(radians(9.0320)) * sin(radians(p.latitude))
                ), 2
            ) AS distance
        FROM pharmacies p
        JOIN pharmacy_medicines pm ON p.id = pm.pharmacy_id
        WHERE pm.medicine_id = :medicine_id AND p.is_active = 1
        ORDER BY pm.price ASC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':medicine_id', $medicineId);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function comparePrices($db, $params) {
    $medicineId = $params['medicine_id'] ?? '';
    
    if (empty($medicineId)) {
        echo json_encode(['success' => false, 'message' => 'Medicine ID is required']);
        return;
    }
    
    try {
        // Get medicine details
        $query = "SELECT * FROM medicines WHERE id = :medicine_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':medicine_id', $medicineId);
        $stmt->execute();
        $medicine = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$medicine) {
            echo json_encode(['success' => false, 'message' => 'Medicine not found']);
            return;
        }
        
        // Get pharmacy prices
        $pharmacies = getPharmaciesForMedicine($db, $medicineId);
        
        echo json_encode([
            'success' => true,
            'medicine' => $medicine,
            'pharmacies' => $pharmacies
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Price comparison failed: ' . $e->getMessage()]);
    }
}

function getRecommendations($db, $params) {
    $medicineId = $params['medicine_id'] ?? '';
    $userId = $params['user_id'] ?? null;
    
    try {
        $recommendations = [];
        
        // Best value recommendation
        $pharmacies = getPharmaciesForMedicine($db, $medicineId);
        if (!empty($pharmacies)) {
            $bestPharmacy = $pharmacies[0]; // Already sorted by price
            
            $recommendations[] = [
                'type' => 'Best Value',
                'title' => 'Recommended Pharmacy',
                'description' => 'Based on price, distance, and availability analysis',
                'pharmacy' => $bestPharmacy,
                'confidence' => 0.95,
                'savings' => calculateSavings($pharmacies, $bestPharmacy['price'])
            ];
        }
        
        // Alternative medicine recommendation
        $alternatives = getAlternativeMedicines($db, $medicineId);
        if (!empty($alternatives)) {
            $recommendations[] = [
                'type' => 'Alternative',
                'title' => 'Similar Medicine Available',
                'description' => 'Generic alternative with same active ingredient at lower cost',
                'alternatives' => $alternatives,
                'confidence' => 0.85
            ];
        }
        
        // Personalized recommendation based on user history
        if ($userId) {
            $personalizedRec = getPersonalizedRecommendation($db, $userId, $medicineId);
            if ($personalizedRec) {
                $recommendations[] = $personalizedRec;
            }
        }
        
        echo json_encode([
            'success' => true,
            'recommendations' => $recommendations
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Recommendation failed: ' . $e->getMessage()]);
    }
}

function getAlternativeMedicines($db, $medicineId) {
    $query = "
        SELECT m2.*, MIN(pm.price) as min_price
        FROM medicines m1
        JOIN medicines m2 ON m1.active_ingredient = m2.active_ingredient AND m1.id != m2.id
        JOIN pharmacy_medicines pm ON m2.id = pm.medicine_id
        WHERE m1.id = :medicine_id AND pm.availability_status = 'In Stock'
        GROUP BY m2.id
        ORDER BY min_price ASC
        LIMIT 3
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':medicine_id', $medicineId);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getPersonalizedRecommendation($db, $userId, $medicineId) {
    // Get user's previous orders to understand preferences
    $query = "
        SELECT p.id, p.name, COUNT(*) as order_count
        FROM orders o
        JOIN pharmacies p ON o.pharmacy_id = p.id
        WHERE o.user_id = :user_id AND o.status = 'Delivered'
        GROUP BY p.id
        ORDER BY order_count DESC
        LIMIT 1
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $preferredPharmacy = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($preferredPharmacy) {
        // Check if preferred pharmacy has this medicine
        $query = "
            SELECT pm.*, p.name as pharmacy_name
            FROM pharmacy_medicines pm
            JOIN pharmacies p ON pm.pharmacy_id = p.id
            WHERE pm.medicine_id = :medicine_id AND pm.pharmacy_id = :pharmacy_id
            AND pm.availability_status != 'Out of Stock'
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':medicine_id', $medicineId);
        $stmt->bindParam(':pharmacy_id', $preferredPharmacy['id']);
        $stmt->execute();
        
        $pharmacyMedicine = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($pharmacyMedicine) {
            return [
                'type' => 'Personalized',
                'title' => 'Your Preferred Pharmacy',
                'description' => 'Based on your order history with ' . $preferredPharmacy['name'],
                'pharmacy' => $pharmacyMedicine,
                'confidence' => 0.90,
                'reason' => 'You have ordered from this pharmacy ' . $preferredPharmacy['order_count'] . ' times'
            ];
        }
    }
    
    return null;
}

function calculateSavings($pharmacies, $bestPrice) {
    if (count($pharmacies) < 2) return 0;
    
    $maxPrice = max(array_column($pharmacies, 'price'));
    return round((($maxPrice - $bestPrice) / $maxPrice) * 100, 1);
}

function logSearch($db, $userId, $query) {
    try {
        $logQuery = "INSERT INTO user_searches (user_id, search_query, search_timestamp) VALUES (:user_id, :query, NOW())";
        $stmt = $db->prepare($logQuery);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':query', $query);
        $stmt->execute();
    } catch (Exception $e) {
        // Log error but don't fail the search
        error_log("Failed to log search: " . $e->getMessage());
    }
}

function getAllMedicines($db) {
    try {
        $query = "
            SELECT DISTINCT 
                m.id, m.name, m.brand, m.category, m.description,
                COUNT(pm.id) as pharmacy_count,
                MIN(pm.price) as min_price
            FROM medicines m
            LEFT JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            WHERE pm.availability_status != 'Out of Stock'
            GROUP BY m.id
            ORDER BY m.name
        ";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $medicines = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $medicines
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch medicines: ' . $e->getMessage()]);
    }
}
?>