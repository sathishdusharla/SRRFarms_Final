const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://dusharlasathish:EiTIDwE7eQtwa4Tk@clustersrr.xxo8sse.mongodb.net/?retryWrites=true&w=majority&appName=Clustersrr';

// Admin user data
const adminUser = {
  fullName: 'SRR Farms Admin',
  email: 'srrfarms@gmail.com',
  phone: '9876543210', // This phone number automatically gets admin privileges
  password: 'srrfarms@202507', // Admin password
  address: {
    street: 'SRR Farms Main Office',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    isDefault: true
  },
  dateOfBirth: '1990-01-01',
  gender: 'male',
  isAdmin: true,
  isVerified: true,
  profileImage: null
};

async function setupAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    console.log('🔍 Checking for existing admin user...');
    let existingAdmin = await User.findOne({ 
      $or: [
        { email: adminUser.email },
        { phone: adminUser.phone },
        { isAdmin: true }
      ]
    });

    if (existingAdmin) {
      console.log('👤 Found existing admin user:', {
        id: existingAdmin._id,
        email: existingAdmin.email,
        phone: existingAdmin.phone,
        isAdmin: existingAdmin.isAdmin
      });

      // Update existing admin user
      console.log('🔄 Updating admin user...');
      existingAdmin.fullName = adminUser.fullName;
      existingAdmin.email = adminUser.email;
      existingAdmin.phone = adminUser.phone;
      existingAdmin.password = adminUser.password; // This will be hashed by pre-save middleware
      existingAdmin.address = adminUser.address;
      existingAdmin.isAdmin = true;
      existingAdmin.isVerified = true;
      
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create new admin user
      console.log('👤 Creating new admin user...');
      const newAdmin = new User(adminUser);
      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
    }

    // Verify admin user
    console.log('🔍 Verifying admin user...');
    const verifiedAdmin = await User.findOne({ email: adminUser.email });
    
    if (verifiedAdmin && verifiedAdmin.isAdmin) {
      console.log('✅ Admin user verification successful!');
      console.log('📋 Admin User Details:');
      console.log('   Email:', verifiedAdmin.email);
      console.log('   Phone:', verifiedAdmin.phone);
      console.log('   Full Name:', verifiedAdmin.fullName);
      console.log('   Is Admin:', verifiedAdmin.isAdmin);
      console.log('   Is Verified:', verifiedAdmin.isVerified);
      console.log('   Created At:', verifiedAdmin.createdAt);
      
      // Test password
      const isPasswordValid = await verifiedAdmin.comparePassword(adminUser.password);
      console.log('   Password Valid:', isPasswordValid ? '✅' : '❌');
    } else {
      throw new Error('Admin user verification failed');
    }

    console.log('\n🎉 Admin credentials setup completed!');
    console.log('📝 Login Credentials:');
    console.log('   Email: srrfarms@gmail.com');
    console.log('   Phone: 9876543210');
    console.log('   Password: srrfarms@202507');
    console.log('\n💡 You can login with either email or phone number');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    
    if (error.code === 11000) {
      console.error('💡 Duplicate key error - user with this email/phone already exists');
      
      // Try to find the conflicting user
      const conflictingUser = await User.findOne({
        $or: [
          { email: adminUser.email },
          { phone: adminUser.phone }
        ]
      });
      
      if (conflictingUser) {
        console.log('🔍 Conflicting user found:', {
          id: conflictingUser._id,
          email: conflictingUser.email,
          phone: conflictingUser.phone,
          isAdmin: conflictingUser.isAdmin
        });
        
        if (!conflictingUser.isAdmin) {
          console.log('🔄 Making existing user admin...');
          conflictingUser.isAdmin = true;
          conflictingUser.password = adminUser.password;
          await conflictingUser.save();
          console.log('✅ Existing user promoted to admin!');
        }
      }
    }
    
    process.exit(1);
  }
}

// Run the admin setup
setupAdminUser();
