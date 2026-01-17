<?php
/**
 * Create Order API
 * POST /api/orders/create.php
 */

require_once '../../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    // Authenticate user
    $user = authenticateUser();
    $user_id = $user['user_id'];
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }
    
    // Sanitize input
    $input = sanitizeInput($input);
    
    // Validate required fields
    $required_fields = ['pharmacy_id', 'items', 'delivery_address', 'delivery_phone'];
    $missing_fields = validateRequired($input, $required_fields);
    
    if (!empty($missing_fields)) {
        sendError('Missing required fields: ' . implode(', ', $missing_fields));
    }
    
    // Extract data
    $pharmacy_id = (int)$input['pharmacy_id'];
    $items = $input['items'];
    $delivery_address = $input['delivery_address'];
    $delivery_phone = $input['delivery_phone'];
    $delivery_type = $input['delivery_type'] ?? 'delivery';
    $payment_method = $input['payment_method'] ?? 'telebirr';
    $delivery_notes = $input['delivery_notes'] ?? null;
    $special_instructions = $input['special_instructions'] ?? null;
    
    // Validate items
    if (!is_array($items) || empty($items)) {
        sendError('Items must be a non-empty array');
    }
    
    // Validate delivery type
    if (!in_array($delivery_type, ['pickup', 'delivery'])) {
        sendError('Invalid delivery type');
    }
    
    // Validate payment method
    $valid_payment_methods = ['cash', 'telebirr', 'cbe_birr', 'bank_transfer', 'card'];
    if (!in_array($payment_method, $valid_payment_methods)) {
        sendError('Invalid payment method');
    }
    
    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();
    
    // Start transaction
    $conn->beginTransaction();
    
    try {
        // Validate pharmacy exists
        $sql = "SELECT pharmacy_id, name, address, phone FROM pharmacies WHERE pharmacy_id = :pharmacy_id AND is_active = 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':pharmacy_id' => $pharmacy_id]);
        $pharmacy = $stmt->fetch();
        
        if (!$pharmacy) {
            throw new Exception('Pharmacy not found');
        }
        
        // Validate and calculate order items
        $total_amount = 0;
        $validated_items = [];
        
        foreach ($items as $item) {
            if (!isset($item['medicine_id']) || !isset($item['quantity'])) {
                throw new Exception('Each item must have medicine_id and quantity');
            }
            
            $medicine_id = (int)$item['medicine_id'];
            $quantity = (int)$item['quantity'];
            
            if ($quantity <= 0) {
                throw new Exception('Quantity must be greater than 0');
            }
            
            // Get medicine and pharmacy inventory info
            $sql = "SELECT m.medicine_id, m.name, m.brand, m.requires_prescription,
                           pm.price, pm.stock_quantity, pm.availability_status
                    FROM medicines m
                    JOIN pharmacy_medicines pm ON m.medicine_id = pm.medicine_id
                    WHERE m.medicine_id = :medicine_id AND pm.pharmacy_id = :pharmacy_id 
                    AND m.is_active = 1";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':medicine_id' => $medicine_id,
                ':pharmacy_id' => $pharmacy_id
            ]);
            
            $medicine = $stmt->fetch();
            
            if (!$medicine) {
                throw new Exception("Medicine not available at selected pharmacy: ID $medicine_id");
            }
            
            if ($medicine['availability_status'] === 'Out of Stock') {
                throw new Exception("Medicine out of stock: " . $medicine['name']);
            }
            
            if ($medicine['stock_quantity'] < $quantity) {
                throw new Exception("Insufficient stock for " . $medicine['name'] . ". Available: " . $medicine['stock_quantity']);
            }
            
            $unit_price = (float)$medicine['price'];
            $total_price = $unit_price * $quantity;
            $total_amount += $total_price;
            
            $validated_items[] = [
                'medicine_id' => $medicine_id,
                'name' => $medicine['name'],
                'brand' => $medicine['brand'],
                'quantity' => $quantity,
                'unit_price' => $unit_price,
                'total_price' => $total_price,
                'requires_prescription' => (bool)$medicine['requires_prescription']
            ];
        }
        
        // Calculate fees and final amount
        $delivery_fee = ($delivery_type === 'delivery') ? 10.00 : 0.00; // 10 ETB delivery fee
        $tax_amount = $total_amount * 0.15; // 15% tax
        $final_amount = $total_amount + $delivery_fee + $tax_amount;
        
        // Generate order number
        $order_number = generateOrderNumber();
        
        // Create order
        $sql = "INSERT INTO orders (
                    user_id, pharmacy_id, order_number, total_amount, tax_amount, 
                    delivery_fee, final_amount, delivery_type, delivery_address, 
                    delivery_phone, delivery_notes, payment_method, special_instructions
                ) VALUES (
                    :user_id, :pharmacy_id, :order_number, :total_amount, :tax_amount,
                    :delivery_fee, :final_amount, :delivery_type, :delivery_address,
                    :delivery_phone, :delivery_notes, :payment_method, :special_instructions
                )";
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([
            ':user_id' => $user_id,
            ':pharmacy_id' => $pharmacy_id,
            ':order_number' => $order_number,
            ':total_amount' => $total_amount,
            ':tax_amount' => $tax_amount,
            ':delivery_fee' => $delivery_fee,
            ':final_amount' => $final_amount,
            ':delivery_type' => $delivery_type,
            ':delivery_address' => $delivery_address,
            ':delivery_phone' => $delivery_phone,
            ':delivery_notes' => $delivery_notes,
            ':payment_method' => $payment_method,
            ':special_instructions' => $special_instructions
        ]);
        
        if (!$result) {
            throw new Exception('Failed to create order');
        }
        
        $order_id = $conn->lastInsertId();
        
        // Create order items and update inventory
        foreach ($validated_items as $item) {
            // Insert order item
            $sql = "INSERT INTO order_items (order_id, medicine_id, quantity, unit_price, total_price)
                    VALUES (:order_id, :medicine_id, :quantity, :unit_price, :total_price)";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':order_id' => $order_id,
                ':medicine_id' => $item['medicine_id'],
                ':quantity' => $item['quantity'],
                ':unit_price' => $item['unit_price'],
                ':total_price' => $item['total_price']
            ]);
            
            // Update inventory
            $sql = "UPDATE pharmacy_medicines 
                    SET stock_quantity = stock_quantity - :quantity,
                        availability_status = CASE 
                            WHEN stock_quantity - :quantity <= 0 THEN 'Out of Stock'
                            WHEN stock_quantity - :quantity <= 5 THEN 'Limited Stock'
                            ELSE 'In Stock'
                        END
                    WHERE pharmacy_id = :pharmacy_id AND medicine_id = :medicine_id";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':quantity' => $item['quantity'],
                ':pharmacy_id' => $pharmacy_id,
                ':medicine_id' => $item['medicine_id']
            ]);
        }
        
        // Set estimated delivery time
        $estimated_delivery = date('Y-m-d H:i:s', strtotime('+2 hours'));
        if ($delivery_type === 'pickup') {
            $estimated_delivery = date('Y-m-d H:i:s', strtotime('+30 minutes'));
        }
        
        $sql = "UPDATE orders SET estimated_delivery = :estimated_delivery WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':estimated_delivery' => $estimated_delivery,
            ':order_id' => $order_id
        ]);
        
        // Commit transaction
        $conn->commit();
        
        // Log activity
        logActivity($user_id, 'order_created', [
            'order_id' => $order_id,
            'order_number' => $order_number,
            'pharmacy_id' => $pharmacy_id,
            'total_amount' => $final_amount
        ]);
        
        // Get complete order details for response
        $sql = "SELECT o.*, p.name as pharmacy_name, p.address as pharmacy_address, p.phone as pharmacy_phone
                FROM orders o
                JOIN pharmacies p ON o.pharmacy_id = p.pharmacy_id
                WHERE o.order_id = :order_id";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([':order_id' => $order_id]);
        $order = $stmt->fetch();
        
        // Convert numeric fields
        $order['order_id'] = (int)$order['order_id'];
        $order['user_id'] = (int)$order['user_id'];
        $order['pharmacy_id'] = (int)$order['pharmacy_id'];
        $order['total_amount'] = (float)$order['total_amount'];
        $order['tax_amount'] = (float)$order['tax_amount'];
        $order['delivery_fee'] = (float)$order['delivery_fee'];
        $order['final_amount'] = (float)$order['final_amount'];
        
        $response_data = [
            'order' => $order,
            'items' => $validated_items,
            'summary' => [
                'subtotal' => $total_amount,
                'tax_amount' => $tax_amount,
                'delivery_fee' => $delivery_fee,
                'final_amount' => $final_amount,
                'estimated_delivery' => $estimated_delivery
            ]
        ];
        
        sendSuccess($response_data, 'Order created successfully');
        
    } catch (Exception $e) {
        // Rollback transaction
        $conn->rollback();
        throw $e;
    }
    
} catch (PDOException $e) {
    error_log("Database error in orders/create.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
    
} catch (Exception $e) {
    error_log("Error in orders/create.php: " . $e->getMessage());
    sendError($e->getMessage(), 400);
}
?>