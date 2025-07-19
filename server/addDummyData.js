require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

async function addDummyData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get existing products
    const products = await Product.find().limit(5);
    if (products.length === 0) {
      console.log('No products found. Please add products first.');
      return;
    }

    // Create some dummy orders
    const dummyOrders = [
      {
        orderNumber: 'ORD-' + Date.now() + '-1',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210',
          address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            fullAddress: '123 Main St, Mumbai, Maharashtra 400001, India'
          }
        },
        items: [
          {
            product: products[0]._id,
            quantity: 2,
            price: products[0].price,
            total: products[0].price * 2
          }
        ],
        subtotal: products[0].price * 2,
        shipping: 50,
        tax: 0,
        total: (products[0].price * 2) + 50,
        status: 'pending',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        isGuestOrder: true
      },
      {
        orderNumber: 'ORD-' + (Date.now() + 1) + '-2',
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '9876543211',
          address: {
            street: '456 Oak Ave',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India',
            fullAddress: '456 Oak Ave, Delhi, Delhi 110001, India'
          }
        },
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].price,
            total: products[1].price
          },
          {
            product: products[2]._id,
            quantity: 3,
            price: products[2].price,
            total: products[2].price * 3
          }
        ],
        subtotal: products[1].price + (products[2].price * 3),
        shipping: 75,
        tax: 0,
        total: products[1].price + (products[2].price * 3) + 75,
        status: 'confirmed',
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        isGuestOrder: true
      },
      {
        orderNumber: 'ORD-' + (Date.now() + 2) + '-3',
        customer: {
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '9876543212',
          address: {
            street: '789 Pine St',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India',
            fullAddress: '789 Pine St, Bangalore, Karnataka 560001, India'
          }
        },
        items: [
          {
            product: products[3]._id,
            quantity: 1,
            price: products[3].price,
            total: products[3].price
          }
        ],
        subtotal: products[3].price,
        shipping: 40,
        tax: 0,
        total: products[3].price + 40,
        status: 'shipped',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        isGuestOrder: true
      },
      {
        orderNumber: 'ORD-' + (Date.now() + 3) + '-4',
        customer: {
          name: 'Alice Brown',
          email: 'alice@example.com',
          phone: '9876543213',
          address: {
            street: '321 Elm St',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600001',
            country: 'India',
            fullAddress: '321 Elm St, Chennai, Tamil Nadu 600001, India'
          }
        },
        items: [
          {
            product: products[4]._id,
            quantity: 2,
            price: products[4].price,
            total: products[4].price * 2
          }
        ],
        subtotal: products[4].price * 2,
        shipping: 60,
        tax: 0,
        total: (products[4].price * 2) + 60,
        status: 'delivered',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        isGuestOrder: true
      }
    ];

    // Insert dummy orders
    const insertedOrders = await Order.insertMany(dummyOrders);
    console.log(`Added ${insertedOrders.length} dummy orders`);

    // Also create a few registered user orders if we have users
    const users = await User.find({ isAdmin: false }).limit(2);
    if (users.length > 0) {
      const userOrders = [
        {
          orderNumber: 'ORD-' + (Date.now() + 10) + '-U1',
          user: users[0]._id,
          customer: {
            name: users[0].fullName,
            email: users[0].email,
            phone: users[0].phone || '9876543214',
            address: {
              street: '555 User St',
              city: 'Pune',
              state: 'Maharashtra',
              pincode: '411001',
              country: 'India',
              fullAddress: '555 User St, Pune, Maharashtra 411001, India'
            }
          },
          items: [
            {
              product: products[0]._id,
              quantity: 1,
              price: products[0].price,
              total: products[0].price
            }
          ],
          subtotal: products[0].price,
          shipping: 50,
          tax: 0,
          total: products[0].price + 50,
          status: 'pending',
          paymentMethod: 'upi',
          paymentStatus: 'pending',
          isGuestOrder: false
        }
      ];

      if (users[1]) {
        userOrders.push({
          orderNumber: 'ORD-' + (Date.now() + 11) + '-U2',
          user: users[1]._id,
          customer: {
            name: users[1].fullName,
            email: users[1].email,
            phone: users[1].phone || '9876543215',
            address: {
              street: '777 Another St',
              city: 'Hyderabad',
              state: 'Telangana',
              pincode: '500001',
              country: 'India',
              fullAddress: '777 Another St, Hyderabad, Telangana 500001, India'
            }
          },
          items: [
            {
              product: products[1]._id,
              quantity: 2,
              price: products[1].price,
              total: products[1].price * 2
            }
          ],
          subtotal: products[1].price * 2,
          shipping: 75,
          tax: 0,
          total: (products[1].price * 2) + 75,
          status: 'confirmed',
          paymentMethod: 'card',
          paymentStatus: 'paid',
          isGuestOrder: false
        });
      }

      const insertedUserOrders = await Order.insertMany(userOrders);
      console.log(`Added ${insertedUserOrders.length} registered user orders`);
    }

    console.log('Dummy data added successfully!');
    
  } catch (error) {
    console.error('Error adding dummy data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addDummyData();
