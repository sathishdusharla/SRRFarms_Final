const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');
require('dotenv').config();

async function addDummyOrders() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/srrfarms');
  const products = await Product.find({}).limit(2);
  if (products.length === 0) {
    console.log('No products found. Please seed products first.');
    process.exit(1);
  }
  const dummyOrder = new Order({
    orderNumber: `TEST-ORD-${Date.now()}`,
    isGuestOrder: true,
    customer: {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '9999999999',
      address: {
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'India',
        fullAddress: 'Test Street, Test City, Test State - 123456'
      }
    },
    items: [
      {
        product: products[0]._id,
        frontendProductId: '1',
        productDetails: {
          name: products[0].name,
          size: products[0].size,
          price: products[0].price,
          image: products[0].image,
          category: products[0].category
        },
        quantity: 1,
        price: products[0].price,
        total: products[0].price
      }
    ],
    subtotal: products[0].price,
    shipping: 50,
    tax: 0,
    total: products[0].price + 50,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    notes: 'Dummy test order'
  });
  await dummyOrder.save();
  console.log('Dummy order created:', dummyOrder.orderNumber);
  process.exit(0);
}
addDummyOrders();
