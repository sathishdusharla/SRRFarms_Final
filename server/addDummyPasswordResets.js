require('dotenv').config();
const mongoose = require('mongoose');
const PasswordReset = require('./models/PasswordReset');
const User = require('./models/User');

async function addDummyPasswordResets() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get some existing users to create password reset requests for
    const users = await User.find({ isAdmin: false }).limit(3);
    if (users.length === 0) {
      console.log('No users found. Please add some users first.');
      return;
    }

    // Create some dummy password reset requests
    const dummyResets = [
      {
        userId: users[0]._id,
        userEmail: users[0].email,
        userPhone: users[0].phone || '9876543210',
        userFullName: users[0].fullName,
        status: 'pending',
        adminNotes: '',
        createdAt: new Date()
      }
    ];

    if (users[1]) {
      dummyResets.push({
        userId: users[1]._id,
        userEmail: users[1].email,
        userPhone: users[1].phone || '9876543211',
        userFullName: users[1].fullName,
        status: 'completed',
        adminNotes: 'Password reset completed successfully',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        completedAt: new Date()
      });
    }

    if (users[2]) {
      dummyResets.push({
        userId: users[2]._id,
        userEmail: users[2].email,
        userPhone: users[2].phone || '9876543212',
        userFullName: users[2].fullName,
        status: 'rejected',
        adminNotes: 'Unable to verify user identity',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      });
    }

    // Insert dummy password resets
    const insertedResets = await PasswordReset.insertMany(dummyResets);
    console.log(`Added ${insertedResets.length} dummy password reset requests`);

    console.log('Dummy password reset data added successfully!');
    
  } catch (error) {
    console.error('Error adding dummy password reset data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addDummyPasswordResets();
