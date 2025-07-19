console.log('🔧 Direct Admin Password Update Script');
console.log('=====================================');

// Direct MongoDB connection to bypass application layer
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection string  
const MONGODB_URI = 'mongodb+srv://dusharlasathish:EiTIDwE7eQtwa4Tk@clustersrr.xxo8sse.mongodb.net/?retryWrites=true&w=majority&appName=Clustersrr';

// Admin credentials
const ADMIN_EMAIL = 'srrfarms@gmail.com';
const ADMIN_PHONE = '9876543210';
const ADMIN_PASSWORD = 'srrfarms@202507';

async function updateAdminPassword() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Find admin user by phone number
    console.log('🔍 Finding admin user...');
    let adminUser = await usersCollection.findOne({ 
      phone: ADMIN_PHONE 
    });

    if (!adminUser) {
      console.log('👤 Admin user not found, creating new one...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
      
      // Create admin user
      const newAdmin = {
        fullName: 'SRR Farms Admin',
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: hashedPassword,
        address: {
          street: 'SRR Farms Main Office',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          isDefault: true
        },
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        isAdmin: true,
        isVerified: true,
        profileImage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await usersCollection.insertOne(newAdmin);
      console.log('✅ Admin user created with ID:', result.insertedId);
      adminUser = newAdmin;
      
    } else {
      console.log('👤 Found existing admin user:', {
        id: adminUser._id,
        email: adminUser.email,
        phone: adminUser.phone,
        isAdmin: adminUser.isAdmin
      });

      // Hash the new password
      console.log('🔐 Updating password...');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Update admin user
      const updateResult = await usersCollection.updateOne(
        { _id: adminUser._id },
        { 
          $set: {
            fullName: 'SRR Farms Admin',
            email: ADMIN_EMAIL,
            phone: ADMIN_PHONE,
            password: hashedPassword,
            isAdmin: true,
            isVerified: true,
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ Admin user updated. Modified count:', updateResult.modifiedCount);
    }

    // Verify the update
    console.log('🔍 Verifying admin user...');
    const verifiedAdmin = await usersCollection.findOne({ 
      phone: ADMIN_PHONE 
    });

    if (verifiedAdmin) {
      console.log('📋 Admin User Details:');
      console.log('   ID:', verifiedAdmin._id);
      console.log('   Full Name:', verifiedAdmin.fullName);
      console.log('   Email:', verifiedAdmin.email);
      console.log('   Phone:', verifiedAdmin.phone);
      console.log('   Is Admin:', verifiedAdmin.isAdmin);
      console.log('   Is Verified:', verifiedAdmin.isVerified);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare(ADMIN_PASSWORD, verifiedAdmin.password);
      console.log('   Password Valid:', isPasswordValid ? '✅' : '❌');
      
      if (isPasswordValid) {
        console.log('\n🎉 Admin credentials successfully updated!');
        console.log('📝 Login Credentials:');
        console.log('   Email: srrfarms@gmail.com');
        console.log('   Phone: 9876543210');
        console.log('   Password: srrfarms@202507');
        console.log('\n💡 You can now login to the admin panel with these credentials');
      } else {
        console.log('\n❌ Password verification failed!');
      }
    } else {
      console.log('\n❌ Could not verify admin user');
    }
    
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
  } finally {
    await client.close();
    console.log('🔒 Database connection closed');
  }
}

// Run the script
updateAdminPassword();
