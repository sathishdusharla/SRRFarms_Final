const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PasswordReset = require('../models/PasswordReset');
const emailService = require('../services/emailService');

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Helper function to generate random password
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// @route   GET /api/admin/password-resets
// @desc    Get all password reset requests
// @access  Private/Admin
router.get('/password-resets', async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get password reset requests with user details
    const requests = await PasswordReset.find(query)
      .populate('userId', 'fullName email phone')
      .populate('completedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await PasswordReset.countDocuments(query);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRequests: total,
          hasNext: skip + requests.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get password resets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   POST /api/admin/password-resets/:id/handle
// @desc    Handle password reset request (approve/reject)
// @access  Private/Admin
router.post('/password-resets/:id/handle', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNotes = '' } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    // Find password reset request
    const resetRequest = await PasswordReset.findById(id).populate('userId');

    if (!resetRequest) {
      return res.status(404).json({
        success: false,
        message: 'Password reset request not found'
      });
    }

    if (resetRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been processed'
      });
    }

    if (action === 'approve') {
      // Generate new password
      const newPassword = generateRandomPassword();
      
      // Hash the new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user's password
      await User.findByIdAndUpdate(resetRequest.userId._id, {
        password: hashedPassword
      });

      // Update reset request
      resetRequest.status = 'completed';
      resetRequest.adminNotes = adminNotes;
      resetRequest.newPassword = newPassword; // Store for reference (consider encrypting this)
      resetRequest.completedAt = new Date();
      resetRequest.completedBy = req.user._id;
      await resetRequest.save();

      // Send new password via email
      const emailSent = await emailService.sendPasswordResetEmail(resetRequest.userId, newPassword);

      if (!emailSent) {
        return res.status(500).json({
          success: false,
          message: 'Password was updated but email could not be sent. Please contact the user manually.'
        });
      }

      res.json({
        success: true,
        message: 'Password reset approved and new password sent to user via email',
        data: {
          newPassword, // Return for admin reference
          emailSent: true
        }
      });

    } else {
      // Reject the request
      resetRequest.status = 'rejected';
      resetRequest.adminNotes = adminNotes;
      resetRequest.completedAt = new Date();
      resetRequest.completedBy = req.user._id;
      await resetRequest.save();

      res.json({
        success: true,
        message: 'Password reset request rejected'
      });
    }

  } catch (error) {
    console.error('Handle password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with search and pagination
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { 
      search = '', 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build search query
    const query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get users
    const users = await User.find(query)
      .select('-password') // Exclude password field
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get some statistics
    const stats = {
      totalUsers: await User.countDocuments(),
      adminUsers: await User.countDocuments({ isAdmin: true }),
      verifiedUsers: await User.countDocuments({ isVerified: true }),
      recentUsers: await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      })
    };

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          hasNext: skip + users.length < total,
          hasPrev: parseInt(page) > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard-stats', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      users: {
        total: await User.countDocuments(),
        verified: await User.countDocuments({ isVerified: true }),
        admins: await User.countDocuments({ isAdmin: true }),
        recent: await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        monthly: await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
      },
      orders: {
        total: await Order.countDocuments(),
        pending: await Order.countDocuments({ status: 'pending' }),
        confirmed: await Order.countDocuments({ status: 'confirmed' }),
        processing: await Order.countDocuments({ status: 'processing' }),
        shipped: await Order.countDocuments({ status: 'shipped' }),
        delivered: await Order.countDocuments({ status: 'delivered' }),
        cancelled: await Order.countDocuments({ status: 'cancelled' }),
        recent: await Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        monthly: await Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
      },
      carts: {
        total: await Cart.countDocuments(),
        active: await Cart.countDocuments({ itemCount: { $gt: 0 } }),
        empty: await Cart.countDocuments({ itemCount: 0 }),
        recent: await Cart.countDocuments({ lastUpdated: { $gte: sevenDaysAgo } })
      },
      passwordResets: {
        pending: await PasswordReset.countDocuments({ status: 'pending' }),
        completed: await PasswordReset.countDocuments({ status: 'completed' }),
        rejected: await PasswordReset.countDocuments({ status: 'rejected' }),
        recent: await PasswordReset.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
      }
    };

    // Calculate revenue
    const revenueAggregation = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    stats.revenue = {
      total: revenueAggregation[0]?.totalRevenue || 0
    };

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'fullName email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent password reset requests
    const recentPasswordResets = await PasswordReset.find()
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent user registrations
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get users with active carts
    const activeCarts = await Cart.find({ itemCount: { $gt: 0 } })
      .populate('user', 'fullName email phone')
      .sort({ lastUpdated: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats,
        recentOrders,
        recentPasswordResets,
        recentUsers,
        activeCarts
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   PUT /api/admin/users/:id/toggle-admin
// @desc    Toggle user admin status
// @access  Private/Admin
router.put('/users/:id/toggle-admin', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from removing their own admin status
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot modify your own admin status'
      });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin successfully`,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Toggle admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics (alias for dashboard-stats)
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic stats
    const stats = {
      users: {
        total: await User.countDocuments(),
        active: await User.countDocuments({ isActive: true }),
        admins: await User.countDocuments({ isAdmin: true })
      },
      orders: {
        total: await Order.countDocuments(),
        pending: await Order.countDocuments({ status: 'pending' }),
        processing: await Order.countDocuments({ status: 'processing' }),
        shipped: await Order.countDocuments({ status: 'shipped' }),
        delivered: await Order.countDocuments({ status: 'delivered' }),
        cancelled: await Order.countDocuments({ status: 'cancelled' })
      },
      carts: {
        total: await Cart.countDocuments(),
        active: await Cart.countDocuments({ itemCount: { $gt: 0 } }),
        empty: await Cart.countDocuments({ itemCount: 0 })
      }
    };

    // Calculate revenue
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    stats.revenue = {
      total: revenue[0]?.total || 0
    };

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'fullName email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get active carts with items
    const activeCarts = await Cart.find({ itemCount: { $gt: 0 } })
      .populate('user', 'fullName email')
      .populate('items.product', 'name image')
      .sort({ lastUpdated: -1 })
      .limit(10);

    res.json({
      success: true,
      stats,
      recentOrders,
      activeCarts
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get orders
    const orders = await Order.find(query)
      .populate('user', 'fullName email')
      .populate('items.product', 'name image')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

module.exports = router;
