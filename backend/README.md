# PharmaCare Backend - Simple Setup

## 🚀 Quick Setup for XAMPP

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services

### Step 2: Create Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create new database named `pharmacare`
3. Import the SQL file: `backend/database.sql`

### Step 3: Test Backend
1. Open: http://localhost/pharmacare/backend/test.php
2. Test all functions (register, login, search, etc.)

## 📁 File Structure

```
backend/
├── config.php          # Database configuration
├── auth.php            # User registration & login
├── medicines.php       # Medicine search & info
├── pharmacies.php      # Pharmacy listings
├── orders.php          # Order management
├── database.sql        # Database schema & sample data
├── test.php           # Test interface
└── README.md          # This file
```

## 🔗 API Endpoints

### Authentication
- `POST auth.php?action=register` - Register user
- `POST auth.php?action=login` - Login user

### Medicines
- `GET medicines.php?action=search&q=query` - Search medicines
- `GET medicines.php?action=compare&medicine_id=1` - Compare prices
- `GET medicines.php?action=categories` - Get categories

### Pharmacies
- `GET pharmacies.php?action=list` - Get pharmacy list
- `GET pharmacies.php?action=details&id=1` - Get pharmacy details

### Orders (Requires Authentication)
- `POST orders.php?action=create` - Create order
- `GET orders.php?action=history` - Get order history
- `GET orders.php?action=status&order_id=1` - Get order status

## 🗄️ Database Tables

- **users** - User accounts
- **pharmacies** - Pharmacy information (6 Kombolcha pharmacies)
- **medicines** - Medicine catalog (8 common medicines)
- **pharmacy_medicines** - Inventory & pricing
- **orders** - Order management

## 🧪 Testing

1. **Backend Test**: http://localhost/pharmacare/backend/test.php
2. **Frontend**: http://localhost/pharmacare/
3. **Login Page**: http://localhost/pharmacare/login.html

## 🔧 Configuration

Edit `config.php` to change:
- Database credentials
- Application settings
- Error reporting

## 🚨 Troubleshooting

### Common Issues:
1. **"Database connection failed"**
   - Make sure MySQL is running in XAMPP
   - Check database name is `pharmacare`

2. **"Table doesn't exist"**
   - Import `database.sql` in phpMyAdmin

3. **"CORS errors"**
   - Access via `http://localhost/pharmacare/`
   - Don't open files directly

### Error Logs:
- Check XAMPP error logs
- Enable error reporting in `config.php`

## ✅ Features

- ✅ Simple, clean code structure
- ✅ User registration & authentication
- ✅ Medicine search with real data
- ✅ Pharmacy listings with locations
- ✅ Order management system
- ✅ Ethiopian context (Kombolcha pharmacies)
- ✅ CORS support for frontend
- ✅ Error handling & validation
- ✅ Sample data included

## 🎯 Next Steps

1. Test the backend using `test.php`
2. Use the frontend login/registration
3. Search for medicines
4. Place test orders
5. Customize as needed

The system is now simple, clean, and fully functional!