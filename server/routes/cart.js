const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all cart routes
router.use(authenticateToken);

// Get user's cart (by email if provided)
router.get('/', async (req, res) => {
  try {
    const email = req.query.email;
    let userId = req.user._id;
    if (email) {
      const user = await User.findOne({ email });
      if (user) userId = user._id;
    }
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: userId });
      await cart.save();
    }
    // Map items to frontend format
    const items = cart.items.map(item => ({
      product: {
        id: item.product._id?.toString() || item.product.id,
        name: item.product.name,
        size: item.product.size,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        image: item.product.image,
        rating: item.product.rating || 0,
        reviews: item.product.reviews || 0,
        badge: item.product.badge || '',
        description: item.product.description || '',
        benefits: item.product.benefits || [],
        inStock: item.product.inStock !== undefined ? item.product.inStock : true,
        category: item.product.category || '',
      },
      quantity: item.quantity
    }));
    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving cart'
    });
  }
});

// Save cart to backend (by email if provided)
router.put('/', async (req, res) => {
  try {
    const { items } = req.body;
    const email = req.query.email;
    let userId = req.user._id;
    if (email) {
      const user = await User.findOne({ email });
      if (user) userId = user._id;
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }
    cart.items = items;
    await cart.save();
    await cart.populate('items.product');
    res.json({
      success: true,
      items: cart.items
    });
  } catch (error) {
    console.error('Save cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving cart'
    });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get or create user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id });
    }

    // Add item to cart
    await cart.addItem(product, quantity);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart'
    });
  }
});

// Update item quantity in cart
router.put('/update/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.updateQuantity(productId, quantity);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated',
      cart: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart'
    });
  }
});

// Remove item from cart
router.delete('/remove/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(productId);
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart'
    });
  }
});

// Clear entire cart
router.delete('/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart'
    });
  }
});

module.exports = router;
