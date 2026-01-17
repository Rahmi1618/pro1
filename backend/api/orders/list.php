<?php
/**
 * Get User Orders API
 * GET /api/orders/list.php
 */

require_once '../../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    // Authenticate user
    $user = authenticateUser();
    $user_id = $user['user_id'];
    
    // Get query parameters
    $status = $_GET['status'] ?? '';
    $limit = min((int)($_GET['limit'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
    $offset = (int)($_GET['offset'] ?? 0);
    $sort_by = $_GET['sort_by'] ?? 'created_at';
    $sort_order = strtoupper($_GET['sort_order'] ?? 'DESC');
    
    // Validate sort parameters
    $valid_sort_fields = ['created_at', 'final_amount', 'status', 'order_number'];
    $valid_sort_orders = ['ASC', 'DESC'];
    
    if (!in_array($sort_by, $valid_sort_fields)) {
        $sort_by = 'created_at';
    }
    
    if (!in_array($sort_order, $valid_sort_orders)) {
        $sort_order = 'DESC';
    }
    
    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();
    
    // Build query
    $sql = "SELECT o.*, p.name as pharmacy_name, p.address as pharmacy_address, 
                   p.phone as pharmacy_phone, p.rating as pharmacy_rating,
                   COUNT(oi.item_id) as item_count
            FROM orders o
            JOIN pharmacies p ON o.pharmacy_id = p.pharmacy_id
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.user_id = :user_id";
    
    $params = [':user_id' => $user_id];
    
    // Add status filter
    if (!empty($status)) {
        $sql .= " AND o.status = :status";
        $params[':status'] = $status;
    }
    
    $sql .= " GROUP BY o.order_id";
    $sql .= " ORDER BY o." . $sort_by . " " . $sort_order;
    $sql .= " LIMIT :limit OFFSET :offset";
    
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;
    
    // Execute query
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();
    
    // Process results and get order items
    foreach ($orders as &$order) {
        // Convert numeric fields
        $order['order_id'] = (int)$order['order_id'];
        $order['user_id'] = (int)$order['user_id'];
        $order['pharmacy_id'] = (int)$order['pharmacy_id'];
        $order['total_amount'] = (float)$order['total_amount'];
        $order['discount_amount'] = (float)$order['discount_amount'];
        $order['tax_amount'] = (float)$order['tax_amount'];
        $order['delivery_fee'] = (float)$order['delivery_fee'];
        $order['final_amount'] = (float)$order['final_amount'];
        $order['pharmacy_rating'] = (float)$order['pharmacy_rating'];
        $order['item_count'] = (int)$order['item_count'];
        
        // Get order items
        $items_sql = "SELECT oi.*, m.name as medicine_name, m.brand, m.dosage_form, m.strength
                      FROM order_items oi
                      JOIN medicines m ON oi.medicine_id = m.medicine_id
                      WHERE oi.order_id = :order_id";
        
        $items_stmt = $conn->prepare($items_sql);
        $items_stmt->execute([':order_id' => $order['order_id']]);
        $items = $items_stmt->fetchAll();
        
        // Process items
        foreach ($items as &$item) {
            $item['item_id'] = (int)$item['item_id'];
            $item['medicine_id'] = (int)$item['medicine_id'];
            $item['quantity'] = (int)$item['quantity'];
            $item['unit_price'] = (float)$item['unit_price'];
            $item['discount_amount'] = (float)$item['discount_amount'];
            $item['total_price'] = (float)$item['total_price'];
        }
        
        $order['items'] = $items;
    }
    
    // Get total count for pagination
    $count_sql = "SELECT COUNT(*) as total FROM orders WHERE user_id = :user_id";
    $count_params = [':user_id' => $user_id];
    
    if (!empty($status)) {
        $count_sql .= " AND status = :status";
        $count_params[':status'] = $status;
    }
    
    $stmt = $conn->prepare($count_sql);
    $stmt->execute($count_params);
    $total_count = $stmt->fetch()['total'];
    
    // Get order statistics
    $stats_sql = "SELECT 
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
                    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                    SUM(final_amount) as total_spent,
                    AVG(final_amount) as avg_order_value
                  FROM orders 
                  WHERE user_id = :user_id";
    
    $stmt = $conn->prepare($stats_sql);
    $stmt->execute([':user_id' => $user_id]);
    $stats = $stmt->fetch();
    
    // Prepare response
    $response_data = [
        'orders' => $orders,
        'pagination' => [
            'limit' => $limit,
            'offset' => $offset,
            'total' => (int)$total_count,
            'count' => count($orders),
            'has_more' => ($offset + $limit) < $total_count
        ],
        'filters' => [
            'status' => $status
        ],
        'sorting' => [
            'sort_by' => $sort_by,
            'sort_order' => $sort_order
        ],
        'statistics' => [
            'total_orders' => (int)$stats['total_orders'],
            'completed_orders' => (int)$stats['completed_orders'],
            'cancelled_orders' => (int)$stats['cancelled_orders'],
            'total_spent' => (float)$stats['total_spent'],
            'avg_order_value' => $stats['avg_order_value'] ? round((float)$stats['avg_order_value'], 2) : 0
        ]
    ];
    
    sendSuccess($response_data, 'Orders retrieved successfully');
    
} catch (PDOException $e) {
    error_log("Database error in orders/list.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
    
} catch (Exception $e) {
    error_log("Error in orders/list.php: " . $e->getMessage());
    sendError('An error occurred while fetching orders', 500);
}
?>