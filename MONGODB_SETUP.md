# MongoDB Setup Guide

## 🍃 Set up MongoDB Atlas (Free Database)

### Step 1: Create MongoDB Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create organization and project

### Step 2: Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** shared cluster
3. Select cloud provider (AWS recommended)
4. Choose region closest to you
5. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `srrfarms`
5. Generate secure password
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your user password
6. Replace `<dbname>` with `srrfarms`

### ✅ Your Actual Connection String:
```
mongodb+srv://dusharlasathish:EiTIDwE7eQtwa4Tk@clustersrr.xxo8sse.mongodb.net/?retryWrites=true&w=majority&appName=Clustersrr
```

### Step 6: Use This Exact Connection String
✅ **Perfect!** Use this EXACT string as `MONGODB_URI` in your backend environment variables.

**Note:** This will use the default database. Your backend will create collections automatically.

## 🎯 Your database is ready for production!
