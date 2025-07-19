const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payment-screenshots/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Apply authentication to all payment routes
router.use(authenticateToken);

// POST /api/payments/create-upi-order
// Create UPI order with payment screenshot upload
router.post('/create-upi-order', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { shippingAddress, notes = '', upiTransactionId = '' } = req.body;

    // Get user details
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));

    // Use shipping address
    const finalAddress = shippingAddress ? {
      ...shippingAddress,
      fullAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}`
    } : {
      street: user.address?.street || 'Not provided',
      city: user.address?.city || 'Not provided',
      state: user.address?.state || 'Not provided',
      pincode: user.address?.pincode || '000000',
      country: user.address?.country || 'India',
      fullAddress: `${user.address?.street || 'Address'}, ${user.address?.city || 'City'}, ${user.address?.state || 'State'} - ${user.address?.pincode || '000000'}`
    };

    // Calculate totals
    const shipping = 50;
    const tax = Math.round(cart.subtotal * 0.05);
    const total = cart.subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `SRR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create order with UPI payment details
    const order = new Order({
      orderNumber: orderNumber,
      user: req.user._id,
      customer: {
        name: user.fullName || user.name || user.email,
        email: user.email,
        phone: user.phone || 'Not provided',
        address: finalAddress
      },
      items: orderItems,
      subtotal: cart.subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      paymentMethod: 'upi',
      paymentStatus: 'pending_verification', // Waiting for admin approval
      status: 'payment_pending', // Order pending until payment approved
      paymentDetails: {
        upi_transaction_id: upiTransactionId,
        payment_screenshot: req.file ? req.file.filename : null,
        payment_date: new Date(),
        upi_id: '9490507045-4@ybl', // Your UPI ID
        amount_paid: total,
        verification_status: 'pending'
      },
      notes: notes
    });

    await order.save();

    // Don't update stock or clear cart yet - wait for admin approval

    // Populate the order for response
    await order.populate('items.product');

    res.json({
      success: true,
      message: 'UPI payment order created successfully. Waiting for admin verification.',
      order: order,
      paymentInfo: {
        upiId: '9490507045-4@ybl',
        amount: total,
        orderNumber: orderNumber,
        qrCodeUrl: '/images/upi-qr-code.png' // You'll need to add this image
      }
    });

  } catch (error) {
    console.error('Create UPI order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating UPI order'
    });
  }
});

// POST /api/payments/verify-upi-payment
// Verify UPI payment and create order
router.post('/verify-upi-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      orderData
    } = req.body;

    // Verify payment signature
    const verification = paymentService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        verified: false
      });
    }

    // Get payment details
    const paymentDetails = await paymentService.getPaymentDetails(razorpay_payment_id);
    
    if (!paymentDetails.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment details'
      });
    }

    // Get user and cart
    const user = await User.findById(req.user._id);
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));

    // Use shipping address
    const finalAddress = shippingAddress ? {
      ...shippingAddress,
      fullAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}`
    } : {
      street: user.address?.street || 'Not provided',
      city: user.address?.city || 'Not provided',
      state: user.address?.state || 'Not provided',
      pincode: user.address?.pincode || '000000',
      country: user.address?.country || 'India',
      fullAddress: `${user.address?.street || 'Address'}, ${user.address?.city || 'City'}, ${user.address?.state || 'State'} - ${user.address?.pincode || '000000'}`
    };

    // Calculate totals
    const shipping = 50;
    const tax = Math.round(cart.subtotal * 0.05);
    const total = cart.subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create order with payment details
    const order = new Order({
      orderNumber: orderNumber,
      user: req.user._id,
      customer: {
        name: user.fullName || user.name || user.email,
        email: user.email,
        phone: user.phone || 'Not provided',
        address: finalAddress
      },
      items: orderItems,
      subtotal: cart.subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      paymentDetails: {
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        payment_method: paymentDetails.payment.method,
        vpa: paymentDetails.payment.vpa,
        bank: paymentDetails.payment.bank,
        amount_paid: paymentDetails.payment.amount,
        fee: paymentDetails.payment.fee,
        tax: paymentDetails.payment.tax,
        payment_date: paymentDetails.payment.created_at
      }
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user's cart
    await cart.clearCart();

    // Populate the order for response
    await order.populate('items.product');

    res.json({
      success: true,
      verified: true,
      message: 'Payment verified and order created successfully',
      order: order,
      payment: paymentDetails.payment
    });

  } catch (error) {
    console.error('Verify UPI payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
});

// POST /api/payments/create-test-payment
// Create test UPI payment for development
router.post('/create-test-payment', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Test payments not allowed in production'
      });
    }

    const { amount, orderId } = req.body;

    const testPayment = paymentService.createTestUPIPayment(amount, orderId);

    res.json({
      success: true,
      testPayment: testPayment,
      message: 'Test payment created (Development mode only)'
    });

  } catch (error) {
    console.error('Create test payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test payment'
    });
  }
});

// POST /api/payments/simulate-test-verification
// Simulate payment verification for testing
router.post('/simulate-test-verification', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Test verification not allowed in production'
      });
    }

    const { orderId, shippingAddress } = req.body;

    // Get user and cart
    const user = await User.findById(req.user._id);
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Simulate payment data
    const simulatedPayment = paymentService.simulateTestPayment(orderId);

    // Create order with simulated payment
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));

    const finalAddress = shippingAddress ? {
      ...shippingAddress,
      fullAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}`
    } : {
      street: 'Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      country: 'India',
      fullAddress: 'Test Street, Test City, Test State - 123456'
    };

    const shipping = 50;
    const tax = Math.round(cart.subtotal * 0.05);
    const total = cart.subtotal + shipping + tax;
    const orderNumber = `TEST-ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const order = new Order({
      orderNumber: orderNumber,
      user: req.user._id,
      customer: {
        name: user.fullName || user.name || user.email,
        email: user.email,
        phone: user.phone || 'Not provided',
        address: finalAddress
      },
      items: orderItems,
      subtotal: cart.subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      paymentDetails: {
        ...simulatedPayment,
        payment_method: 'upi',
        vpa: 'test@paytm',
        bank: 'Test Bank',
        amount_paid: total,
        payment_date: new Date(),
        test_mode: true
      }
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user's cart
    await cart.clearCart();

    await order.populate('items.product');

    res.json({
      success: true,
      verified: true,
      test_mode: true,
      message: 'Test payment verified and order created successfully',
      order: order,
      simulatedPayment: simulatedPayment
    });

  } catch (error) {
    console.error('Simulate test verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error simulating payment verification'
    });
  }
});

// GET /api/payments/order/:orderId
// Get payment details for an order
router.get('/order/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [
        { _id: req.params.orderId },
        { orderNumber: req.params.orderId }
      ],
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentDetails: order.paymentDetails,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Get payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details'
    });
  }
});

module.exports = router;
