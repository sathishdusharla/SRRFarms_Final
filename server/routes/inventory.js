const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/inventory - Get inventory overview
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name size stock inStock price')
      .sort({ stock: 1 });
    
    const lowStockProducts = products.filter(p => p.stock <= 10);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    
    res.json({
      success: true,
      data: {
        products,
        summary: {
          totalProducts,
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length,
          totalValue
        },
        lowStockProducts,
        outOfStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/inventory/:id/restock - Restock product
router.put('/:id/restock', async (req, res) => {
  try {
    const { quantity, notes } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    product.stock += parseInt(quantity);
    product.inStock = product.stock > 0;
    await product.save();
    
    // TODO: Log inventory movement
    
    res.json({
      success: true,
      data: product,
      message: `Restocked ${quantity} units`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/inventory/alerts - Get low stock alerts
router.get('/alerts', async (req, res) => {
  try {
    const lowStockThreshold = 10;
    
    const alerts = await Product.find({
      isActive: true,
      stock: { $lte: lowStockThreshold }
    }).select('name size stock');
    
    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;