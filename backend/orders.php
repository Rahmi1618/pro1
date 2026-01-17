<?php
/**
 * Orders API for PharmaCare
 * Handles order creation and management
 */

require_once 'config.php';
setCorsHeaders();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Simple token validation
function validateToken() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    if (strpos($token, 'Bearer ') === 0) {
        $token = substr($token, 7);
    }
    
    if (empty($token)) {
        sendError('Authorization token required', 401);
    }
    
    $decoded = json_decode(base64_decode($token), true);
    
    if (!$decoded || !isset($decoded['user_id']) || $decoded['exp'] < time()) {
        sendError('Invalid or expired token', 401);
    }
    
    return $decoded['user_id'];
}

try {
    $pdo = getDB();
    
    if ($action === 'create' && $method === 'POST') {
        // Create new order
        $userId = validateToken();
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendError('Invalid JSON input');
        }
        
        $input = sanitizeInput($input);
        
        // Validate required fields
        $required = ['pharmacy_id', 'medicine_id', 'quantity'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                sendError("Field '$field' is required");
            }
        }
        
        $pharmacyId = (int)$input['pharmacy_id'];
        $medicineId = (int)$input['medicine_id'];
        $quantity = (int)$input['quantity'];
        
        // Get medicine and pharmacy info
        $stmt = $pdo->prepare("
            SELECT 
                m.name as medicine_name,
                m.requires_prescription,
                p.name as pharmacy_name,
                pm.price,
                pm.stock_quantity,
                pm.availability
            FROM medicines m
            JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            JOIN pharmacies p ON pm.pharmacy_id = p.id
            WHERE m.id = ? AND p.id = ?
        ");
        
        $stmt->execute([$medicineId, $pharmacyId]);
        $info = $stmt->fetch();
        
        if (!$info) {
            sendError('Medicine not available at selected pharmacy');
        }
        
        if ($info['availability'] === 'Out of Stock') {
            sendError('Medicine is out of stock');
        }
        
        if ($info['stock_quantity'] < $quantity) {
            sendError('Insufficient stock. Available: ' . $info['stock_quantity']);
        }
        
        $totalPrice = $info['price'] * $quantity;
        
        // Create order
        $stmt = $pdo->prepare("
            INSERT INTO orders (
                user_id, pharmacy_id, medicine_id, quantity, total_price,
                delivery_address, delivery_phone, payment_method, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $result = $stmt->execute([
            $userId,
            $pharmacyId,
            $medicineId,
            $quantity,
            $totalPrice,
            $input['delivery_address'] ?? null,
            $input['delivery_phone'] ?? null,
            $input['payment_method'] ?? 'telebirr',
            $input['notes'] ?? null
        ]);
        
        if ($result) {
            $orderId = $pdo->lastInsertId();
            
            // Update stock
            $stmt = $pdo->prepare("
                UPDATE pharmacy_medicines 
                SET stock_quantity = stock_quantity - ?,
                    availability = CASE 
                        WHEN stock_quantity - ? <= 0 THEN 'Out of Stock'
                        WHEN stock_quantity - ? <= 5 THEN 'Limited Stock'
                        ELSE 'In Stock'
                    END
                WHERE pharmacy_id = ? AND medicine_id = ?
            ");
            
            $stmt->execute([$quantity, $quantity, $quantity, $pharmacyId, $medicineId]);
            
            // Get order details
            $stmt = $pdo->prepare("
                SELECT 
                    o.*,
                    m.name as medicine_name,
                    m.brand as medicine_brand,
                    p.name as pharmacy_name,
                    p.address as pharmacy_address,
                    p.phone as pharmacy_phone
                FROM orders o
                JOIN medicines m ON o.medicine_id = m.id
                JOIN pharmacies p ON o.pharmacy_id = p.id
                WHERE o.id = ?
            ");
            
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();
            
            sendSuccess($order, 'Order created successfully');
        } else {
            sendError('Failed to create order');
        }
        
    } elseif ($action === 'history' && $method === 'GET') {
        // Get user order history
        $userId = validateToken();
        
        $stmt = $pdo->prepare("
            SELECT 
                o.*,
                m.name as medicine_name,
                m.brand as medicine_brand,
                p.name as pharmacy_name,
                p.address as pharmacy_address
            FROM orders o
            JOIN medicines m ON o.medicine_id = m.id
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        ");
        
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll();
        
        sendSuccess($orders);
        
    } elseif ($action === 'status' && $method === 'GET') {
        // Get order status
        $userId = validateToken();
        $orderId = (int)($_GET['order_id'] ?? 0);
        
        if (!$orderId) {
            sendError('Order ID is required');
        }
        
        $stmt = $pdo->prepare("
            SELECT 
                o.*,
                m.name as medicine_name,
                p.name as pharmacy_name
            FROM orders o
            JOIN medicines m ON o.medicine_id = m.id
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.id = ? AND o.user_id = ?
        ");
        
        $stmt->execute([$orderId, $userId]);
        $order = $stmt->fetch();
        
        if (!$order) {
            sendError('Order not found');
        }
        
        sendSuccess($order);
        
    } else {
        sendError('Invalid action or method');
    }
    
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
?>