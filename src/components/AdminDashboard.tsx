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
  Eye
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

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [passwordResets, setPasswordResets] = useState<PasswordReset[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password Reset Management
  const [selectedReset, setSelectedReset] = useState<PasswordReset | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resetFilter, setResetFilter] = useState('pending');
  
  // User Management
  const [userSearch, setUserSearch] = useState('');
  const [userPage] = useState(1);
  
  const { user } = useAuth();

  if (!isOpen || !user?.isAdmin) return null;

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

  // Fetch password resets
  const fetchPasswordResets = async () => {
    setLoading(true);
    try {
      const { data } = await apiCall(`/admin/password-resets?status=${resetFilter}`);
      if (data.success) {
        setPasswordResets(data.data.requests);
      }
    } catch (error) {
      setError('Failed to fetch password resets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await apiCall(`/admin/users?search=${userSearch}&page=${userPage}`);
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
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

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'password-resets') {
      fetchPasswordResets();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, resetFilter, userSearch, userPage]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
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
                <p className="text-sm text-gray-600">{user.fullName}</p>
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
                        <p className="text-2xl font-bold text-blue-700">-</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <Clock className="w-8 h-8 text-yellow-600" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-yellow-900">Pending Resets</h3>
                        <p className="text-2xl font-bold text-yellow-700">
                          {passwordResets.filter(r => r.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-green-900">Completed Today</h3>
                        <p className="text-2xl font-bold text-green-700">-</p>
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
                  {passwordResets.map((reset) => (
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
                  ))}
                </div>
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
                  {users.map((userItem) => (
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
                  ))}
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
