import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: any;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  paymentDetails: {
    upi_transaction_id?: string;
    payment_screenshot?: string;
    upi_id?: string;
    amount_paid?: number;
    verification_status?: string;
    admin_notes?: string;
    verified_at?: string;
    payment_date?: string;
  };
  notes?: string;
  createdAt: string;
}

interface AdminPaymentVerificationProps {
  onBack: () => void;
}

export default function AdminPaymentVerification({ onBack }: AdminPaymentVerificationProps) {
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/admin/pending-verifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPendingOrders(data.orders);
      } else {
        console.error('Error fetching pending verifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: string, action: 'approve' | 'reject') => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/payments/admin/verify-payment/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action,
          adminNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Payment ${action}d successfully!`);
        setSelectedOrder(null);
        setAdminNotes('');
        fetchPendingVerifications(); // Refresh the list
      } else {
        alert(`Error ${action}ing payment: ${data.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error);
      alert(`Error ${action}ing payment. Please try again.`);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Verification</h1>
          <p className="text-gray-600">Review and verify UPI payments</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No pending payment verifications</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-gray-600">
                    Customer: {order.customer.name} ({order.customer.email})
                  </p>
                  <p className="text-gray-600">
                    Phone: {order.customer.phone}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(order.total)}
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Pending Verification
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>UPI ID:</span>
                      <span className="font-mono">{order.paymentDetails.upi_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono">{order.paymentDetails.upi_transaction_id || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Paid:</span>
                      <span className="font-medium">{formatCurrency(order.paymentDetails.amount_paid || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Date:</span>
                      <span>{formatDate(order.paymentDetails.payment_date || order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Payment Screenshot */}
                  {order.paymentDetails.payment_screenshot && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Payment Screenshot</h5>
                      <img
                        src={`/uploads/payment-screenshots/${order.paymentDetails.payment_screenshot}`}
                        alt="Payment Screenshot"
                        className="max-w-full h-48 object-contain border border-gray-300 rounded-lg cursor-pointer"
                        onClick={() => {
                          window.open(`/uploads/payment-screenshots/${order.paymentDetails.payment_screenshot}`, '_blank');
                        }}
                      />
                    </div>
                  )}

                  {/* Customer Notes */}
                  {order.notes && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Customer Notes</h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Review Payment
                  </button>
                  <button
                    onClick={() => handleVerifyPayment(order._id, 'approve')}
                    disabled={processing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    Quick Approve
                  </button>
                  <button
                    onClick={() => handleVerifyPayment(order._id, 'reject')}
                    disabled={processing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                  >
                    Quick Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Review Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Review Payment - Order #{selectedOrder.orderNumber}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Payment Screenshot */}
              {selectedOrder.paymentDetails.payment_screenshot && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Payment Screenshot</h4>
                  <img
                    src={`/uploads/payment-screenshots/${selectedOrder.paymentDetails.payment_screenshot}`}
                    alt="Payment Screenshot"
                    className="max-w-full h-64 object-contain border border-gray-300 rounded-lg mx-auto"
                  />
                </div>
              )}

              {/* Admin Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about the verification..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleVerifyPayment(selectedOrder._id, 'approve')}
                  disabled={processing}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {processing ? 'Processing...' : '✅ Approve Payment'}
                </button>
                <button
                  onClick={() => handleVerifyPayment(selectedOrder._id, 'reject')}
                  disabled={processing}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {processing ? 'Processing...' : '❌ Reject Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
