<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$database = new Database();
$db = $database->getConnection();

$input = json_decode(file_get_contents('php://input'), true);
$message = $input['message'] ?? '';
$userId = $input['user_id'] ?? null;

if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Message is required']);
    exit;
}

// Log the conversation for learning
if ($userId) {
    logConversation($db, $userId, $message);
}

// Process the message and generate response
$response = processMessage($db, $message, $userId);

echo json_encode([
    'success' => true,
    'response' => $response,
    'timestamp' => date('Y-m-d H:i:s')
]);

function processMessage($db, $message, $userId) {
    $lowerMessage = strtolower($message);
    
    // Medicine search queries
    if (strpos($lowerMessage, 'find') !== false || strpos($lowerMessage, 'search') !== false) {
        return handleMedicineSearch($db, $message);
    }
    
    // Price comparison queries
    if (strpos($lowerMessage, 'price') !== false || strpos($lowerMessage, 'compare') !== false) {
        return handlePriceComparison($db, $message);
    }
    
    // Pharmacy location queries
    if (strpos($lowerMessage, 'pharmacy') !== false || strpos($lowerMessage, 'location') !== false) {
        return handlePharmacyQuery($db);
    }
    
    // Medicine information queries
    if (strpos($lowerMessage, 'paracetamol') !== false) {
        return getMedicineDetails($db, 'paracetamol');
    }
    
    if (strpos($lowerMessage, 'ibuprofen') !== false) {
        return getMedicineDetails($db, 'ibuprofen');
    }
    
    if (strpos($lowerMessage, 'amoxicillin') !== false) {
        return getMedicineDetails($db, 'amoxicillin');
    }
    
    // Order help
    if (strpos($lowerMessage, 'order') !== false || strpos($lowerMessage, 'buy') !== false) {
        return getOrderHelp();
    }
    
    // Greeting responses
    if (strpos($lowerMessage, 'hello') !== false || strpos($lowerMessage, 'hi') !== false) {
        return "Hello! I'm your PharmaCare AI Assistant. I can help you find medicines, compare prices, locate pharmacies, and assist with orders. What can I help you with today?";
    }
    
    // Help requests
    if (strpos($lowerMessage, 'help') !== false) {
        return getHelpResponse();
    }
    
    // Default response with suggestions
    return getDefaultResponse($db);
}

function handleMedicineSearch($db, $message) {
    // Extract potential medicine names from the message
    $words = explode(' ', strtolower($message));
    $medicineKeywords = ['paracetamol', 'ibuprofen', 'amoxicillin', 'aspirin', 'omeprazole'];
    
    $foundMedicine = null;
    foreach ($words as $word) {
        if (in_array($word, $medicineKeywords)) {
            $foundMedicine = $word;
            break;
        }
    }
    
    if ($foundMedicine) {
        return getMedicineDetails($db, $foundMedicine);
    }
    
    // General search response
    try {
        $query = "SELECT name, brand, category FROM medicines LIMIT 5";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $medicines = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $response = "I can help you find medicines! Here are some popular options:<br><br>";
        foreach ($medicines as $medicine) {
            $response .= "• <strong>{$medicine['name']}</strong> ({$medicine['brand']}) - {$medicine['category']}<br>";
        }
        $response .= "<br>Try asking about a specific medicine like 'Tell me about paracetamol' or 'Find ibuprofen prices'.";
        
        return $response;
    } catch (Exception $e) {
        return "I can help you search for medicines! Try asking about specific medicines like paracetamol, ibuprofen, or amoxicillin.";
    }
}

function handlePriceComparison($db, $message) {
    try {
        $query = "
            SELECT m.name, m.brand, MIN(pm.price) as min_price, MAX(pm.price) as max_price, COUNT(pm.id) as pharmacy_count
            FROM medicines m
            JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            WHERE pm.availability_status != 'Out of Stock'
            GROUP BY m.id
            ORDER BY m.name
            LIMIT 5
        ";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $medicines = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $response = "Here's a price comparison for popular medicines:<br><br>";
        foreach ($medicines as $medicine) {
            $response .= "• <strong>{$medicine['name']}</strong>: ETB {$medicine['min_price']} - ETB {$medicine['max_price']} (Available at {$medicine['pharmacy_count']} pharmacies)<br>";
        }
        $response .= "<br>Would you like detailed price comparison for a specific medicine?";
        
        return $response;
    } catch (Exception $e) {
        return "I can help you compare prices across our partner pharmacies! Ask me about specific medicines for detailed price comparisons.";
    }
}

function handlePharmacyQuery($db) {
    try {
        $query = "SELECT name, address, phone FROM pharmacies WHERE is_active = 1 ORDER BY name";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $pharmacies = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $response = "Here are our partner pharmacies:<br><br>";
        foreach ($pharmacies as $pharmacy) {
            $response .= "📍 <strong>{$pharmacy['name']}</strong><br>";
            $response .= "   Address: {$pharmacy['address']}<br>";
            $response .= "   Phone: {$pharmacy['phone']}<br><br>";
        }
        
        return $response;
    } catch (Exception $e) {
        return "I can help you find nearby pharmacies! We have partnerships with several pharmacies across the city.";
    }
}

function getMedicineDetails($db, $medicineName) {
    try {
        $query = "
            SELECT m.*, MIN(pm.price) as min_price, MAX(pm.price) as max_price
            FROM medicines m
            LEFT JOIN pharmacy_medicines pm ON m.id = pm.medicine_id
            WHERE LOWER(m.name) LIKE :medicine_name OR LOWER(m.brand) LIKE :medicine_name
            GROUP BY m.id
            LIMIT 1
        ";
        
        $stmt = $db->prepare($query);
        $searchTerm = '%' . $medicineName . '%';
        $stmt->bindParam(':medicine_name', $searchTerm);
        $stmt->execute();
        
        $medicine = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($medicine) {
            $response = "<strong>{$medicine['name']}</strong> ({$medicine['brand']})<br><br>";
            $response .= "<strong>Category:</strong> {$medicine['category']}<br>";
            $response .= "<strong>Description:</strong> {$medicine['description']}<br>";
            $response .= "<strong>Active Ingredient:</strong> {$medicine['active_ingredient']}<br>";
            $response .= "<strong>Dosage:</strong> {$medicine['dosage']}<br>";
            
            if ($medicine['min_price']) {
                $response .= "<strong>Price Range:</strong> ETB {$medicine['min_price']} - ETB {$medicine['max_price']}<br>";
            }
            
            $response .= "<br>⚠️ <strong>Important:</strong> Always consult with a healthcare professional before taking any medication.";
            
            return $response;
        } else {
            return "I couldn't find specific information about that medicine. Try asking about paracetamol, ibuprofen, or amoxicillin, or search for medicines using our main search feature.";
        }
    } catch (Exception $e) {
        return "I can provide information about various medicines. Try asking about specific medicines like paracetamol, ibuprofen, or amoxicillin.";
    }
}

function getOrderHelp() {
    return "I can help you place an order! Here's how it works:<br><br>" .
           "1️⃣ <strong>Search:</strong> Use the search bar to find your medicine<br>" .
           "2️⃣ <strong>Compare:</strong> View prices across different pharmacies<br>" .
           "3️⃣ <strong>Select:</strong> Choose your preferred pharmacy<br>" .
           "4️⃣ <strong>Order:</strong> Click 'Order Now' and login if needed<br>" .
           "5️⃣ <strong>Pay:</strong> Complete payment using TeleBirr<br>" .
           "6️⃣ <strong>Deliver:</strong> Get your medicine delivered in 30-45 minutes<br><br>" .
           "Need help finding a specific medicine? Just ask me!";
}

function getHelpResponse() {
    return "I'm here to help! I can assist you with:<br><br>" .
           "🔍 <strong>Medicine Search:</strong> 'Find paracetamol' or 'Search for pain relief'<br>" .
           "💰 <strong>Price Comparison:</strong> 'Compare prices' or 'What's the cheapest option?'<br>" .
           "📍 <strong>Pharmacy Locations:</strong> 'Nearest pharmacy' or 'Pharmacy locations'<br>" .
           "🛒 <strong>Order Help:</strong> 'How to order' or 'Place an order'<br>" .
           "💊 <strong>Medicine Info:</strong> 'Tell me about ibuprofen' or 'Paracetamol dosage'<br>" .
           "💳 <strong>Payment:</strong> 'TeleBirr payment' or 'How to pay'<br><br>" .
           "What would you like help with?";
}

function getDefaultResponse($db) {
    $responses = [
        "I'm here to help with your pharmacy needs! You can ask me about medicines, prices, pharmacy locations, or how to place orders. What would you like to know?",
        "I specialize in helping with pharmacy-related questions. Try asking me about finding medicines, comparing prices, or locating nearby pharmacies.",
        "I can help you with medicine information, price comparisons, pharmacy locations, and order assistance. What specific information do you need?",
        "Feel free to ask me about any medicine, pharmacy services, or how to use our platform. I'm here to make your pharmacy experience easier!"
    ];
    
    return $responses[array_rand($responses)];
}

function logConversation($db, $userId, $message) {
    try {
        $query = "INSERT INTO user_searches (user_id, search_query, search_timestamp) VALUES (:user_id, :message, NOW())";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':message', $message);
        $stmt->execute();
    } catch (Exception $e) {
        // Log error but don't fail the response
        error_log("Failed to log conversation: " . $e->getMessage());
    }
}
?>