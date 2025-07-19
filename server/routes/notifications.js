const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/notifications/order-confirmation - Send order confirmation
router.post('/order-confirmation', async (req, res) => {
  try {
    const { order, customer } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffaa00;">Order Confirmation</h2>
          <p>Dear ${customer.name},</p>
          <p>Thank you for your order! We've received your order and will process it shortly.</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${order.total}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; margin: 20px 0;">
            <h4>Payment Information</h4>
            <p>Please complete your payment using the following details:</p>
            <p><strong>UPI ID:</strong> 9490507045-4@ybl</p>
            <p><strong>Phone:</strong> +91 9490507045</p>
          </div>
          
          <p>For any queries, contact us at +91 9490507045 or reply to this email.</p>
          <p>Thank you for choosing SRR Farms!</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Order confirmation sent'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/notifications/status-update - Send order status update
router.post('/status-update', async (req, res) => {
  try {
    const { order, customer, status } = req.body;
    
    let statusMessage = '';
    switch (status) {
      case 'confirmed':
        statusMessage = 'Your order has been confirmed and is being prepared.';
        break;
      case 'shipped':
        statusMessage = 'Your order has been shipped and is on its way!';
        break;
      case 'delivered':
        statusMessage = 'Your order has been delivered. Thank you for choosing SRR Farms!';
        break;
      default:
        statusMessage = `Your order status has been updated to: ${status}`;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffaa00;">Order Status Update</h2>
          <p>Dear ${customer.name},</p>
          <p>${statusMessage}</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Current Status:</strong> ${status}</p>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          </div>
          
          <p>For any queries, contact us at +91 9490507045.</p>
          <p>Thank you for choosing SRR Farms!</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Status update sent'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/notifications/low-stock - Send low stock alert (Admin)
router.post('/low-stock', async (req, res) => {
  try {
    const { products } = req.body;
    
    const productList = products.map(p => 
      `<li>${p.name} (${p.size}) - Stock: ${p.stock}</li>`
    ).join('');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Low Stock Alert - SRR Farms',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b6b;">Low Stock Alert</h2>
          <p>The following products are running low on stock:</p>
          <ul>${productList}</ul>
          <p>Please restock these items soon to avoid stockouts.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Low stock alert sent'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;