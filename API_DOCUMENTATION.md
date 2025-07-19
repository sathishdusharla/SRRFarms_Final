# API Documentation

## 🔗 Base URL
```
Development: http://localhost:3001/api
Production: https://your-backend-domain.com/api
```

## 🔐 Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## 📋 Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {} // Response data (when applicable)
}
```

## 🔒 Authentication Endpoints

### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "address": {
    "street": "123 Main St",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": "500001"
  },
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "isAdmin": false
    }
  }
}
```

### POST /auth/signin
Login with existing credentials.

**Request Body:**
```json
{
  "identifier": "john@example.com", // email or phone
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "isAdmin": false
    }
  }
}
```

### POST /auth/signout
Logout user (invalidate token).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "identifier": "john@example.com" // email or phone
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset request submitted"
}
```

### GET /auth/verify-token
Verify if token is valid and get user info.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "isAdmin": false
    }
  }
}
```

## 📦 Product Endpoints

### GET /products
Get all products with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by name or description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product-id",
        "name": "A2 Cow Milk",
        "description": "Fresh organic A2 cow milk",
        "price": 60,
        "category": "dairy",
        "image": "image-url",
        "inStock": true,
        "quantity": 100
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /products/:id
Get single product by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "product-id",
      "name": "A2 Cow Milk",
      "description": "Fresh organic A2 cow milk",
      "price": 60,
      "category": "dairy",
      "image": "image-url",
      "inStock": true,
      "quantity": 100
    }
  }
}
```

## 🛒 Order Endpoints

### POST /orders
Create a new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product-id",
      "quantity": 2,
      "price": 60
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": "500001"
  },
  "paymentMethod": "cash_on_delivery",
  "totalAmount": 120,
  "isGuestOrder": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "_id": "order-id",
      "orderNumber": "ORD-001",
      "status": "pending",
      "totalAmount": 120,
      "createdAt": "2025-07-20T00:00:00.000Z"
    }
  }
}
```

### GET /orders
Get user's orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "order-id",
        "orderNumber": "ORD-001",
        "status": "pending",
        "totalAmount": 120,
        "items": [...],
        "createdAt": "2025-07-20T00:00:00.000Z"
      }
    ],
    "pagination": {...}
  }
}
```

### GET /orders/:id
Get single order by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "order-id",
      "orderNumber": "ORD-001",
      "status": "pending",
      "totalAmount": 120,
      "items": [...],
      "shippingAddress": {...},
      "createdAt": "2025-07-20T00:00:00.000Z"
    }
  }
}
```

## 👤 User Profile Endpoints

### GET /user/profile
Get user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user-id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": {...},
      "dateOfBirth": "1990-01-01",
      "gender": "male"
    }
  }
}
```

### PUT /user/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Smith",
  "phone": "9876543211",
  "address": {
    "street": "456 New St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {...}
  }
}
```

## 🔧 Admin Endpoints

All admin endpoints require admin privileges (`isAdmin: true`).

### GET /admin/users
Get all users (admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `search` (optional): Search by name, email, or phone
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user-id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "isAdmin": false,
        "isVerified": true,
        "createdAt": "2025-07-20T00:00:00.000Z"
      }
    ],
    "pagination": {...}
  }
}
```

### GET /admin/orders
Get all orders (admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `search` (optional): Search by order number or user
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "order-id",
        "orderNumber": "ORD-001",
        "userId": {...},
        "status": "pending",
        "totalAmount": 120,
        "createdAt": "2025-07-20T00:00:00.000Z"
      }
    ],
    "pagination": {...}
  }
}
```

### PUT /admin/orders/:id
Update order status (admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "status": "confirmed", // pending, confirmed, shipped, delivered, cancelled
  "adminNotes": "Order confirmed and processing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {...}
  }
}
```

### GET /admin/password-resets
Get password reset requests (admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `status` (optional): pending, completed, rejected, all
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "request-id",
        "userId": "user-id",
        "userEmail": "john@example.com",
        "userPhone": "9876543210",
        "userFullName": "John Doe",
        "status": "pending",
        "adminNotes": "",
        "createdAt": "2025-07-20T00:00:00.000Z"
      }
    ],
    "pagination": {...}
  }
}
```

### PUT /admin/password-reset/:id
Handle password reset request (admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "action": "approve", // approve or reject
  "adminNotes": "Password reset approved"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset request processed successfully"
}
```

### GET /admin/analytics
Get admin dashboard analytics (admin only).

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalOrders": 75,
    "pendingOrders": 10,
    "totalRevenue": 45000,
    "newUsersThisMonth": 20,
    "ordersThisMonth": 35
  }
}
```

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error: Email is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔍 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Admin endpoints**: 200 requests per 15 minutes per admin user

## 🧪 Testing

### Using curl
```bash
# Login
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@srrfarms.com","password":"admin123"}'

# Get products
curl -X GET http://localhost:3001/api/products

# Get user profile (with token)
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer your-jwt-token"
```

### Using Postman
Import the API collection with these endpoints for easy testing.

---

**📋 Note**: All timestamps are in ISO 8601 format (UTC).  
**🔒 Security**: Never expose sensitive data in API responses.
