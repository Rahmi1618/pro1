<?php
/**
 * Get Pharmacies List API
 * GET /api/pharmacies/list.php
 */

require_once '../../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    // Get query parameters
    $lat = $_GET['lat'] ?? null;
    $lng = $_GET['lng'] ?? null;
    $radius = $_GET['radius'] ?? 10; // Default 10km radius
    $limit = min((int)($_GET['limit'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
    $offset = (int)($_GET['offset'] ?? 0);
    $search = $_GET['search'] ?? '';
    $is_24_hours = $_GET['is_24_hours'] ?? null;
    $min_rating = $_GET['min_rating'] ?? null;
    $sort_by = $_GET['sort_by'] ?? 'name';
    $sort_order = strtoupper($_GET['sort_order'] ?? 'ASC');
    
    // Validate sort parameters
    $valid_sort_fields = ['name', 'rating', 'distance', 'created_at'];
    $valid_sort_orders = ['ASC', 'DESC'];
    
    if (!in_array($sort_by, $valid_sort_fields)) {
        $sort_by = 'name';
    }
    
    if (!in_array($sort_order, $valid_sort_orders)) {
        $sort_order = 'ASC';
    }
    
    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();
    
    // Build query
    $sql = "SELECT p.*, 
                   COUNT(DISTINCT pm.medicine_id) as medicine_count,
                   COUNT(DISTINCT r.review_id) as review_count";
    
    // Add distance calculation if coordinates provided
    if ($lat && $lng) {
        $sql .= ", (6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * 
                   cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat)) * 
                   sin(radians(p.latitude)))) AS distance";
    }
    
    $sql .= " FROM pharmacies p
              LEFT JOIN pharmacy_medicines pm ON p.pharmacy_id = pm.pharmacy_id
              LEFT JOIN reviews r ON p.pharmacy_id = r.pharmacy_id
              WHERE p.is_active = 1";
    
    $params = [];
    
    // Add coordinates to params if provided
    if ($lat && $lng) {
        $params[':lat'] = (float)$lat;
        $params[':lng'] = (float)$lng;
    }
    
    // Add search filter
    if (!empty($search)) {
        $sql .= " AND (p.name LIKE :search OR p.address LIKE :search OR p.description LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }
    
    // Add 24 hours filter
    if ($is_24_hours !== null) {
        $sql .= " AND p.is_24_hours = :is_24_hours";
        $params[':is_24_hours'] = $is_24_hours === 'true' ? 1 : 0;
    }
    
    $sql .= " GROUP BY p.pharmacy_id";
    
    // Add rating filter
    if ($min_rating !== null) {
        $sql .= " HAVING p.rating >= :min_rating";
        $params[':min_rating'] = (float)$min_rating;
    }
    
    // Add distance filter if coordinates provided
    if ($lat && $lng && $radius) {
        if ($min_rating !== null) {
            $sql .= " AND distance <= :radius";
        } else {
            $sql .= " HAVING distance <= :radius";
        }
        $params[':radius'] = (float)$radius;
    }
    
    // Add sorting
    if ($sort_by === 'distance' && $lat && $lng) {
        $sql .= " ORDER BY distance " . $sort_order;
    } else if ($sort_by === 'rating') {
        $sql .= " ORDER BY p.rating " . $sort_order;
    } else {
        $sql .= " ORDER BY p." . $sort_by . " " . $sort_order;
    }
    
    // Add pagination
    $sql .= " LIMIT :limit OFFSET :offset";
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Execute query
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $pharmacies = $stmt->fetchAll();
    
    // Process results
    foreach ($pharmacies as &$pharmacy) {
        // Parse opening hours JSON
        if ($pharmacy['opening_hours']) {
            $pharmacy['opening_hours'] = json_decode($pharmacy['opening_hours'], true);
        }
        
        // Convert numeric fields
        $pharmacy['pharmacy_id'] = (int)$pharmacy['pharmacy_id'];
        $pharmacy['rating'] = (float)$pharmacy['rating'];
        $pharmacy['total_reviews'] = (int)$pharmacy['total_reviews'];
        $pharmacy['medicine_count'] = (int)$pharmacy['medicine_count'];
        $pharmacy['review_count'] = (int)$pharmacy['review_count'];
        $pharmacy['is_24_hours'] = (bool)$pharmacy['is_24_hours'];
        $pharmacy['is_active'] = (bool)$pharmacy['is_active'];
        $pharmacy['is_verified'] = (bool)$pharmacy['is_verified'];
        
        if (isset($pharmacy['distance'])) {
            $pharmacy['distance'] = round((float)$pharmacy['distance'], 2);
        }
        
        // Split services string into array
        if ($pharmacy['services']) {
            $pharmacy['services'] = explode(', ', $pharmacy['services']);
        } else {
            $pharmacy['services'] = [];
        }
    }
    
    // Get total count for pagination
    $count_sql = "SELECT COUNT(DISTINCT p.pharmacy_id) as total
                  FROM pharmacies p
                  LEFT JOIN pharmacy_medicines pm ON p.pharmacy_id = pm.pharmacy_id
                  LEFT JOIN reviews r ON p.pharmacy_id = r.pharmacy_id
                  WHERE p.is_active = 1";
    
    $count_params = [];
    
    if (!empty($search)) {
        $count_sql .= " AND (p.name LIKE :search OR p.address LIKE :search OR p.description LIKE :search)";
        $count_params[':search'] = '%' . $search . '%';
    }
    
    if ($is_24_hours !== null) {
        $count_sql .= " AND p.is_24_hours = :is_24_hours";
        $count_params[':is_24_hours'] = $is_24_hours === 'true' ? 1 : 0;
    }
    
    if ($min_rating !== null) {
        $count_sql .= " AND p.rating >= :min_rating";
        $count_params[':min_rating'] = (float)$min_rating;
    }
    
    $stmt = $conn->prepare($count_sql);
    $stmt->execute($count_params);
    $total_count = $stmt->fetch()['total'];
    
    // Prepare response
    $response_data = [
        'pharmacies' => $pharmacies,
        'pagination' => [
            'limit' => $limit,
            'offset' => $offset,
            'total' => (int)$total_count,
            'count' => count($pharmacies),
            'has_more' => ($offset + $limit) < $total_count
        ],
        'filters' => [
            'search' => $search,
            'is_24_hours' => $is_24_hours,
            'min_rating' => $min_rating,
            'radius' => $radius,
            'coordinates' => $lat && $lng ? ['lat' => (float)$lat, 'lng' => (float)$lng] : null
        ],
        'sorting' => [
            'sort_by' => $sort_by,
            'sort_order' => $sort_order
        ]
    ];
    
    sendSuccess($response_data, 'Pharmacies retrieved successfully');
    
} catch (PDOException $e) {
    error_log("Database error in pharmacies/list.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
    
} catch (Exception $e) {
    error_log("Error in pharmacies/list.php: " . $e->getMessage());
    sendError('An error occurred while fetching pharmacies', 500);
}
?>