# Deployment Guide - SRR Farms E-commerce Platform

## 🚀 Production Deployment

### Prerequisites
- Node.js v16+ installed
- MongoDB instance (local or cloud)
- Domain name (optional)
- SSL certificate (for HTTPS)

## 📋 Pre-Deployment Checklist

### Environment Configuration
- [ ] Set up production MongoDB database
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure domain DNS
- [ ] Set up monitoring tools

### Security Checklist
- [ ] Change default JWT secret
- [ ] Enable CORS for specific origins only
- [ ] Set up rate limiting
- [ ] Configure secure headers
- [ ] Enable HTTPS redirect

### Performance Checklist
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure database indexes
- [ ] Enable caching headers
- [ ] Optimize images and assets

## � Deployment Methods

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - **RECOMMENDED**

#### Frontend Deployment (Vercel):
1. Push code to GitHub repository
2. Connect Vercel to your GitHub account
3. Import your repository
4. Configure environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
5. Build settings:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
6. Deploy automatically

#### Backend Deployment (Railway):
1. Create account on Railway.app
2. Connect GitHub repository
3. Select the `server` folder as root
4. Add environment variables:
   ```
   MONGODB_URI=mongodb://your-production-db-url
   JWT_SECRET=super-secure-random-string-minimum-32-characters
   NODE_ENV=production
   PORT=3001
   ```
5. Deploy automatically on push

### Option 2: Traditional VPS/Server

#### Backend Deployment
1. **Upload files to server**
   ```bash
   scp -r server/ user@your-server:/path/to/app/
   ```

2. **Install dependencies**
   ```bash
   cd /path/to/app/server
   npm install --production
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   MONGODB_URI=mongodb://localhost:27017/srrfarms_prod
   JWT_SECRET=your-super-secure-secret-key
   NODE_ENV=production
   PORT=3001
   ```

4. **Set up PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "srrfarms-backend"
   pm2 startup
   pm2 save
   ```

#### Frontend Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload build files**
   ```bash
   scp -r dist/ user@your-server:/var/www/srrfarms/
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       root /var/www/srrfarms;
       index index.html;
       
       # Frontend routes
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # API proxy
       location /api/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 3: Docker Deployment

#### Create Dockerfile for Backend
```dockerfile
# server/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

#### Create Dockerfile for Frontend
```dockerfile
# Dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: srrfarms-db
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: srrfarms
    ports:
      - "27017:27017"

  backend:
    build: ./server
    container_name: srrfarms-backend
    environment:
      MONGODB_URI: mongodb://mongodb:27017/srrfarms
      JWT_SECRET: your-super-secure-secret
      NODE_ENV: production
    ports:
      - "3001:3001"
    depends_on:
      - mongodb

  frontend:
    build: .
    container_name: srrfarms-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## 🔒 Security Configuration

### Environment Variables (Production)
```bash
# Backend .env
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=super-secure-random-string-minimum-32-characters
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment
```bash
# .env.production
VITE_API_URL=https://your-backend-domain.com/api
```

## 📊 Monitoring and Maintenance

### Health Checks
Set up monitoring for:
- [ ] Application uptime
- [ ] API response times
- [ ] Database connection
- [ ] Memory usage
- [ ] Disk space

### Backup Strategy
- [ ] Daily database backups
- [ ] Code repository backups
- [ ] User uploaded files backup
- [ ] Configuration files backup

### Maintenance Tasks
- [ ] Regular security updates
- [ ] Database optimization
- [ ] Log rotation
- [ ] Certificate renewal
- [ ] Performance monitoring

## 🚨 Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check logs
pm2 logs srrfarms-backend

# Common fixes
1. Check MongoDB connection
2. Verify environment variables
3. Check port conflicts
4. Review file permissions
```

#### Frontend Not Loading
```bash
# Check build output
npm run build

# Common fixes
1. Verify API URL configuration
2. Check Nginx configuration
3. Verify SSL certificates
4. Check CORS settings
```

#### Database Connection Issues
```bash
# Check MongoDB status
systemctl status mongod

# Test connection
mongo --eval "db.adminCommand('ismaster')"
```

## 📈 Performance Optimization

### Backend Optimization
- Enable gzip compression
- Set up database indexes
- Implement API caching
- Use connection pooling

### Frontend Optimization
- Enable asset caching
- Implement code splitting
- Optimize images
- Use CDN for static assets

### Database Optimization
```javascript
// Add indexes for better performance
db.users.createIndex({ email: 1 })
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.products.createIndex({ name: "text", description: "text" })
```

---

**📞 Support**: For deployment assistance, contact the development team.

**⚠️ Important**: Always test deployments in a staging environment first!
5. Deploy automatically

### Option 2: DigitalOcean/AWS/Google Cloud

#### Requirements:
- Ubuntu 20.04+ server
- Node.js 18+
- MongoDB Atlas account
- Domain name
- SSL certificate

### Option 3: Shared Hosting (cPanel)

#### Requirements:
- Node.js support
- MongoDB database
- File upload permissions

## 🔧 Pre-Deployment Checklist

### Backend Configuration:
- [ ] MongoDB Atlas database created
- [ ] Environment variables configured
- [ ] Email SMTP configured
- [ ] File upload directory permissions set
- [ ] CORS origins updated for production domain

### Frontend Configuration:
- [ ] API URL updated for production
- [ ] Firebase project configured for production
- [ ] Build process tested locally
- [ ] Static assets optimized

### Database Setup:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for cloud deployment)
- [ ] Connection string updated in backend .env

### Security:
- [ ] JWT secret changed to strong random string
- [ ] Admin credentials secured
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Environment variables secured

## 📋 Step-by-Step Deployment Guide

### 1. Prepare MongoDB Atlas
```bash
1. Go to mongodb.com/atlas
2. Create new cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in backend .env
```

### 2. Deploy Backend (Railway Example)
```bash
1. Push code to GitHub
2. Connect Railway to GitHub
3. Select server folder
4. Add environment variables
5. Deploy
```

### 3. Deploy Frontend (Vercel Example)
```bash
1. Update VITE_API_URL with backend URL
2. Push to GitHub
3. Connect Vercel to GitHub
4. Configure build settings:
   - Framework: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
5. Add environment variables
6. Deploy
```

### 4. Configure Domain & SSL
```bash
1. Point domain to deployment
2. Configure SSL certificate
3. Update CORS settings in backend
4. Test all functionality
```

## 🧪 Testing Deployment

### Backend Health Check:
```bash
GET https://your-backend-url.com/api/payments/test
Response: {"success": true, "message": "Payment system is operational"}
```

### Frontend Functionality:
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] UPI payment with screenshot upload
- [ ] COD payment
- [ ] Admin order management
- [ ] Email notifications

### File Upload Testing:
- [ ] Payment screenshots upload correctly
- [ ] File size limits enforced
- [ ] Image preview works
- [ ] Admin can view uploaded screenshots

## 🔍 Common Deployment Issues

### Backend Issues:
1. **CORS Error**: Update FRONTEND_URL in backend .env
2. **File Upload Fails**: Check upload directory permissions
3. **Database Connection**: Verify MongoDB URI and IP whitelist
4. **Email Not Sending**: Configure SMTP settings correctly

### Frontend Issues:
1. **API Calls Fail**: Check VITE_API_URL configuration
2. **Build Fails**: Ensure all dependencies are installed
3. **Images Not Loading**: Check public folder deployment
4. **Routing Issues**: Configure SPA redirects

### Solutions:
```bash
# Check backend logs
railway logs

# Check frontend build
npm run build
npm run preview

# Test API connectivity
curl https://your-backend-url.com/api/payments/test
```

## 🌍 Production-Ready Features

### ✅ Implemented:
- Complete authentication system
- Cart and order management
- UPI payment with admin verification
- Cash on Delivery option
- File upload for payment screenshots
- Admin dashboard for order management
- Email notifications system
- Rate limiting and security
- Error handling and validation
- Responsive design

### 🔧 Customization Options:
- Update UPI QR code in `/public/images/upi-qr-code.svg`
- Modify email templates in backend
- Customize product categories
- Add more payment methods
- Enhance admin features

## 📞 Support

All features will work online including:
- ✅ User Authentication (Email/Password)
- ✅ Product Management
- ✅ Shopping Cart
- ✅ UPI Payment with Screenshot Upload
- ✅ Cash on Delivery
- ✅ Admin Order Verification
- ✅ Email Notifications
- ✅ File Upload System
- ✅ Order Tracking
- ✅ Admin Dashboard

The system is fully production-ready! 🎉
