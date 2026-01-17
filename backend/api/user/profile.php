<?php
/**
 * User Profile API
 * GET /api/user/profile.php - Get user profile
 * PUT /api/user/profile.php - Update user profile
 */

require_once '../../config/database.php';

setCorsHeaders();

if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'PUT'])) {
    sendError('Method not allowed', 405);
}

try {
    // Authenticate user
    $user = authenticateUser();
    $user_id = $user['user_id'];
    
    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user profile
        $sql = "SELECT user_id, username, first_name, last_name, email, phone, address, 
                       date_of_birth, gender, profile_image, is_active, email_verified, 
                       created_at, updated_at
                FROM users 
                WHERE user_id = :user_id";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        $profile = $stmt->fetch();
        
        if (!$profile) {
            sendError('User not found', 404);
        }
        
        // Convert fields
        $profile['user_id'] = (int)$profile['user_id'];
        $profile['is_active'] = (bool)$profile['is_active'];
        $profile['email_verified'] = (bool)$profile['email_verified'];
        
        // Get user statistics
        $stats_sql = "SELECT 
                        COUNT(*) as total_orders,
                        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
                        SUM(final_amount) as total_spent,
                        MAX(created_at) as last_order_date
                      FROM orders 
                      WHERE user_id = :user_id";
        
        $stmt = $conn->prepare($stats_sql);
        $stmt->execute([':user_id' => $user_id]);
        $stats = $stmt->fetch();
        
        $profile['statistics'] = [
            'total_orders' => (int)$stats['total_orders'],
            'completed_orders' => (int)$stats['completed_orders'],
            'total_spent' => (float)$stats['total_spent'],
            'last_order_date' => $stats['last_order_date']
        ];
        
        sendSuccess($profile, 'Profile retrieved successfully');
        
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update user profile
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendError('Invalid JSON input');
        }
        
        // Sanitize input
        $input = sanitizeInput($input);
        
        // Allowed fields for update
        $allowed_fields = ['first_name', 'last_name', 'phone', 'address', 'date_of_birth', 'gender'];
        $update_fields = [];
        $params = [':user_id' => $user_id];
        
        foreach ($allowed_fields as $field) {
            if (isset($input[$field])) {
                $update_fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }
        
        if (empty($update_fields)) {
            sendError('No valid fields to update');
        }
        
        // Validate gender if provided
        if (isset($input['gender']) && !in_array($input['gender'], ['male', 'female', 'other'])) {
            sendError('Invalid gender value');
        }
        
        // Update profile
        $sql = "UPDATE users SET " . implode(', ', $update_fields) . ", updated_at = CURRENT_TIMESTAMP 
                WHERE user_id = :user_id";
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute($params);
        
        if (!$result) {
            sendError('Failed to update profile', 500);
        }
        
        // Log activity
        logActivity($user_id, 'profile_updated', $input);
        
        // Get updated profile
        $sql = "SELECT user_id, username, first_name, last_name, email, phone, address, 
                       date_of_birth, gender, profile_image, is_active, email_verified, 
                       created_at, updated_at
                FROM users 
                WHERE user_id = :user_id";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        $profile = $stmt->fetch();
        
        // Convert fields
        $profile['user_id'] = (int)$profile['user_id'];
        $profile['is_active'] = (bool)$profile['is_active'];
        $profile['email_verified'] = (bool)$profile['email_verified'];
        
        sendSuccess($profile, 'Profile updated successfully');
    }
    
} catch (PDOException $e) {
    error_log("Database error in user/profile.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
    
} catch (Exception $e) {
    error_log("Error in user/profile.php: " . $e->getMessage());
    sendError('An error occurred', 500);
}
?>