// Usage: node cleanup.js
// Deletes all orders, all carts, and all users except admin from the database.

const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/srrfarms';

async function cleanup() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Delete all orders
  const ordersDeleted = await Order.deleteMany({});
  console.log(`Deleted ${ordersDeleted.deletedCount} orders.`);

  // Delete all carts
  const cartsDeleted = await Cart.deleteMany({});
  console.log(`Deleted ${cartsDeleted.deletedCount} carts.`);

  // Delete all users except admin
  const usersDeleted = await User.deleteMany({ role: { $ne: 'admin' } });
  console.log(`Deleted ${usersDeleted.deletedCount} non-admin users.`);

  await mongoose.disconnect();
  console.log('Cleanup complete.');
}

cleanup().catch(err => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
