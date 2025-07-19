const fetch = require('node-fetch');

// Configuration
const BASE_URL = 'http://localhost:3001/api';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdiODgwNmIzMjU2OTU1ZTM2NDAyMTQiLCJpYXQiOjE3NTI5Mjc5NDEsImV4cCI6MTc1MzUzMjc0MX0.dMOdYzg1t2jZHu08q8jioCVMTDqJ1uFIzX6spWyzlgg';

// Test functions
async function getCart() {
  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
    });
    const cart = await response.json();
    console.log('Cart Retrieved:', JSON.stringify(cart, null, 2));
    return cart;
  } catch (error) {
    console.error('Get Cart Error:', error.message);
  }
}

async function addToCart(productId, quantity = 1) {
  try {
    const response = await fetch(`${BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
    const result = await response.json();
    console.log('Added to Cart:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Add to Cart Error:', error.message);
  }
}

async function createOrder() {
  try {
    const orderData = {
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      paymentMethod: 'credit_card'
    };

    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    const order = await response.json();
    console.log('Order Created:', JSON.stringify(order, null, 2));
    return order;
  } catch (error) {
    console.error('Create Order Error:', error.message);
  }
}

async function getAdminDashboard() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
    });
    const dashboard = await response.json();
    console.log('Admin Dashboard:', JSON.stringify(dashboard, null, 2));
    return dashboard;
  } catch (error) {
    console.error('Admin Dashboard Error:', error.message);
  }
}

async function getAllOrders() {
  try {
    const response = await fetch(`${BASE_URL}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
    });
    const orders = await response.json();
    console.log('All Orders:', JSON.stringify(orders, null, 2));
    return orders;
  } catch (error) {
    console.error('Get Orders Error:', error.message);
  }
}

// Main test workflow
async function runCompleteTest() {
  console.log('🚀 Starting Complete E-commerce Workflow Test\n');

  console.log('1. Getting initial cart...');
  await getCart();
  console.log('\n---\n');

  console.log('2. Adding product to cart...');
  await addToCart('product1', 2);
  console.log('\n---\n');

  console.log('3. Getting updated cart...');
  await getCart();
  console.log('\n---\n');

  console.log('4. Creating order from cart...');
  await createOrder();
  console.log('\n---\n');

  console.log('5. Getting admin dashboard stats...');
  await getAdminDashboard();
  console.log('\n---\n');

  console.log('6. Getting all orders in admin...');
  await getAllOrders();
  console.log('\n---\n');

  console.log('✅ Complete workflow test finished!');
}

// Run the test
runCompleteTest().catch(console.error);
