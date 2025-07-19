const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_9999999999',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_key'
    });
  }

  // Create UPI payment order
  async createUPIOrder(orderDetails) {
    try {
      const options = {
        amount: Math.round(orderDetails.amount * 100), // Amount in paise
        currency: 'INR',
        receipt: orderDetails.receipt,
        payment_capture: 1,
        notes: {
          order_id: orderDetails.orderId,
          customer_name: orderDetails.customerName,
          customer_email: orderDetails.customerEmail
        }
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify UPI payment signature
  verifyPaymentSignature(paymentData) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = paymentData;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret_key')
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      return {
        success: isAuthentic,
        verified: isAuthentic
      };
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return {
        success: false,
        verified: false,
        error: error.message
      };
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount / 100, // Convert back to rupees
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          order_id: payment.order_id,
          vpa: payment.vpa, // UPI VPA if available
          bank: payment.bank,
          created_at: new Date(payment.created_at * 1000),
          captured: payment.captured,
          fee: payment.fee / 100,
          tax: payment.tax / 100
        }
      };
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create test UPI payment (for development)
  createTestUPIPayment(amount, orderId) {
    return {
      success: true,
      order_id: `test_order_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      status: 'created',
      test_mode: true,
      payment_link: `upi://pay?pa=test@paytm&pn=SRR Farms&am=${amount}&cu=INR&tn=Order ${orderId}`
    };
  }

  // Simulate payment verification for testing
  simulateTestPayment(orderId) {
    const paymentId = `test_pay_${Date.now()}`;
    const signature = crypto
      .createHmac('sha256', 'test_secret_key')
      .update(`test_order_${orderId}|${paymentId}`)
      .digest('hex');

    return {
      razorpay_order_id: `test_order_${orderId}`,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      test_mode: true
    };
  }
}

module.exports = new PaymentService();
