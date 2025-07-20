const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');
require('dotenv').config();

async function testMongoDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/srrfarms');
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if products exist
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products in database`);
    
    if (products.length > 0) {
      console.log('Sample product:', {
        _id: products[0]._id,
        frontendId: products[0].frontendId,
        name: products[0].name,
        price: products[0].price
      });
    }

    // Test 2: Create a test order
    const testOrderData = {
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '9876543210',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456',
          fullAddress: '123 Test Street, Test City, Test State - 123456'
        }
      },
      items: [{
        product: products.length > 0 ? products[0]._id : null,
        frontendProductId: '1',
        productDetails: {
          name: 'Test Product',
          size: '250ml',
          price: 500,
          category: 'ghee'
        },
        quantity: 1,
        price: 500,
        total: 500
      }],
      isGuestOrder: true,
      subtotal: 500,
      shipping: 50,
      tax: 0,
      total: 550,
      paymentMethod: 'cash',
      paymentStatus: 'pending'
    };

    const testOrder = new Order(testOrderData);
    await testOrder.save();
    console.log('✅ Test order created:', {
      orderNumber: testOrder.orderNumber,
      total: testOrder.total,
      customer: testOrder.customer.name
    });

    // Test 3: Retrieve the order
    const retrievedOrder = await Order.findById(testOrder._id).populate('items.product');
    console.log('✅ Order retrieved successfully:', {
      orderNumber: retrievedOrder.orderNumber,
      itemsCount: retrievedOrder.items.length
    });

    // Cleanup test order
    await Order.findByIdAndDelete(testOrder._id);
    console.log('✅ Test order cleaned up');

    console.log('🎉 All MongoDB tests passed!');

  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit();
  }
}

testMongoDB();
