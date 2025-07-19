# SRR Farms Backend API

A comprehensive e-commerce backend for SRR Farms ghee products.

## Features

- **Product Management**: CRUD operations for products with inventory tracking
- **Order Processing**: Complete order lifecycle management
- **Customer Management**: Customer profiles and order history
- **Inventory Management**: Stock tracking and low-stock alerts
- **Analytics**: Sales and business analytics
- **Notifications**: Email notifications for orders and alerts

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Make sure MongoDB is running
   npm run seed  # Seed initial data
   ```

4. **Start Server**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/customer/:email` - Get customer orders

### Customers
- `GET /api/customers` - Get all customers (Admin)
- `GET /api/customers/:id` - Get single customer
- `GET /api/customers/email/:email` - Get customer by email
- `PUT /api/customers/:id` - Update customer

### Inventory
- `GET /api/inventory` - Get inventory overview
- `PUT /api/inventory/:id/restock` - Restock product
- `GET /api/inventory/alerts` - Get low stock alerts

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/sales` - Sales analytics

### Notifications
- `POST /api/notifications/order-confirmation` - Send order confirmation
- `POST /api/notifications/status-update` - Send status update
- `POST /api/notifications/low-stock` - Send low stock alert

## TODO - Remaining Work

### 1. Authentication & Authorization
```javascript
// TODO: Implement JWT-based authentication
// - Admin login/logout
// - Customer authentication (optional)
// - Protected routes middleware
// - Role-based access control
```

### 2. Payment Integration
```javascript
// TODO: Integrate payment gateway
// - Stripe/Razorpay integration
// - Payment verification
// - Webhook handling
// - Refund processing
```

### 3. File Upload
```javascript
// TODO: Implement file upload for product images
// - Multer configuration
// - Image optimization
// - Cloud storage (AWS S3/Cloudinary)
// - Multiple image support
```

### 4. Advanced Features
```javascript
// TODO: Additional features
// - Search functionality
// - Product reviews and ratings
// - Wishlist/favorites
// - Discount codes/coupons
// - Bulk order processing
```

### 5. Monitoring & Logging
```javascript
// TODO: Add monitoring
// - Request logging
// - Error tracking (Sentry)
// - Performance monitoring
// - Health checks
```

## Database Schema

### Product
- Basic info (name, description, price)
- Inventory (stock, inStock status)
- Media (images)
- Metadata (rating, reviews, benefits)

### Order
- Customer information
- Order items with quantities
- Status tracking
- Payment information

### Customer
- Profile information
- Order history
- Preferences and favorites

## Security Features

- Helmet.js for security headers
- Rate limiting
- CORS configuration
- Input validation with Joi
- MongoDB injection protection

## Development

```bash
npm run dev     # Start with nodemon
npm test        # Run tests
npm run lint    # Code linting
```

## Deployment

1. Set production environment variables
2. Configure MongoDB Atlas
3. Set up email service
4. Deploy to your preferred platform (Heroku, AWS, etc.)