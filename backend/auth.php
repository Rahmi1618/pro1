<?php
/**
 * Authentication API for PharmaCare
 * Handles user registration and login
 */

require_once 'config.php';
setCorsHeaders();

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDB();
    
    if ($action === 'register' && $method === 'POST') {
        // User Registration
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendError('Invalid JSON input');
        }
        
        $input = sanitizeInput($input);
        
        // Validate required fields
        $required = ['username', 'first_name', 'last_name', 'email', 'password'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                sendError("Field '$field' is required");
            }
        }
        
        // Validate email
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            sendError('Invalid email format');
        }
        
        // Check if username exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$input['username']]);
        if ($stmt->fetch()) {
            sendError('Username already exists');
        }
        
        // Check if email exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$input['email']]);
        if ($stmt->fetch()) {
            sendError('Email already exists');
        }
        
        // Insert new user
        $stmt = $pdo->prepare("
            INSERT INTO users (username, first_name, last_name, email, password, phone, address) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $result = $stmt->execute([
            $input['username'],
            $input['first_name'],
            $input['last_name'],
            $input['email'],
            hashPassword($input['password']),
            $input['phone'] ?? null,
            $input['address'] ?? null
        ]);
        
        if ($result) {
            $userId = $pdo->lastInsertId();
            
            // Get user data
            $stmt = $pdo->prepare("SELECT id, username, first_name, last_name, email, phone, address, created_at FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            sendSuccess([
                'user' => $user,
                'token' => base64_encode(json_encode(['user_id' => $userId, 'exp' => time() + 86400]))
            ], 'User registered successfully');
        } else {
            sendError('Registration failed');
        }
        
    } elseif ($action === 'login' && $method === 'POST') {
        // User Login
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            sendError('Invalid JSON input');
        }
        
        $input = sanitizeInput($input);
        
        if (empty($input['username']) || empty($input['password'])) {
            sendError('Username and password are required');
        }
        
        // Find user by username or email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$input['username'], $input['username']]);
        $user = $stmt->fetch();
        
        if (!$user || !verifyPassword($input['password'], $user['password'])) {
            sendError('Invalid credentials');
        }
        
        // Remove password from response
        unset($user['password']);
        
        sendSuccess([
            'user' => $user,
            'token' => base64_encode(json_encode(['user_id' => $user['id'], 'exp' => time() + 86400]))
        ], 'Login successful');
        
    } else {
        sendError('Invalid action or method');
    }
    
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
}
?>