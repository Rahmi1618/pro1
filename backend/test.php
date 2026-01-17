<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PharmaCare Backend Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #0056b3;
        }
        .result {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            white-space: pre-wrap;
            font-family: monospace;
            max-height: 400px;
            overflow-y: auto;
        }
        .success {
            background: #d4edda;
            border-color: #c3e6cb;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            border-color: #f5c6cb;
            color: #721c24;
        }
        input, select {
            padding: 8px;
            margin: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        .form-group {
            margin: 10px 0;
        }
        label {
            display: inline-block;
            width: 120px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏥 PharmaCare Backend Test</h1>
        <p>Test the new simplified backend system.</p>
        <div id="status">Ready to test...</div>
    </div>

    <div class="container">
        <h2>👤 Authentication Test</h2>
        
        <h3>Register User</h3>
        <div class="form-group">
            <label>Username:</label>
            <input type="text" id="reg-username" value="testuser">
        </div>
        <div class="form-group">
            <label>First Name:</label>
            <input type="text" id="reg-first-name" value="Test">
        </div>
        <div class="form-group">
            <label>Last Name:</label>
            <input type="text" id="reg-last-name" value="User">
        </div>
        <div class="form-group">
            <label>Email:</label>
            <input type="email" id="reg-email" value="test@example.com">
        </div>
        <div class="form-group">
            <label>Password:</label>
            <input type="password" id="reg-password" value="password123">
        </div>
        <div class="form-group">
            <label>Phone:</label>
            <input type="text" id="reg-phone" value="+251911234567">
        </div>
        <button onclick="testRegister()">Register</button>
        <div id="register-result" class="result" style="display: none;"></div>
        
        <h3>Login User</h3>
        <div class="form-group">
            <label>Username:</label>
            <input type="text" id="login-username" value="testuser">
        </div>
        <div class="form-group">
            <label>Password:</label>
            <input type="password" id="login-password" value="password123">
        </div>
        <button onclick="testLogin()">Login</button>
        <div id="login-result" class="result" style="display: none;"></div>
    </div>

    <div class="container">
        <h2>💊 Medicine Search Test</h2>
        <div class="form-group">
            <label>Search:</label>
            <input type="text" id="medicine-search" value="paracetamol">
        </div>
        <button onclick="testMedicineSearch()">Search Medicines</button>
        <div id="medicine-result" class="result" style="display: none;"></div>
    </div>

    <div class="container">
        <h2>🏥 Pharmacy List Test</h2>
        <button onclick="testPharmacyList()">Get Pharmacies</button>
        <div id="pharmacy-result" class="result" style="display: none;"></div>
    </div>

    <div class="container">
        <h2>🛒 Order Test (Login Required)</h2>
        <div class="form-group">
            <label>Pharmacy ID:</label>
            <input type="number" id="order-pharmacy" value="1">
        </div>
        <div class="form-group">
            <label>Medicine ID:</label>
            <input type="number" id="order-medicine" value="1">
        </div>
        <div class="form-group">
            <label>Quantity:</label>
            <input type="number" id="order-quantity" value="2">
        </div>
        <div class="form-group">
            <label>Address:</label>
            <input type="text" id="order-address" value="Kombolcha, Ethiopia">
        </div>
        <button onclick="testCreateOrder()">Create Order</button>
        <div id="order-result" class="result" style="display: none;"></div>
    </div>

    <script>
        let authToken = null;

        async function testRegister() {
            const resultDiv = document.getElementById('register-result');
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Testing registration...';
            resultDiv.className = 'result';
            
            const data = {
                username: document.getElementById('reg-username').value,
                first_name: document.getElementById('reg-first-name').value,
                last_name: document.getElementById('reg-last-name').value,
                email: document.getElementById('reg-email').value,
                password: document.getElementById('reg-password').value,
                phone: document.getElementById('reg-phone').value
            };
            
            try {
                const response = await fetch('auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                resultDiv.textContent = JSON.stringify(result, null, 2);
                resultDiv.className = result.success ? 'result success' : 'result error';
                
                if (result.success && result.data.token) {
                    authToken = result.data.token;
                }
                
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
                resultDiv.className = 'result error';
            }
        }

        async function testLogin() {
            const resultDiv = document.getElementById('login-result');
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Testing login...';
            resultDiv.className = 'result';
            
            const data = {
                username: document.getElementById('login-username').value,
                password: document.getElementById('login-password').value
            };
            
            try {
                const response = await fetch('auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                resultDiv.textContent = JSON.stringify(result, null, 2);
                resultDiv.className = result.success ? 'result success' : 'result error';
                
                if (result.success && result.data.token) {
                    authToken = result.data.token;
                }
                
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
                resultDiv.className = 'result error';
            }
        }

        async function testMedicineSearch() {
            const resultDiv = document.getElementById('medicine-result');
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Searching medicines...';
            resultDiv.className = 'result';
            
            const query = document.getElementById('medicine-search').value;
            
            try {
                const response = await fetch(`medicines.php?action=search&q=${encodeURIComponent(query)}`);
                const result = await response.json();
                
                resultDiv.textContent = JSON.stringify(result, null, 2);
                resultDiv.className = result.success ? 'result success' : 'result error';
                
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
                resultDiv.className = 'result error';
            }
        }

        async function testPharmacyList() {
            const resultDiv = document.getElementById('pharmacy-result');
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Getting pharmacies...';
            resultDiv.className = 'result';
            
            try {
                const response = await fetch('pharmacies.php?action=list');
                const result = await response.json();
                
                resultDiv.textContent = JSON.stringify(result, null, 2);
                resultDiv.className = result.success ? 'result success' : 'result error';
                
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
                resultDiv.className = 'result error';
            }
        }

        async function testCreateOrder() {
            const resultDiv = document.getElementById('order-result');
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Creating order...';
            resultDiv.className = 'result';
            
            if (!authToken) {
                resultDiv.textContent = 'Please login first!';
                resultDiv.className = 'result error';
                return;
            }
            
            const data = {
                pharmacy_id: document.getElementById('order-pharmacy').value,
                medicine_id: document.getElementById('order-medicine').value,
                quantity: document.getElementById('order-quantity').value,
                delivery_address: document.getElementById('order-address').value,
                payment_method: 'telebirr'
            };
            
            try {
                const response = await fetch('orders.php?action=create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                resultDiv.textContent = JSON.stringify(result, null, 2);
                resultDiv.className = result.success ? 'result success' : 'result error';
                
            } catch (error) {
                resultDiv.textContent = 'Error: ' + error.message;
                resultDiv.className = 'result error';
            }
        }

        // Test database connection on page load
        window.addEventListener('load', async () => {
            try {
                const response = await fetch('pharmacies.php?action=list&limit=1');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('status').textContent = '✅ Backend is working! Database connected.';
                    document.getElementById('status').style.color = 'green';
                } else {
                    throw new Error('Backend error');
                }
            } catch (error) {
                document.getElementById('status').textContent = '❌ Backend connection failed. Check XAMPP and database setup.';
                document.getElementById('status').style.color = 'red';
            }
        });
    </script>
</body>
</html>