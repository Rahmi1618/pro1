# 🏥 PharmaCare - Complete Pharmacy Management System

PharmaCare is a comprehensive web-based pharmacy management system built for Ethiopian pharmacies, specifically designed for Kombolcha city. The system provides a complete solution for customers to find pharmacies, search medicines, place orders, and manage their healthcare needs online.

## ✨ Features

### 🎯 Frontend Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Interactive Maps**: Google Maps integration showing Kombolcha pharmacies
- **Medicine Search**: Advanced search with filters and categories
- **Order Management**: Complete order placement and tracking system
- **User Authentication**: Secure login and registration system
- **Pharmacy Listings**: Detailed pharmacy information with ratings and reviews
- **Mobile Navigation**: Hamburger menu for mobile devices

### 🔧 Backend Features
- **RESTful API**: Complete PHP/MySQL backend with JWT authentication
- **User Management**: Registration, login, profile management
- **Pharmacy Management**: Location-based pharmacy search with distance calculation
- **Medicine Catalog**: Comprehensive medicine database with inventory tracking
- **Order Processing**: Complete order lifecycle management
- **Security**: Password hashing, JWT tokens, SQL injection prevention
- **Database**: Optimized MySQL schema with indexes and triggers

## 🚀 Quick Start

### Prerequisites
- XAMPP (Apache + MySQL + PHP 7.4+)
- Modern web browser
- Internet connection (for Google Maps)

### Installation
1. **Download and Install XAMPP**
   - Download from [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - Install and start Apache and MySQL services

2. **Setup Project**
   ```bash
   # Copy project to XAMPP htdocs
   C:\xampp\htdocs\pharmacare\
   ```

3. **Database Setup**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Create database named `pharmacare`
   - Import `backend/database.sql`

4. **Access Application**
   - Frontend: http://localhost/pharmacare/
   - Backend API Test: http://localhost/pharmacare/backend/test-api.php

## 📁 Project Structure

```
pharmacare/
├── 📄 index.html                 # Main homepage
├── 📄 login.html                 # User login page
├── 📁 components/                # Page components
│   ├── medicines.html
│   ├── orders.html
│   └── pharmacies.html
├── 📁 pages/                     # Additional pages
│   ├── help-center.html
│   ├── contact-us.html
│   ├── faq.html
│   └── ...
├── 📁 css/                       # Stylesheets
│   ├── style.css                 # Main styles
│   ├── pages.css                 # Page-specific styles
│   └── ...
├── 📁 js/                        # JavaScript files
│   ├── app.js                    # Main application logic
│   ├── pages.js                  # Page-specific scripts
│   └── ...
├── 📁 backend/                   # PHP Backend
│   ├── 📁 api/                   # API endpoints
│   │   ├── auth/                 # Authentication
│   │   ├── medicines/            # Medicine search
│   │   ├── orders/               # Order management
│   │   ├── pharmacies/           # Pharmacy listings
│   │   └── user/                 # User profile
│   ├── 📁 config/                # Configuration
│   │   └── database.php
│   ├── database.sql              # Database schema
│   ├── test-api.php              # API testing interface
│   └── SETUP.md                  # Backend setup guide
└── 📄 README.md                  # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register.php` - User registration
- `POST /api/auth/login.php` - User login
- `POST /api/auth/logout.php` - User logout

### User Management
- `GET /api/user/profile.php` - Get user profile
- `PUT /api/user/profile.php` - Update user profile

### Pharmacies
- `GET /api/pharmacies/list.php` - Get pharmacies with location-based search

### Medicines
- `POST /api/medicines/search.php` - Search medicines with advanced filters

### Orders
- `POST /api/orders/create.php` - Create new order
- `GET /api/orders/list.php` - Get user order history

## 🗄️ Database Schema

### Key Tables
- **users**: User accounts and profiles
- **pharmacies**: Pharmacy information and locations (Kombolcha-focused)
- **medicines**: Medicine catalog with detailed information
- **pharmacy_medicines**: Inventory management
- **orders**: Order management and tracking
- **reviews**: Pharmacy ratings and reviews

### Sample Data
- 6 realistic Kombolcha pharmacies with GPS coordinates
- 8 common medicines with proper categorization
- Complete inventory with pricing
- Medicine categories and classifications

## 🎨 Design Features

### Modern UI Components
- **Hero Section**: Animated background with search functionality
- **Feature Cards**: Interactive service highlights
- **Testimonial Slider**: Auto-playing customer reviews
- **Statistics Counter**: Animated number counters
- **Responsive Footer**: Comprehensive links and information
- **Mobile Navigation**: Smooth hamburger menu

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔒 Security Features

- **Password Security**: bcrypt hashing
- **JWT Authentication**: Secure token-based auth
- **SQL Injection Prevention**: Prepared statements
- **Input Sanitization**: XSS prevention
- **CORS Headers**: Cross-origin security
- **Session Management**: Secure session handling

## 🌍 Ethiopian Context

### Localization
- **Kombolcha Focus**: Specifically designed for Kombolcha city
- **Local Pharmacies**: Real pharmacy locations and information
- **Ethiopian Birr**: Local currency support
- **TeleBirr Integration**: Popular Ethiopian payment method
- **Local Phone Formats**: Ethiopian phone number validation

### Cultural Considerations
- **Family Healthcare**: Family-focused features
- **Community Trust**: Pharmacy ratings and reviews
- **Accessibility**: Simple, clear interface for all users
- **Local Languages**: Ready for Amharic localization

## 🧪 Testing

### Frontend Testing
- Cross-browser compatibility
- Mobile responsiveness
- Interactive element testing
- Form validation testing

### Backend Testing
- API endpoint testing via test interface
- Database integrity testing
- Authentication flow testing
- Error handling validation

### Test Interface
Access the comprehensive API test interface at:
`http://localhost/pharmacare/backend/test-api.php`

## 📱 Mobile Features

- **Responsive Design**: Perfect mobile experience
- **Touch Navigation**: Optimized for touch devices
- **Mobile Maps**: Touch-friendly Google Maps integration
- **Quick Actions**: Easy access to key features
- **Offline Capability**: Basic functionality without internet

## 🔧 Configuration

### Environment Setup
- Development: Set `DEBUG_MODE = true`
- Production: Set `DEBUG_MODE = false`
- Security: Change `JWT_SECRET` in production

### Customization
- **Colors**: Modify CSS custom properties
- **Branding**: Update logos and text
- **Features**: Enable/disable components
- **Localization**: Add language support

## 📈 Performance

### Optimization Features
- **Database Indexes**: Optimized query performance
- **Lazy Loading**: Efficient resource loading
- **Minified Assets**: Compressed CSS/JS
- **Caching Headers**: Browser caching optimization
- **Efficient Queries**: Optimized database operations

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Set up local XAMPP environment
3. Import database schema
4. Make changes and test
5. Submit pull request

### Code Standards
- **PHP**: PSR-12 coding standards
- **JavaScript**: ES6+ features
- **CSS**: BEM methodology
- **Database**: Normalized schema design

## 📞 Support

### Getting Help
1. Check the `backend/SETUP.md` for detailed setup instructions
2. Use the API test interface for debugging
3. Review browser console for frontend issues
4. Check PHP error logs for backend issues

### Common Issues
- **Database Connection**: Verify XAMPP MySQL is running
- **API Errors**: Check authentication tokens
- **Maps Not Loading**: Verify internet connection
- **Mobile Issues**: Test responsive breakpoints

## 🔄 Updates and Maintenance

### Regular Tasks
- Database backup and maintenance
- Security updates and patches
- Performance monitoring
- User feedback integration

### Version Control
- Use Git for version control
- Tag releases for stability
- Document changes in changelog
- Test before deployment

## 📋 License

This project is developed for educational and commercial use. Please ensure compliance with all third-party services (Google Maps, etc.) terms of service.

## 🎯 Future Enhancements

### Planned Features
- **Real-time Chat**: Customer support integration
- **Push Notifications**: Order status updates
- **Advanced Analytics**: Usage statistics and insights
- **Multi-language**: Amharic and other local languages
- **Payment Gateway**: Integration with Ethiopian payment systems
- **Inventory Management**: Advanced pharmacy inventory tools

### Technical Improvements
- **Caching Layer**: Redis/Memcached integration
- **API Rate Limiting**: Enhanced security
- **Real-time Updates**: WebSocket integration
- **Mobile App**: Native mobile applications
- **Advanced Search**: Elasticsearch integration

---

**Built with ❤️ for Ethiopian Healthcare**

*PharmaCare - Making healthcare accessible, one click at a time.*