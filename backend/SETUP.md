# PharmaCare Backend Setup Guide

## 🚀 Quick Setup for XAMPP

### Prerequisites
- XAMPP installed with Apache and MySQL running
- PHP 7.4 or higher
- MySQL 5.7 or higher

### Step 1: Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `pharmacare`
3. Import the database schema:
   - Click on the `pharmacare` database
   - Go to "Import" tab
   - Select `backend/database.sql` file
   - Click "Go" to import

### Step 2: File Setup
1. Copy the entire project to your XAMPP htdocs directory:
   ```
   C:\xampp\htdocs\pharmacare\
   ```

2. Ensure the backend folder structure looks like this:
   ```
   pharmacare/
   ├── backend/
   │   ├── api/
   │   │   ├── auth/
   │   │   │   ├── register.php
   │   │   │   ├── login.php
   │   │   │   └── logout.php
   │   │   ├── medicines/
   │   │   │   └── search.php
   │   │   ├── orders/
   │   │   │   ├── create.php
   │   │   │   └── list.php
   │   │   ├── pharmacies/
   │   │   │   └── list.php
   │   │   └── user/
   │   │       └── profile.php
   │   ├── config/
   │   │   └── database.php
   │   ├── database.sql
   │   ├── test-api.php
   │   └── SETUP.md
   ```

### Step 3: Configuration
1. Open `backend/config/database.php`
2. Verify the database configuration:
   ```php
   private $host = 'localhost';
   private $db_name = 'pharmacare';
   private $username = 'root';
   private $password = '';
   ```

### Step 4: Test the Setup
1. Open your browser and go to:
   ```
   http://localhost/pharmacare/backend/test-api.php
   ```

2. You should see the API test interface
3. Test the endpoints in this order:
   - Register a new user
   - Login with the user
   - Get pharmacies list
   - Search medicines
   - Create an order (requires login)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register.php` - Register new user
- `POST /api/auth/login.php` - User login
- `POST /api/auth/logout.php` - User logout (requires auth)

### User Management
- `GET /api/user/profile.php` - Get user profile (requires auth)
- `PUT /api/user/profile.php` - Update user profile (requires auth)

### Pharmacies
- `GET /api/pharmacies/list.php` - Get pharmacies list with filters

### Medicines
- `POST /api/medicines/search.php` - Search medicines with filters

### Orders
- `POST /api/orders/create.php` - Create new order (requires auth)
- `GET /api/orders/list.php` - Get user orders (requires auth)

## 🔧 Configuration Options

### Database Settings
Edit `backend/config/database.php`:
- `DB_HOST` - Database host (default: localhost)
- `DB_NAME` - Database name (default: pharmacare)
- `DB_USER` - Database username (default: root)
- `DB_PASS` - Database password (default: empty)

### Security Settings
- `JWT_SECRET` - Change this in production
- `JWT_EXPIRE` - Token expiration time (default: 7 days)
- `SESSION_EXPIRE` - Session expiration time (default: 24 hours)

### Application Settings
- `DEBUG_MODE` - Set to false in production
- `DEFAULT_PAGE_SIZE` - Default pagination size (default: 20)
- `MAX_PAGE_SIZE` - Maximum pagination size (default: 100)

## 🗄️ Database Schema

### Main Tables
- `users` - User accounts and profiles
- `pharmacies` - Pharmacy information and locations
- `medicines` - Medicine catalog
- `pharmacy_medicines` - Pharmacy inventory
- `orders` - Customer orders
- `order_items` - Order line items
- `reviews` - Pharmacy reviews
- `categories` - Medicine categories
- `user_sessions` - User session management
- `notifications` - User notifications

### Sample Data
The database includes sample data for:
- 6 pharmacies in Kombolcha, Ethiopia
- 8 common medicines
- Medicine categories
- Pharmacy inventory with realistic pricing

## 🔍 Testing

### Manual Testing
Use the test interface at `http://localhost/pharmacare/backend/test-api.php`

### API Testing with Postman
1. Import the API endpoints
2. Set base URL: `http://localhost/pharmacare/backend/api`
3. For authenticated endpoints, add Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

### Sample API Calls

#### Register User
```bash
POST /api/auth/register.php
Content-Type: application/json

{
  "username": "testuser",
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "+251911234567",
  "address": "Kombolcha, Ethiopia"
}
```

#### Search Medicines
```bash
POST /api/medicines/search.php
Content-Type: application/json

{
  "query": "paracetamol",
  "category": "Pain Relief",
  "in_stock_only": true,
  "limit": 10
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if MySQL is running in XAMPP
   - Verify database credentials in `config/database.php`
   - Ensure `pharmacare` database exists

2. **404 Not Found**
   - Check if files are in the correct htdocs directory
   - Verify Apache is running in XAMPP
   - Check file permissions

3. **CORS Errors**
   - The API includes CORS headers
   - If issues persist, check browser console for specific errors

4. **Authentication Errors**
   - Ensure you're sending the JWT token in the Authorization header
   - Check if the token hasn't expired
   - Verify the JWT_SECRET in config

### Debug Mode
Set `DEBUG_MODE = true` in `config/database.php` to see detailed error messages.

## 🔒 Security Notes

### For Production
1. Change `JWT_SECRET` to a strong, unique value
2. Set `DEBUG_MODE = false`
3. Use HTTPS
4. Set proper file permissions
5. Use environment variables for sensitive data
6. Enable MySQL strict mode
7. Implement rate limiting
8. Add input validation and sanitization
9. Use prepared statements (already implemented)
10. Regular security updates

### Current Security Features
- Password hashing with PHP's `password_hash()`
- JWT token authentication
- SQL injection prevention with prepared statements
- Input sanitization
- CORS headers
- Session management
- Activity logging

## 📊 Performance

### Optimization Tips
1. Add database indexes (already included)
2. Use connection pooling
3. Implement caching (Redis/Memcached)
4. Optimize queries
5. Use CDN for static assets
6. Enable gzip compression
7. Monitor slow queries

### Current Optimizations
- Database indexes on frequently queried fields
- Efficient pagination
- Optimized JOIN queries
- Connection reuse
- Prepared statement caching

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API test interface
3. Check PHP error logs in XAMPP
4. Verify database structure matches schema

## 🔄 Updates

To update the backend:
1. Backup your database
2. Replace backend files
3. Run any new database migrations
4. Test all endpoints
5. Update configuration if needed