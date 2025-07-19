import React from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';

interface OrderSuccessProps {
  orderInfo: any;
  onContinueShopping: () => void;
}

export default function OrderSuccess({ orderInfo, onContinueShopping }: OrderSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">#{orderInfo.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-yellow-600">₹{orderInfo.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600 capitalize">{orderInfo.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Address:</span>
                <span className="font-semibold text-right max-w-xs">{orderInfo.customerInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {orderInfo.items.map((item: any) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="text-left">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-600 text-sm">{item.product.size}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-yellow-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-3">What's Next?</h3>
            <div className="space-y-2 text-left">
              <p className="text-gray-700">• We'll send you a confirmation email shortly</p>
              <p className="text-gray-700">• Your order will be processed within 24 hours</p>
              <p className="text-gray-700">• You'll receive tracking information once shipped</p>
              <p className="text-gray-700">• Expected delivery: 3-5 business days</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onContinueShopping}
              className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-300"
            >
              Continue Shopping
            </button>
            <a
              href="https://wa.me/919490507045"
              className="flex items-center justify-center space-x-2 bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Us</span>
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t text-gray-600">
            <p className="text-sm">
              Questions about your order? Contact us at{' '}
              <a href="tel:+919490507045" className="text-yellow-600 hover:underline">
                +91 9490507045
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}