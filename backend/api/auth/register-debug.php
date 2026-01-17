<?php
/**
 * Debug Version of User Registration API
 * POST /api/auth/register-debug.php
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../config/database.php';

// Set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Debug function
function debugLog($message, $data = null) {
    $log = "[" . date('Y-m-d H:i:s') . "] " . $message;
    if ($data !== null) {
        $log .= " | Data: " . json_encode($data);
    }
    error_log($log);
    return $log;
}

// Response function with debug info
function debugResponse($data, $status_code = 200, $debug_info = []) {
    http_response_code($status_code);
    $response = [
        'success' => $status_code < 400,
        'data' => $data,
        'debug' => $debug_info,
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $_SERVER['REQUEST_METHOD'],
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set'
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

$debug_info = [];

try {
    $debug_info[] = debugLog("Registration debug started");
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        debugResponse(['error' => 'Method not allowed'], 405, $debug_info);
    }
    
    $debug_info[] = debugLog("Method check passed");
    
    // Get input data
    $input_raw = file_get_contents('php://input');
    $debug_info[] = debugLog("Raw input received", $input_raw);
    
    if (empty($input_raw)) {
        debugResponse(['error' => 'No input data received'], 400, $debug_info);
    }
    
    $input = json_decode($input_raw, true);
    $debug_info[] = debugLog("JSON decoded", $input);
    
    if (!$input) {
        debugResponse(['error' => 'Invalid JSON input', 'json_error' => json_last_error_msg()], 400, $debug_info);
    }
    
    // Sanitize input
    $input = array_map(function($value) {
        return is_string($value) ? htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8') : $value;
    }, $input);
    
    $debug_info[] = debugLog("Input sanitized", $input);
    
    // Validate required fields
    $required_fields = ['username', 'first_name', 'last_name', 'email', 'password'];
    $missing_fields = [];
    
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            $missing_fields[] = $field;
        }
    }
    
    if (!empty($missing_fields)) {
        debugResponse(['error' => 'Missing required fields', 'missing' => $missing_fields], 400, $debug_info);
    }
    
    $debug_info[] = debugLog("Required fields validation passed");
    
    // Extract data
    $username = $input['username'];
    $first_name = $input['first_name'];
    $last_name = $input['last_name'];
    $email = $input['email'];
    $password = $input['password'];
    $phone = $input['phone'] ?? null;
    $address = $input['address'] ?? null;
    $date_of_birth = $input['date_of_birth'] ?? null;
    $gender = $input['gender'] ?? null;
    
    $debug_info[] = debugLog("Data extracted successfully");
    
    // Validate input
    if (strlen($username) < 3) {
        debugResponse(['error' => 'Username must be at least 3 characters long'], 400, $debug_info);
    }
    
    if (strlen($password) < 6) {
        debugResponse(['error' => 'Password must be at least 6 characters long'], 400, $debug_info);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        debugResponse(['error' => 'Invalid email format'], 400, $debug_info);
    }
    
    if ($gender && !in_array($gender, ['male', 'female', 'other'])) {
        debugResponse(['error' => 'Invalid gender value'], 400, $debug_info);
    }
    
    $debug_info[] = debugLog("Input validation passed");
    
    // Connect to database
    try {
        $db = new Database();
        $conn = $db->getConnection();
        $debug_info[] = debugLog("Database connection successful");
    } catch (Exception $e) {
        debugResponse(['error' => 'Database connection failed', 'details' => $e->getMessage()], 500, $debug_info);
    }
    
    // Check if username already exists
    try {
        $sql = "SELECT user_id FROM users WHERE username = :username";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':username' => $username]);
        
        if ($stmt->fetch()) {
            debugResponse(['error' => 'Username already exists'], 409, $debug_info);
        }
        
        $debug_info[] = debugLog("Username uniqueness check passed");
    } catch (PDOException $e) {
        debugResponse(['error' => 'Database error during username check', 'details' => $e->getMessage()], 500, $debug_info);
    }
    
    // Check if email already exists
    try {
        $sql = "SELECT user_id FROM users WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':email' => $email]);
        
        if ($stmt->fetch()) {
            debugResponse(['error' => 'Email already exists'], 409, $debug_info);
        }
        
        $debug_info[] = debugLog("Email uniqueness check passed");
    } catch (PDOException $e) {
        debugResponse(['error' => 'Database error during email check', 'details' => $e->getMessage()], 500, $debug_info);
    }
    
    // Hash password
    try {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $debug_info[] = debugLog("Password hashed successfully");
    } catch (Exception $e) {
        debugResponse(['error' => 'Password hashing failed', 'details' => $e->getMessage()], 500, $debug_info);
    }
    
    // Insert new user
    try {
        $sql = "INSERT INTO users (username, first_name, last_name, email, password, phone, address, date_of_birth, gender) 
                VALUES (:username, :first_name, :last_name, :email, :password, :phone, :address, :date_of_birth, :gender)";
        
        $stmt = $conn->prepare($sql);
        $params = [
            ':username' => $username,
            ':first_name' => $first_name,
            ':last_name' => $last_name,
            ':email' => $email,
            ':password' => $hashed_password,
            ':phone' => $phone,
            ':address' => $address,
            ':date_of_birth' => $date_of_birth,
            ':gender' => $gender
        ];
        
        $debug_info[] = debugLog("Executing insert query", $params);
        
        $result = $stmt->execute($params);
        
        if (!$result) {
            debugResponse(['error' => 'Failed to insert user', 'stmt_error' => $stmt->errorInfo()], 500, $debug_info);
        }
        
        $user_id = $conn->lastInsertId();
        $debug_info[] = debugLog("User inserted successfully", ['user_id' => $user_id]);
        
    } catch (PDOException $e) {
        debugResponse(['error' => 'Database error during user insertion', 'details' => $e->getMessage(), 'sql_state' => $e->getCode()], 500, $debug_info);
    }
    
    // Generate JWT token (simplified for debug)
    $token_payload = [
        'user_id' => $user_id,
        'username' => $username,
        'email' => $email,
        'iat' => time(),
        'exp' => time() + (7 * 24 * 60 * 60) // 7 days
    ];
    
    $token = base64_encode(json_encode($token_payload));
    $debug_info[] = debugLog("Token generated");
    
    // Create session (simplified for debug)
    $session_id = bin2hex(random_bytes(16));
    $expires_at = date('Y-m-d H:i:s', time() + (24 * 60 * 60)); // 24 hours
    
    try {
        $sql = "INSERT INTO user_sessions (session_id, user_id, ip_address, user_agent, expires_at) 
                VALUES (:session_id, :user_id, :ip_address, :user_agent, :expires_at)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':session_id' => $session_id,
            ':user_id' => $user_id,
            ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
            ':expires_at' => $expires_at
        ]);
        
        $debug_info[] = debugLog("Session created successfully");
    } catch (PDOException $e) {
        $debug_info[] = debugLog("Session creation failed", $e->getMessage());
        // Continue anyway, session is not critical for registration
    }
    
    // Return success response
    $response_data = [
        'message' => 'User registered successfully',
        'user' => [
            'user_id' => (int)$user_id,
            'username' => $username,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'date_of_birth' => $date_of_birth,
            'gender' => $gender
        ],
        'token' => $token,
        'session_id' => $session_id,
        'expires_at' => $expires_at
    ];
    
    $debug_info[] = debugLog("Registration completed successfully");
    
    debugResponse($response_data, 200, $debug_info);
    
} catch (Exception $e) {
    $debug_info[] = debugLog("Fatal error occurred", $e->getMessage());
    debugResponse(['error' => 'An unexpected error occurred', 'details' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500, $debug_info);
}
?>