<?php
/**
 * User Logout API
 * POST /api/auth/logout.php
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
    
    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();
    
    // Delete user sessions
    $sql = "DELETE FROM user_sessions WHERE user_id = :user_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':user_id' => $user_id]);
    
    // Log activity
    logActivity($user_id, 'user_logout', ['username' => $user['username']]);
    
    sendSuccess(null, 'Logout successful');
    
} catch (PDOException $e) {
    error_log("Database error in logout.php: " . $e->getMessage());
    sendError('Database error occurred', 500);
    
} catch (Exception $e) {
    error_log("Error in logout.php: " . $e->getMessage());
    sendError('An error occurred during logout', 500);
}
?>