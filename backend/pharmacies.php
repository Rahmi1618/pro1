<?php
/**
 * Pharmacies API for PharmaCare
 * Handles pharmacy listings and information
 */

require_once 'config.php';
setCorsHeaders();

$action = $_GET['action'] ?? 'list';
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDB();
    
    if ($action === 'list' && $method === 'GET') {
        // Get pharmacy list
        $search = $_GET['search'] ?? '';
        $limit = min((int)($_GET['limit'] ?? 20), 50);
        $lat = (float)($_GET['lat'] ?? 11.0815); // Default to Kombolcha
        $lng = (float)($_GET['lng'] ?? 39.7267);
        
        $sql = "
            SELECT 
                *,
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
                sin(radians(latitude)))) AS distance
            FROM pharmacies
            WHERE 1=1
        ";
        
        $params = [$lat, $lng, $lat];
        
        if (!empty($search)) {
            $sql .= " AND (name LIKE ? OR address LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $sql .= " ORDER BY distance ASC LIMIT ?";
        $params[] = $limit;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $pharmacies = $stmt->fetchAll();
        
        // Add medicine count for each pharmacy
        foreach ($pharmacies as &$pharmacy) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM pharmacy_medicines WHERE pharmacy_id = ?");
            $stmt->execute([$pharmacy['id']]);
            $pharmacy['medicine_count'] = (int)$stmt->fetchColumn();
            
            $pharmacy['distance'] = round($pharmacy['distance'], 2);
            $pharmacy['rating'] = (float)$pharmacy['rating'];
            $pharmacy['is_24_hours'] = (bool)$pharmacy['is_24_hours'];
        }
        
        sendSuccess($pharmacies);
        
    } elseif ($action === 'details' && $method === 'GET') {
        // Get pharmacy details
        $pharmacyId = (int)($_GET['id'] ?? 0);
        
        if (!$pharmacyId) {
            sendError('Pharmacy ID is required');
        }
        
        $stmt = $pdo->prepare("SELECT * FROM pharmacies WHERE id = ?");
        $stmt->execute([$pharmacyId]);
        $pharmacy = $stmt->fetch();
        
        if (!$pharmacy) {
            sendError('Pharmacy not found');
        }
        
        // Get available medicines
        $stmt = $pdo->prepare("
            SELECT 
                m.*,
                pm.price,
                pm.stock_quantity,
                pm.availability
            FROM medicines m
            JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            WHERE pm.pharmacy_id = ?
            ORDER BY m.name
        ");
        
        $stmt->execute([$pharmacyId]);
        $medicines = $stmt->fetchAll();
        
        $pharmacy['medicines'] = $medicines;
        $pharmacy['rating'] = (float)$pharmacy['rating'];
        $pharmacy['is_24_hours'] = (bool)$pharmacy['is_24_hours'];
        
        sendSuccess($pharmacy);
        
    } else {
        sendError('Invalid action or method');
    }
    
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
?>