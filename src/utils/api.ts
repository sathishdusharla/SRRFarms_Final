// API utility functions for consistent API calls across the application

const getApiBaseUrl = (): string => {
  // For production deployment, check if we're in production environment
  if (typeof window !== 'undefined' && (
    window.location.hostname === 'srrfarms.netlify.app' || 
    window.location.hostname === 'srrfarms-final.netlify.app' ||
    window.location.hostname !== 'localhost'
  )) {
    // Production environment - use Render backend
    return 'https://srrfarms-backend.onrender.com/api';
  }
  // Development environment - use environment variable or localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
};

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

export const apiCall = async (endpoint: string, options: ApiOptions = {}): Promise<any> => {
  const {
    method = 'GET',
    headers = {},
    body,
    requireAuth = true
  } = options;

  const baseURL = getApiBaseUrl();
  const url = `${baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Remove Content-Type for FormData
  if (body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API call failed:', error);
    
    // Check if this is a network error (backend not available)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Backend is not available, show user-friendly message
      if (endpoint.includes('/orders') || endpoint.includes('/payments')) {
        throw new Error('Backend server is not available. Please deploy the backend to process payments. For now, this is a frontend demonstration.');
      }
    }
    
    throw error;
  }
};

// Specific API functions
export const api = {
  // Auth endpoints
  login: (credentials: any) => apiCall('/auth/login', {
    method: 'POST',
    body: credentials,
    requireAuth: false
  }),

  register: (userData: any) => apiCall('/auth/register', {
    method: 'POST',
    body: userData,
    requireAuth: false
  }),

  // Payment endpoints
  getUPIInfo: () => apiCall('/payments/upi-info', { requireAuth: false }),
  
  createUPIOrder: (formData: FormData) => apiCall('/payments/create-upi-order', {
    method: 'POST',
    body: formData,
    requireAuth: false
  }),

  createCODOrder: (orderData: any) => apiCall('/payments/create-cod-order', {
    method: 'POST',
    body: orderData
  }),

  createGuestOrder: (orderData: any) => apiCall('/orders/guest', {
    method: 'POST',
    body: orderData,
    requireAuth: false
  }),

  // Admin endpoints (temporary public access for demo)
  getAllOrders: () => apiCall('/orders/admin/all-public', { requireAuth: false }),
  
  getPendingVerifications: () => apiCall('/payments/admin/pending-verifications'),
  
  verifyPayment: (orderId: string, action: 'approve' | 'reject') => apiCall(`/payments/admin/verify-payment/${orderId}`, {
    method: 'POST',
    body: { action }
  }),

  markDelivered: (orderId: string) => apiCall(`/payments/admin/mark-delivered/${orderId}`, {
    method: 'POST'
  }),

  // Orders endpoints
  getUserOrders: () => apiCall('/orders/user'),
  
  getOrderById: (orderId: string) => apiCall(`/orders/${orderId}`),

  // Products endpoints
  getProducts: () => apiCall('/products', { requireAuth: false }),
  
  getProductById: (productId: string) => apiCall(`/products/${productId}`, { requireAuth: false }),

  // Cart endpoints
  getCart: () => apiCall('/cart'),
  
  addToCart: (productId: string, quantity: number) => apiCall('/cart/add', {
    method: 'POST',
    body: { productId, quantity }
  }),

  updateCartItem: (productId: string, quantity: number) => apiCall('/cart/update', {
    method: 'PUT',
    body: { productId, quantity }
  }),

  removeFromCart: (productId: string) => apiCall('/cart/remove', {
    method: 'DELETE',
    body: { productId }
  }),

  clearCart: () => apiCall('/cart/clear', {
    method: 'DELETE'
  })
};

export default api;
