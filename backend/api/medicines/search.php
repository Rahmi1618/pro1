<?php
/**
 * Medicine Search API
 * POST /api/medicines/search.php
 */

require_once '../../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Extract search parameters
    $query = $input['query'] ?? '';
    $category = $input['category'] ?? '';
    $requires_prescription = $input['requires_prescription'] ?? null;
    $price_min = $input['price_min'] ?? null;
    $price_max = $input['price_max'] ?? null;
    $pharmacy_id = $input['pharmacy_id'] ?? null;
    $in_stock_only = $input['in_stock_only'] ?? false;
    $sort_by = $input['sort_by'] ?? 'name';
    $sort_order = strtoupper($input['sort_order'] ?? 'ASC');
    $limit = min((int)($input['limit'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
    $offset = (int)($input['offset'] ?? 0);
    
    // Validate sort parameters
    $valid_sort_fields = ['name', 'category', 'min_price', 'max_price', 'avg_price', 'pharmacy_count'];
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
    $sql = "SELECT m.*, 
                   COUNT(DISTINCT pm.pharmacy_id) as pharmacy_count,
                   MIN(pm.price) as min_price,
                   MAX(pm.price) as max_price,
                   AVG(pm.price) as avg_price,
                   SUM(pm.stock_quantity) as total_stock";
    
    if ($pharmacy_id) {
        $sql .= ", pm_specific.price as pharmacy_price,
                   pm_specific.stock_quantity as pharmacy_stock,
                   pm_specific.availability_status as pharmacy_availability";
    }
    
    $sql .= " FROM medicines m
              LEFT JOIN pharmacy_medicines pm ON m.medicine_id = pm.medicine_id";
    
    if ($pharmacy_id) {
        $sql .= " LEFT JOIN pharmacy_medicines pm_specific ON m.medicine_id = pm_specific.medicine_id 
                  AND pm_specific.pharmacy_id = :pharmacy_id";
    }
    
    $sql .= " WHERE m.is_active = 1";
    
    $params = [];
    
    // Add pharmacy filter to params
    if ($pharmacy_id) {
        $params[':pharmacy_id'] = (int)$pharmacy_id;
    }
    
    // Add search query filter
    if (!empty($query)) {
        $sql .= " AND (m.name LIKE :query OR m.brand LIKE :query OR m.generic_name LIKE :query 
                  OR m.description LIKE :query OR m.category LIKE :query)";
        $params[':query'] = '%' . $query . '%';
    }
    
    // Add category filter
    if (!empty($category)) {
        $sql .= " AND m.category = :category";
        $params[':category'] = $category;
    }
    
    // Add prescription filter
    if ($requires_prescription !== null) {
        $sql .= " AND m.requires_prescription = :requires_prescription";
        $params[':requires_prescription'] = $requires_prescription ? 1 : 0;
    }
    
    $sql .= " GROUP BY m.medicine_id";
    
    // Add price filters (after GROUP BY)
    $having_conditions = [];
    
    if ($price_min !== null) {
        $having_conditions[] = "min_price >= :price_min";
        $params[':price_min'] = (float)$price_min;
    }
    
    if ($price_max !== null) {
        $having_conditions[] = "max_price <= :price_max";
        $params[':price_max'] = (float)$price_max;
    }
    
    if ($in_stock_only) {
        $having_conditions[] = "total_stock > 0";
    }
    
    if (!empty($having_conditions)) {
        $sql .= " HAVING " . implode(' AND ', $having_conditions);
    }
    
    // Add sorting
    $sql .= " ORDER BY " . $sort_by . " " . $sort_order;
    
    // Add pagination
    $sql .= " LIMIT :limit OFFSET :offset";
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Execute query
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $medicines = $stmt->fetchAll();
    
    // Process results
    foreach ($medicines as &$medicine) {
        // Convert numeric fields
        $medicine['medicine_id'] = (int)$medicine['medicine_id'];
        $medicine['requires_prescription'] = (bool)$medicine['requires_prescription'];
        $medicine['is_active'] = (bool)$medicine['is_active'];
        $medicine['pharmacy_count'] = (int)$medicine['pharmacy_count'];
        $medicine['min_price'] = $medicine['min_price'] ? (float)$medicine['min_price'] : null;
        $medicine['max_price'] = $medicine['max_price'] ? (float)$medicine['max_price'] : null;
        $medicine['avg_price'] = $medicine['avg_price'] ? round((float)$medicine['avg_price'], 2) : null;
        $medicine['total_stock'] = (int)$medicine['total_stock'];
        
        if (isset($medicine['pharmacy_price'])) {
            $medicine['pharmacy_price'] = $medicine['pharmacy_price'] ? (float)$medicine['pharmacy_price'] : null;
            $medicine['pharmacy_stock'] = (int)$medicine['pharmacy_stock'];
        }
        
        // Get available pharmacies for this medicine
        $pharmacy_sql = "SELECT p.pharmacy_id, p.name, p.address, p.phone, p.rating, p.is_24_hours,
                                pm.price, pm.stock_quantity, pm.availability_status,
                                (6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * 
                                cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat)) * 
                                sin(radians(p.latitude)))) AS distance
                         FROM pharmacies p
                         JOIN pharmacy_medicines pm ON p.pharmacy_id = pm.pharmacy_id
                         WHERE pm.medicine_id = :medicine_id AND p.is_active = 1";
        
        if ($in_stock_only) {
            $pharmacy_sql .= " AND pm.stock_quantity > 0";
        }
        
        $pharmacy_sql .= " ORDER BY pm.price ASC LIMIT 5";
        
        $pharmacy_stmt = $conn->prepare($pharmacy_sql);
        $pharmacy_params = [
            ':medicine_id' => $medicine['medicine_id'],
            ':lat' => 11.0815, // Default Kombolcha coordinates
            ':lng' => 39.7267
        ];
        
        $pharmacy_stmt->execute($pharmacy_params);
        $pharmacies = $pharmacy_stmt->fetchAll();
        
        // Process pharmacy data
        foreach ($pharmacies as &$pharmacy) {
            $pharmacy['pharmacy_id'] = (int)$pharmacy['pharmacy_id'];
            $pharmacy['price'] = (float)$pharmacy['price'];
            $pharmacy['stock_quantity'] = (int)$pharmacy['stock_quantity'];
            $pharmacy['rating'] = (float)$pharmacy['rating'];
            $pharmacy['is_24_hours'] = (bool)$pharmacy['is_24_hours'];
            $pharmacy['distance'] = $pharmacy['distance'] ? round((float)$pharmacy['distance'], 2) : null;
        }
        
        $medicine['available_pharmacies'] = $pharmacies;
    }
    
    // Get total count for pagination
    $count_sql = "SELECT COUNT(DISTINCT m.medicine_id) as total
                  FROM medicines m
                  LEFT JOIN pharmacy_medicines pm ON m.medicine_id = pm.medicine_id
                  WHERE m.is_active = 1";
    
    $count_params = [];
    
    if (!empty($query)) {
        $count_sql .= " AND (m.name LIKE :query OR m.brand LIKE :query OR m.generic_name LIKE :query 
                        OR m.description LIKE :query OR m.category LIKE :query)";
        $count_params[':query'] = '%' . $query . '%';
    }
    
    if (!empty($category)) {
        $count_sql .= " AND m.category = :category";
        $count_params[':category'] = $category;
    }
    
    if ($requires_prescription !== null) {
        $count_sql .= " AND m.requires_prescription = :requires_prescription";
        $count_params[':requires_prescription'] = $requires_prescription ? 1 : 0;
    }
    
    $stmt = $conn->prepare($count_sql);
    $stmt->execute($count_params);
    $total_count = $stmt->fetch()['total'];
    
    // Get categories for filter options
    $categories_sql = "SELECT category, COUNT(*) as count
                       FROM medicines 
                       WHERE is_active = 1 AND category IS NOT NULL AND category != ''
                       GROUP BY category
                       ORDER BY count DESC, category ASC";
    
    $stmt = $conn->prepare($categories_sql);
    $stmt->execute();
    $categories = $stmt->fetchAll();
    
    // Prepare response
    $response_data = [
        'medicines' => $medicines,
        'pagination' => [
            'limit' => $limit,
            'offset' => $offset,
            'total' => (int)$total_count,
            'count' => count($medicines),
            'has_more' => ($offset + $limit) < $total_count
        ],
        'filters' => [
            'query' => $query,
            'category' => $category,
            'requires_prescription' => $requires_prescription,
            'price_range' => [
                'min' => $price_min,
                'max' => $price_max
            ],
            'pharmacy_id' => $pharmacy_id,
            'in_stock_only' => $in_stock_only
        ],
        'sorting' => [
            'sort_by' => $sort_by,
            'sort_order' => $sort_order
        ],
        'categories' => $categories
    ];
    
    sendSuccess($response_data, 'Medicine search completed successfully');
    
} catch (PDOException $e) {
    error_log("Database error in medicines/search.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
    
} catch (Exception $e) {
    error_log("Error in medicines/search.php: " . $e->getMessage());
    sendError('An error occurred during medicine search', 500);
}
?>