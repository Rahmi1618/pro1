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
    case 'create':
        createOrder($db, $input);
        break;
    case 'payment':
        processPayment($db, $input);
        break;
    case 'status':
        getOrderStatus($db, $_GET);
        break;
    case 'history':
        getOrderHistory($db, $_GET);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function createOrder($db, $input) {
    $userId = $input['user_id'] ?? '';
    $pharmacyId = $input['pharmacy_id'] ?? '';
    $medicineId = $input['medicine_id'] ?? '';
    $quantity = $input['quantity'] ?? 1;
    $deliveryAddress = $input['delivery_address'] ?? '';
    
    if (empty($userId) || empty($pharmacyId) || empty($medicineId)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Pharmacy ID, and Medicine ID are required']);
        return;
    }
    
    try {
        // Check medicine availability and get price
        $query = "
            SELECT pm.price, pm.stock_quantity, pm.availability_status, m.name as medicine_name, p.name as pharmacy_name
            FROM pharmacy_medicines pm
            JOIN medicines m ON pm.medicine_id = m.id
            JOIN pharmacies p ON pm.pharmacy_id = p.id
            WHERE pm.pharmacy_id = :pharmacy_id AND pm.medicine_id = :medicine_id
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':pharmacy_id', $pharmacyId);
        $stmt->bindParam(':medicine_id', $medicineId);
        $stmt->execute();
        
        $medicineInfo = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$medicineInfo) {
            echo json_encode(['success' => false, 'message' => 'Medicine not available at this pharmacy']);
            return;
        }
        
        if ($medicineInfo['availability_status'] === 'Out of Stock') {
            echo json_encode(['success' => false, 'message' => 'Medicine is out of stock']);
            return;
        }
        
        if ($medicineInfo['stock_quantity'] < $quantity) {
            echo json_encode(['success' => false, 'message' => 'Insufficient stock. Available: ' . $medicineInfo['stock_quantity']]);
            return;
        }
        
        $totalPrice = $medicineInfo['price'] * $quantity;
        
        // Create order
        $query = "
            INSERT INTO orders (user_id, pharmacy_id, medicine_id, quantity, total_price, delivery_address, status, payment_status)
            VALUES (:user_id, :pharmacy_id, :medicine_id, :quantity, :total_price, :delivery_address, 'Pending', 'Pending')
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':pharmacy_id', $pharmacyId);
        $stmt->bindParam(':medicine_id', $medicineId);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':total_price', $totalPrice);
        $stmt->bindParam(':delivery_address', $deliveryAddress);
        
        if ($stmt->execute()) {
            $orderId = $db->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Order created successfully',
                'order_id' => $orderId,
                'total_price' => $totalPrice,
                'medicine_name' => $medicineInfo['medicine_name'],
                'pharmacy_name' => $medicineInfo['pharmacy_name']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to create order']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Order creation failed: ' . $e->getMessage()]);
    }
}

function processPayment($db, $input) {
    $orderId = $input['order_id'] ?? '';
    $paymentMethod = $input['payment_method'] ?? 'TeleBirr';
    $phoneNumber = $input['phone_number'] ?? '';
    
    if (empty($orderId) || empty($phoneNumber)) {
        echo json_encode(['success' => false, 'message' => 'Order ID and phone number are required']);
        return;
    }
    
    try {
        // Get order details
        $query = "SELECT * FROM orders WHERE id = :order_id AND payment_status = 'Pending'";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();
        
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'Order not found or already processed']);
            return;
        }
        
        // Simulate TeleBirr payment processing
        $paymentResult = simulateTeleBirrPayment($phoneNumber, $order['total_price']);
        
        if ($paymentResult['success']) {
            // Update order status
            $query = "UPDATE orders SET payment_status = 'Completed', payment_method = :payment_method, status = 'Confirmed' WHERE id = :order_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':payment_method', $paymentMethod);
            $stmt->bindParam(':order_id', $orderId);
            $stmt->execute();
            
            // Update medicine stock
            $query = "UPDATE pharmacy_medicines SET stock_quantity = stock_quantity - :quantity WHERE pharmacy_id = :pharmacy_id AND medicine_id = :medicine_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':quantity', $order['quantity']);
            $stmt->bindParam(':pharmacy_id', $order['pharmacy_id']);
            $stmt->bindParam(':medicine_id', $order['medicine_id']);
            $stmt->execute();
            
            // Update availability status if stock is low
            updateAvailabilityStatus($db, $order['pharmacy_id'], $order['medicine_id']);
            
            echo json_encode([
                'success' => true,
                'message' => 'Payment successful',
                'transaction_id' => $paymentResult['transaction_id'],
                'order_status' => 'Confirmed'
            ]);
        } else {
            // Update payment status to failed
            $query = "UPDATE orders SET payment_status = 'Failed' WHERE id = :order_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':order_id', $orderId);
            $stmt->execute();
            
            echo json_encode([
                'success' => false,
                'message' => 'Payment failed: ' . $paymentResult['message']
            ]);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Payment processing failed: ' . $e->getMessage()]);
    }
}

function simulateTeleBirrPayment($phoneNumber, $amount) {
    // Simulate payment processing delay
    sleep(1);
    
    // Simulate 90% success rate
    if (rand(1, 10) <= 9) {
        return [
            'success' => true,
            'transaction_id' => 'TB' . time() . rand(1000, 9999),
            'message' => 'Payment successful'
        ];
    } else {
        return [
            'success' => false,
            'message' => 'Insufficient balance or network error'
        ];
    }
}

function updateAvailabilityStatus($db, $pharmacyId, $medicineId) {
    $query = "SELECT stock_quantity FROM pharmacy_medicines WHERE pharmacy_id = :pharmacy_id AND medicine_id = :medicine_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':pharmacy_id', $pharmacyId);
    $stmt->bindParam(':medicine_id', $medicineId);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        $stock = $result['stock_quantity'];
        $status = 'In Stock';
        
        if ($stock == 0) {
            $status = 'Out of Stock';
        } elseif ($stock <= 10) {
            $status = 'Limited Stock';
        }
        
        $query = "UPDATE pharmacy_medicines SET availability_status = :status WHERE pharmacy_id = :pharmacy_id AND medicine_id = :medicine_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':pharmacy_id', $pharmacyId);
        $stmt->bindParam(':medicine_id', $medicineId);
        $stmt->execute();
    }
}

function getOrderStatus($db, $params) {
    $orderId = $params['order_id'] ?? '';
    
    if (empty($orderId)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        return;
    }
    
    try {
        $query = "
            SELECT o.*, m.name as medicine_name, m.brand, p.name as pharmacy_name, p.phone as pharmacy_phone
            FROM orders o
            JOIN medicines m ON o.medicine_id = m.id
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.id = :order_id
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();
        
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($order) {
            echo json_encode([
                'success' => true,
                'order' => $order
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Order not found']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to get order status: ' . $e->getMessage()]);
    }
}

function getOrderHistory($db, $params) {
    $userId = $params['user_id'] ?? '';
    
    if (empty($userId)) {
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        return;
    }
    
    try {
        $query = "
            SELECT o.*, m.name as medicine_name, m.brand, p.name as pharmacy_name
            FROM orders o
            JOIN medicines m ON o.medicine_id = m.id
            JOIN pharmacies p ON o.pharmacy_id = p.id
            WHERE o.user_id = :user_id
            ORDER BY o.created_at DESC
        ";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'orders' => $orders
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to get order history: ' . $e->getMessage()]);
    }
}
?>