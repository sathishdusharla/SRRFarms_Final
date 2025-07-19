import { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  Search,
  Mail,
  Phone,
  User as UserIcon,
  Calendar,
  Eye,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PasswordReset {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  userEmail: string;
  userPhone: string;
  userFullName: string;
  status: 'pending' | 'completed' | 'rejected';
  adminNotes: string;
  createdAt: string;
  completedAt?: string;
  completedBy?: {
    fullName: string;
    email: string;
  };
}

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AdminOrder {
  _id: string;
  orderNumber: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
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
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  isGuestOrder?: boolean;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [passwordResets, setPasswordResets] = useState<PasswordReset[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Performance optimization - cache data
  const [dataCache, setDataCache] = useState<{
    orders?: AdminOrder[];
    users?: AdminUser[];
    passwordResets?: PasswordReset[];
    timestamp?: number;
  }>({});
  
  // Password Reset Management
  const [selectedReset, setSelectedReset] = useState<PasswordReset | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resetFilter, setResetFilter] = useState('pending');
  
  // User Management
  const [userSearch, setUserSearch] = useState('');
  const [userPage] = useState(1);
  
  // Order Management
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  
  const { user } = useAuth();

  // Cache duration: 2 minutes
  const CACHE_DURATION = 2 * 60 * 1000;

  // Check if cached data is still valid
  const isCacheValid = (timestamp?: number) => {
    return timestamp && (Date.now() - timestamp) < CACHE_DURATION;
  };

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    const data = await response.json();
    return { response, data };
  };

  // Optimized fetch functions with caching
  const fetchPasswordResets = async (useCache = true) => {
    if (useCache && dataCache.passwordResets && isCacheValid(dataCache.timestamp)) {
      setPasswordResets(dataCache.passwordResets);
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 Fetching password resets with filter:', resetFilter);
      const { data } = await apiCall(`/admin/password-resets?status=${resetFilter}`);
      console.log('📦 Password resets API response:', data);
      if (data.success) {
        const resets = data.data.requests || data.data.passwordResets || [];
        console.log('✅ Final password resets:', resets);
        setPasswordResets(resets);
        setDataCache(prev => ({ 
          ...prev, 
          passwordResets: resets, 
          timestamp: Date.now() 
        }));
      }
    } catch (error) {
      setError('Failed to fetch password resets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users with caching
  const fetchUsers = async (useCache = true) => {
    if (useCache && dataCache.users && isCacheValid(dataCache.timestamp) && !userSearch) {
      setUsers(dataCache.users);
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await apiCall(`/admin/users?search=${userSearch}&page=${userPage}`);
      if (data.success) {
        const usersList = data.data.users;
        setUsers(usersList);
        if (!userSearch) {
          setDataCache(prev => ({ 
            ...prev, 
            users: usersList, 
            timestamp: Date.now() 
          }));
        }
      }
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders with caching
  const fetchOrders = async (useCache = true) => {
    if (useCache && dataCache.orders && isCacheValid(dataCache.timestamp) && !orderSearch && orderFilter === 'all') {
      setOrders(dataCache.orders);
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await apiCall(`/orders/admin/all?status=${orderFilter}&search=${orderSearch}&limit=20`);
      if (data.success) {
        const ordersList = data.orders || [];
        setOrders(ordersList);
        if (!orderSearch && orderFilter === 'all') {
          setDataCache(prev => ({ 
            ...prev, 
            orders: ordersList, 
            timestamp: Date.now() 
          }));
        }
      }
    } catch (error) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search for better performance
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeTab === 'users') {
        fetchUsers(false); // Force refresh on search
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [userSearch]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeTab === 'orders') {
        fetchOrders(false); // Force refresh on search
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [orderSearch, orderFilter]);

  // Update order status with optimistic updates
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic update - update UI immediately
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      const { data } = await apiCall(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (data.success) {
        setSuccessMessage('Order status updated successfully');
        // Clear cache to ensure fresh data on next load
        setDataCache(prev => ({ ...prev, orders: undefined }));
        
        // Auto-hide success message
        setTimeout(() => setSuccessMessage(''), 2000);
      }
    } catch (error) {
      // Revert optimistic update on error
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: order.status } : order
        )
      );
      setError('Failed to update order status');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle password reset action
  const handlePasswordReset = async (resetId: string, action: 'approve' | 'reject') => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { response, data } = await apiCall(`/admin/password-resets/${resetId}/handle`, {
        method: 'POST',
        body: JSON.stringify({ action, adminNotes }),
      });

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setSelectedReset(null);
        setAdminNotes('');
        fetchPasswordResets();
      } else {
        setError(data.message || 'Action failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes - optimized with caching
  useEffect(() => {
    if (!isOpen || !user?.isAdmin) return;
    
    // Clear error and success messages when switching tabs
    setError('');
    setSuccessMessage('');
    
    if (activeTab === 'password-resets') {
      fetchPasswordResets();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, isOpen]);

  // Early returns after all hooks - with better error handling
  if (!isOpen) return null;
  
  // Show loading state if user is not yet loaded
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }
  
  // Show access denied for non-admin users
  if (!user.isAdmin) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
          <div className="text-yellow-600 mb-2 text-lg font-semibold">Access Denied</div>
          <div className="text-gray-600 mb-4">You don't have admin privileges.</div>
          <button
            onClick={onClose}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'orders', label: 'Order Management', icon: Package },
    { id: 'password-resets', label: 'Password Resets', icon: Clock },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-6 border-r">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Admin Panel</h3>
                <p className="text-sm text-gray-600">{user?.fullName || user?.email || 'Admin User'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
                        <p className="text-2xl font-bold text-blue-700">{users?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <Clock className="w-8 h-8 text-yellow-600" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-yellow-900">Pending Resets</h3>
                        <p className="text-2xl font-bold text-yellow-700">
                          {passwordResets?.filter(r => r.status === 'pending')?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-green-900">Total Orders</h3>
                        <p className="text-2xl font-bold text-green-700">{orders?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('password-resets')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                      <Clock className="w-6 h-6 text-yellow-600 mb-2" />
                      <h4 className="font-medium text-gray-800">Password Resets</h4>
                      <p className="text-sm text-gray-600">Handle pending password reset requests</p>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('users')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                      <Users className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-800">User Management</h4>
                      <p className="text-sm text-gray-600">View and manage registered users</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Password Resets Tab */}
            {activeTab === 'password-resets' && (
              <div className="space-y-6">
                {/* Filter */}
                <div className="flex space-x-2">
                  {['pending', 'completed', 'rejected', 'all'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setResetFilter(status)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        resetFilter === status
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Password Reset Requests */}
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
                        <span className="text-gray-600">Loading password resets...</span>
                      </div>
                    </div>
                  ) : passwordResets && passwordResets.length > 0 ? (
                    passwordResets.map((reset) => (
                    <div key={reset._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h4 className="font-semibold text-gray-800">{reset.userFullName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reset.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              reset.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {reset.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{reset.userEmail}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{reset.userPhone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Requested: {new Date(reset.createdAt).toLocaleDateString()}</span>
                            </div>
                            {reset.completedAt && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Completed: {new Date(reset.completedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {reset.adminNotes && (
                            <div className="bg-gray-50 rounded p-3 mb-3">
                              <p className="text-sm text-gray-700">
                                <strong>Admin Notes:</strong> {reset.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        {reset.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedReset(reset)}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                              <Eye className="w-4 h-4 inline mr-1" />
                              Handle
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Password Reset Requests</h3>
                      <p className="text-gray-500">
                        {resetFilter === 'all' 
                          ? 'No password reset requests found.'
                          : `No ${resetFilter} password reset requests found.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Orders Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="px-3 py-2 border rounded-lg flex-1"
                  />
                </div>

                {/* Orders List */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mr-3"></div>
                      <span className="text-gray-600">Loading orders...</span>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {!orders || orders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                              {loading ? 'Loading orders...' : 'No orders found'}
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{order._id.slice(-8)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {order.isGuestOrder ? (
                                  <div>
                                    <div className="font-medium">Guest User</div>
                                    <div className="text-xs text-gray-500">{order.customer?.email}</div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="font-medium">{order.user?.fullName || order.customer?.name || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{order.user?.email || order.customer?.email}</div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {order.items?.length || 0} items
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{order.total?.toFixed(2) || '0.00'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : order.status === 'confirmed'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : order.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                  className="text-xs border rounded px-2 py-1"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
                        <span className="text-gray-600">Loading users...</span>
                      </div>
                    </div>
                  ) : users && users.length > 0 ? (
                    users.map((userItem) => (
                    <div key={userItem._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-800">{userItem.fullName}</h4>
                              {userItem.isAdmin && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                  Admin
                                </span>
                              )}
                              {userItem.isVerified && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>{userItem.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{userItem.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Joined: {new Date(userItem.createdAt).toLocaleDateString()}</span>
                              </div>
                              {userItem.lastLogin && (
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4" />
                                  <span>Last Login: {new Date(userItem.lastLogin).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                      <p className="text-gray-500">
                        {userSearch ? `No users found matching "${userSearch}".` : 'No users found.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {selectedReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Handle Password Reset</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600"><strong>User:</strong> {selectedReset.userFullName}</p>
                <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedReset.userEmail}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedReset.userPhone}</p>
                <p className="text-sm text-gray-600">
                  <strong>Requested:</strong> {new Date(selectedReset.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Add notes about this request..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handlePasswordReset(selectedReset._id, 'approve')}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Approve & Send New Password'}
              </button>
              <button
                onClick={() => handlePasswordReset(selectedReset._id, 'reject')}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Reject Request'}
              </button>
              <button
                onClick={() => {
                  setSelectedReset(null);
                  setAdminNotes('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
