# Project Structure

## 📁 Root Directory Structure

```
SRRFarms_Final/
├── 📄 README.md                     # Main project documentation
├── 📄 CHANGELOG.md                  # Version history and changes
├── 📄 DEPLOYMENT.md                 # Deployment instructions
├── 📄 API_DOCUMENTATION.md          # Complete API reference
├── 📄 ADMIN_TEST.md                 # Admin testing instructions
│
├── 📁 src/                          # Frontend source code
│   ├── 📁 components/               # React components
│   │   ├── 📁 auth/                 # Authentication components
│   │   │   ├── LoginModal.tsx       # Login modal component
│   │   │   └── SignupModal.tsx      # Signup modal component
│   │   ├── AdminDashboard.tsx       # Admin dashboard (isolated)
│   │   ├── Header.tsx               # Main navigation header
│   │   ├── HomePage.tsx             # Landing page
│   │   ├── ProductsPage.tsx         # Product catalog
│   │   ├── ProductCard.tsx          # Individual product display
│   │   ├── ProductDetail.tsx        # Product detail modal
│   │   ├── Cart.tsx                 # Shopping cart
│   │   ├── Checkout.tsx             # Checkout process
│   │   ├── OrderSuccess.tsx         # Order confirmation
│   │   ├── UserProfile.tsx          # User profile management
│   │   ├── AboutPage.tsx            # About page
│   │   └── SearchBar.tsx            # Search functionality
│   │
│   ├── 📁 context/                  # React Context providers
│   │   ├── AuthContext.tsx          # Authentication state management
│   │   └── CartContext.tsx          # Shopping cart state management
│   │
│   ├── 📁 config/                   # Configuration files
│   │   └── firebase.ts              # Firebase configuration (legacy)
│   │
│   ├── 📁 data/                     # Static data
│   │   └── products.ts              # Product data definitions
│   │
│   ├── 📁 types/                    # TypeScript type definitions
│   │   └── index.ts                 # Common type definitions
│   │
│   ├── App.tsx                      # Main app component with routing
│   ├── main.tsx                     # App entry point
│   ├── index.css                    # Global styles
│   └── vite-env.d.ts               # Vite type definitions
│
├── 📁 server/                       # Backend source code
│   ├── 📁 models/                   # MongoDB schemas
│   │   ├── User.js                  # User model with authentication
│   │   ├── Product.js               # Product catalog model
│   │   ├── Order.js                 # Order management model
│   │   ├── Customer.js              # Customer data model
│   │   └── PasswordReset.js         # Password reset requests
│   │
│   ├── 📁 routes/                   # API route handlers
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── admin.js                 # Admin-only endpoints
│   │   ├── products.js              # Product management
│   │   ├── orders.js                # Order processing
│   │   ├── customers.js             # Customer management
│   │   ├── inventory.js             # Inventory tracking
│   │   ├── analytics.js             # Analytics data
│   │   └── notifications.js         # Notification system
│   │
│   ├── server.js                    # Express server setup
│   ├── seedData.js                  # Database seeding script
│   ├── addDummyPasswordResets.js    # Test data generator
│   ├── package.json                 # Backend dependencies
│   └── README.md                    # Backend documentation
│
├── 📁 public/                       # Static assets
│   ├── 📄 favicon.ico               # Favicon
│   └── 📁 images/                   # Product images and assets
│
├── 📁 dist/                         # Built frontend (generated)
├── 📁 node_modules/                 # Dependencies (generated)
│
├── 📄 package.json                  # Frontend dependencies
├── 📄 package-lock.json             # Dependency lock file
├── 📄 vite.config.ts               # Vite build configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 tsconfig.app.json            # App-specific TypeScript config
├── 📄 tsconfig.node.json           # Node-specific TypeScript config
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 index.html                   # HTML entry point
├── 📄 .env                         # Environment variables (local)
├── 📄 .env.example                 # Environment template
├── 📄 .env.production              # Production environment
├── 📄 .gitignore                   # Git ignore rules
├── 📄 firebase.json                # Firebase config (legacy)
├── 📄 firestore.indexes.json       # Firestore indexes (legacy)
├── 📄 firestore.rules              # Firestore rules (legacy)
├── 📄 test-firebase.js             # Firebase tests (legacy)
├── 📄 test-firestore.js            # Firestore tests (legacy)
└── 📄 pglite-debug.log             # Debug log file
```

## 🔧 Key Architecture Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API
- **Routing**: Conditional routing based on user role
- **Icons**: Lucide React for consistent iconography

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with bcrypt password hashing
- **API Design**: RESTful endpoints with consistent response format
- **Middleware**: CORS, rate limiting, authentication validation

### Database Schema
- **Users**: Authentication, profile, and role management
- **Products**: Catalog with categories and inventory
- **Orders**: Order processing and status tracking
- **PasswordResets**: Admin-managed password reset workflow

## 🎯 Component Hierarchy

### Authentication Flow
```
App.tsx
├── AuthProvider (Context)
└── AppContent
    ├── LoginModal (if not authenticated)
    ├── AdminDashboard (if admin user)
    └── Regular Website (if regular user)
        ├── Header
        ├── ProductsPage
        ├── Cart
        └── Other Components
```

### Admin Dashboard Structure
```
AdminDashboard.tsx
├── Sidebar Navigation
│   ├── Overview Tab
│   ├── Order Management Tab
│   ├── Password Resets Tab
│   ├── User Management Tab
│   └── Logout Button
└── Main Content Area
    ├── Tab-specific Content
    ├── Loading States
    ├── Error Handling
    └── Data Tables/Forms
```

## 📊 Data Flow

### Customer Flow
1. **Authentication**: Login/Register → JWT Token → User Context
2. **Product Browsing**: Products API → Product Display → Cart Context
3. **Order Placement**: Cart → Checkout → Order API → Order Confirmation

### Admin Flow
1. **Admin Login**: Admin Credentials → JWT Token → Admin Dashboard
2. **Data Management**: Dashboard → Admin APIs → Database Updates
3. **User Management**: User Queries → Display → Admin Actions

## 🔒 Security Implementation

### Frontend Security
- JWT token storage and validation
- Route protection based on user roles
- Input validation and sanitization
- HTTPS enforcement in production

### Backend Security
- Password hashing with bcrypt
- JWT token generation and validation
- Rate limiting on sensitive endpoints
- CORS configuration for allowed origins
- Admin role verification middleware

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- **Mobile**: 640px and below
- **Tablet**: 641px to 1024px
- **Desktop**: 1025px and above

### Mobile-First Approach
- Touch-friendly interfaces
- Optimized loading for mobile networks
- Adaptive layouts for all screen sizes
- Progressive Web App capabilities

## ⚡ Performance Optimizations

### Frontend Optimizations
- React component memoization
- Lazy loading for better initial load
- Debounced search functionality
- Data caching with Context API
- Asset optimization with Vite

### Backend Optimizations
- Database indexing for fast queries
- API response caching
- Connection pooling for database
- Optimized database queries
- Gzip compression for responses

## 🧪 Testing Strategy

### Development Testing
- Manual testing protocols
- Component isolation testing
- API endpoint validation
- Cross-browser compatibility testing
- Mobile responsiveness testing

### Production Testing
- Load testing for API endpoints
- Database performance testing
- Security vulnerability testing
- User acceptance testing
- End-to-end workflow testing

---

**📋 Note**: This structure represents the final, production-ready architecture of the SRR Farms E-commerce Platform.

**🔄 Maintenance**: Regular updates to this documentation should reflect any structural changes to the project.
