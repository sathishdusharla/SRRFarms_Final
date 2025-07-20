import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CustomerInfo } from '../types';
import UPIPayment from './UPIPayment';
import { api } from '../utils/api';

interface CheckoutProps {
  onBack: () => void;
  onOrderComplete: (orderInfo: any) => void;
}

export default function Checkout({ onBack, onOrderComplete }: CheckoutProps) {
  const { state, getTotalPrice, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [showUPIPayment, setShowUPIPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: userProfile?.fullName || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address?.street || '',
    notes: ''
  });

  const shippingCost = 50;
  const taxRate = 0.05;
  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (paymentMethod === 'upi') {
      setShowUPIPayment(true);
    } else {
      // Process COD order
      handleCODOrder();
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          isGuest: !user
        },
        shippingAddress: {
          street: customerInfo.address,
          city: 'Not specified',
          state: 'Not specified',
          zipCode: '000000',
          country: 'India'
        },
        items: state.items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.product.size
        })),
        paymentMethod: 'cod',
        subtotal: subtotal,
        tax: tax,
        shippingCost: shippingCost,
        total: total,
        notes: customerInfo.notes,
        orderType: user ? 'registered' : 'guest'
      };

      // Debug logging
      console.log('🔍 Creating Order:');
      console.log('User:', user);
      console.log('Order Data:', orderData);
      console.log('API Base URL:', import.meta.env.VITE_API_URL);
      console.log('Current hostname:', window.location.hostname);

      // Use guest order API for non-authenticated users, regular COD for authenticated users
      const data = user 
        ? await api.createCODOrder(orderData)
        : await api.createGuestOrder(orderData);

      if (data.success) {
        clearCart();
        onOrderComplete({
          order: data.order,
          paymentMethod: 'Cash on Delivery',
          message: user 
            ? 'Order created successfully!' 
            : 'Guest order created successfully! You will receive confirmation via email.'
        });
      } else {
        alert('Failed to create order: ' + data.message);
      }
    } catch (error) {
      console.error('COD order error:', error);
      
      // Check if this is a backend connectivity issue
      if (error instanceof Error && error.message.includes('Backend server is not available')) {
        alert('Backend server is not available. Please deploy the backend to process payments. For now, this is a frontend demonstration.');
      } else if (error instanceof Error && error.message.includes('fetch')) {
        alert('Unable to connect to server. Please check the backend URL: https://srrfarms-backend.onrender.com/api');
      } else {
        alert(`Failed to create order. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUPISuccess = (order: any) => {
    setShowUPIPayment(false);
    clearCart();
    onOrderComplete({
      order: order,
      paymentMethod: 'UPI',
      message: 'Order created successfully! Waiting for payment verification.'
    });
  };

  const handleUPICancel = () => {
    setShowUPIPayment(false);
  };

  const isFormValid = customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.address;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-yellow-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              /* Step 1: Customer Information */
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Shipping Information</h2>
                  {!user && (
                    <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      ✓ Guest Checkout Available
                    </div>
                  )}
                </div>
                
                {!user && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Shopping as Guest</h3>
                    <p className="text-sm text-blue-600">
                      You can complete your purchase without creating an account. 
                      Your order will be processed and you'll receive confirmation via email.
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        required
                        disabled={!!userProfile?.fullName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                        disabled={!!user?.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      disabled={!!userProfile?.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your complete address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={customerInfo.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="Any special instructions"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      isFormValid
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            ) : (
              /* Step 2: Payment */
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                
                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  {/* UPI Payment Option */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'upi' 
                        ? 'border-yellow-600 bg-yellow-50' 
                        : 'border-gray-300 bg-white hover:border-yellow-400'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'upi' | 'cod')}
                        className="text-yellow-600 focus:ring-yellow-500"
                      />
                      <CreditCard className="w-6 h-6 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800">UPI Payment</h3>
                        <p className="text-gray-600 text-sm">Pay online using UPI (requires admin verification)</p>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery Option */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-300 bg-white hover:border-green-400'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'upi' | 'cod')}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <Truck className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Cash on Delivery</h3>
                        <p className="text-gray-600 text-sm">Pay when your order is delivered</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Specific Info */}
                {paymentMethod === 'upi' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">UPI Payment Process:</h4>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Click "Proceed to UPI Payment" below</li>
                      <li>2. Pay using UPI ID or scan QR code</li>
                      <li>3. Upload payment screenshot</li>
                      <li>4. Admin will verify and confirm your order</li>
                    </ol>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-green-800 mb-2">Cash on Delivery:</h4>
                    <p className="text-sm text-green-700">
                      Your order will be confirmed immediately. Pay the delivery person when your order arrives.
                    </p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${
                      loading 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : paymentMethod === 'upi' 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {loading ? 'Processing...' : paymentMethod === 'upi' ? 'Proceed to UPI Payment' : 'Confirm COD Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-gray-600 text-xs">{item.product.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Shipping:</span>
                  <span>₹{shippingCost}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Tax (5%):</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-yellow-600">₹{total}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UPI Payment Modal */}
        {showUPIPayment && (
          <UPIPayment
            orderTotal={total}
            shippingAddress={{
              street: customerInfo.address,
              city: 'Not specified',
              state: 'Not specified',
              zipCode: '000000',
              country: 'India'
            }}
            onSuccess={handleUPISuccess}
            onCancel={handleUPICancel}
          />
        )}
      </div>
    </div>
  );
}