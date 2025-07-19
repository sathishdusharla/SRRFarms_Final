import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Truck, Clock, CreditCard } from 'lucide-react';
import { api } from '../utils/api';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      fullAddress: string;
    };
  };
  items: Array<{
    product: {
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
  paymentDetails?: {
    upi_transaction_id?: string;
    payment_screenshot?: string;
    verification_status?: string;
    admin_notes?: string;
  };
  createdAt: string;
  deliveredAt?: string;
  notes?: string;
}

const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [actionType, setActionType] = useState<'verify' | 'deliver' | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchPendingVerifications();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getAllOrders();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchPendingVerifications = async () => {
    try {
      const data = await api.getPendingVerifications();
      if (data.success) {
        setPendingVerifications(data.orders);
      }
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
    } finally {
      setLoading(false);
    }
  };

    const handleVerifyPayment = async (orderId: string, action: 'approve' | 'reject') => {
    try {
      const data = await api.verifyPayment(orderId, action);
      if (data.success) {
        alert(`Payment ${action}d successfully`);
        fetchOrders();
        fetchPendingVerifications();
        setShowModal(false);
        setAdminNotes('');
      } else {
        alert('Failed to verify payment: ' + data.message);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment. Please try again.');
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      const data = await api.markDelivered(orderId);
      if (data.success) {
        alert('Order marked as delivered successfully');
        fetchOrders();
        setShowModal(false);
        setDeliveryNotes('');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error marking delivered:', error);
      alert('Error marking order as delivered');
    }
  };

  const openModal = (order: Order, type: 'verify' | 'deliver') => {
    setSelectedOrder(order);
    setActionType(type);
    setShowModal(true);
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (status === 'delivered') {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Delivered</span>;
    }
    if (status === 'confirmed') {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Confirmed</span>;
    }
    if (status === 'payment_pending' && paymentStatus === 'pending_verification') {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending Verification</span>;
    }
    if (status === 'cancelled') {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Cancelled</span>;
    }
    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage orders, verify payments, and track deliveries</p>
      </div>

      {/* Pending Verifications */}
      {pendingVerifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-600" />
            Pending UPI Verifications ({pendingVerifications.length})
          </h2>
          <div className="space-y-4">
            {pendingVerifications.map((order) => (
              <div key={order._id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{order.orderNumber}</h3>
                      <span className="text-lg font-bold text-green-600">₹{order.total}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">Customer: {order.customer.name}</p>
                    <p className="text-gray-600 text-sm mb-1">Phone: {order.customer.phone}</p>
                    <p className="text-gray-600 text-sm mb-2">
                      Order Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.paymentDetails?.upi_transaction_id && (
                      <p className="text-gray-600 text-sm">
                        UPI Transaction ID: {order.paymentDetails.upi_transaction_id}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(order, 'verify')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Orders */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {order.paymentMethod === 'upi' ? (
                        <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                      ) : (
                        <Truck className="w-4 h-4 mr-2 text-green-600" />
                      )}
                      <span className="text-sm text-gray-900">
                        {order.paymentMethod === 'upi' ? 'UPI' : 'COD'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{order.total}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status, order.paymentStatus)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => openModal(order, 'deliver')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.paymentStatus === 'pending_verification' && (
                        <button
                          onClick={() => openModal(order, 'verify')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Verify Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {actionType === 'verify' ? 'Verify UPI Payment' : 'Mark as Delivered'}
            </h2>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Order Details</h3>
              <p><strong>Order:</strong> {selectedOrder.orderNumber}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer.name}</p>
              <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
              <p><strong>Address:</strong> {selectedOrder.customer.address.fullAddress}</p>
            </div>

            {actionType === 'verify' && selectedOrder.paymentDetails && (
              <div className="mb-4">
                {/* Payment Screenshot */}
                {selectedOrder.paymentDetails.payment_screenshot && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Payment Screenshot:</h4>
                    <img
                      src={`/uploads/payment-screenshots/${selectedOrder.paymentDetails.payment_screenshot}`}
                      alt="Payment screenshot"
                      className="w-full max-w-xs mx-auto rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjMtZjQtZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM2Yi03MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                )}

                {/* Transaction ID */}
                {selectedOrder.paymentDetails.upi_transaction_id && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">UPI Transaction ID:</h4>
                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      {selectedOrder.paymentDetails.upi_transaction_id}
                    </p>
                  </div>
                )}

                {/* Admin Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes:
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about verification..."
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleVerifyPayment(selectedOrder._id, 'approve')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerifyPayment(selectedOrder._id, 'reject')}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            )}

            {actionType === 'deliver' && (
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes:
                  </label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Add delivery confirmation notes..."
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => handleMarkDelivered(selectedOrder._id)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Confirm Delivery
                </button>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
