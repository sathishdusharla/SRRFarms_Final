// Demo authentication for when backend is not available
export interface DemoUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  };
  dateOfBirth: string;
  gender: string;
  isAdmin: boolean;
  isVerified: boolean;
  profileImage?: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: 'demo-user-1',
    fullName: 'Demo User',
    email: 'demo@srrfarms.com',
    phone: '+919490507045',
    address: {
      street: '123 Demo Street',
      city: 'Demo City',
      state: 'Demo State',
      pincode: '123456',
      isDefault: true
    },
    dateOfBirth: '1990-01-01',
    gender: 'Other',
    isAdmin: false,
    isVerified: true
  },
  {
    id: 'demo-admin-1',
    fullName: 'Demo Admin',
    email: 'admin@srrfarms.com',
    phone: '+919490507045',
    address: {
      street: '456 Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      pincode: '654321',
      isDefault: true
    },
    dateOfBirth: '1985-05-15',
    gender: 'Other',
    isAdmin: true,
    isVerified: true
  }
];

export const demoLogin = (identifier: string, password: string) => {
  // Demo credentials
  const validCredentials = [
    { email: 'demo@srrfarms.com', password: 'demo123' },
    { email: 'admin@srrfarms.com', password: 'admin123' },
    { email: 'user@demo.com', password: 'password' },
  ];

  const isValid = validCredentials.some(
    cred => (cred.email === identifier || identifier === 'demo') && 
           (cred.password === password || password === 'demo')
  );

  if (isValid) {
    const user = identifier.includes('admin') || identifier === 'admin@srrfarms.com' 
      ? demoUsers[1] 
      : demoUsers[0];
    
    return {
      success: true,
      message: 'Demo login successful!',
      user,
      token: `demo-token-${Date.now()}`
    };
  }

  return {
    success: false,
    message: 'Invalid credentials. Try: demo@srrfarms.com / demo123 or admin@srrfarms.com / admin123'
  };
};

export const demoSignup = (userData: any) => {
  // Simulate successful signup
  const newUser: DemoUser = {
    id: `demo-user-${Date.now()}`,
    fullName: userData.fullName || 'New Demo User',
    email: userData.email || 'newuser@demo.com',
    phone: userData.phone || '+919999999999',
    address: {
      street: userData.address?.street || 'Demo Address',
      city: userData.address?.city || 'Demo City',
      state: userData.address?.state || 'Demo State',
      pincode: userData.address?.pincode || '000000',
      isDefault: true
    },
    dateOfBirth: userData.dateOfBirth || '1995-01-01',
    gender: userData.gender || 'Other',
    isAdmin: false,
    isVerified: true
  };

  return {
    success: true,
    message: 'Demo signup successful!',
    user: newUser,
    token: `demo-token-${Date.now()}`
  };
};

export const demoOrders = [
  {
    _id: 'demo-order-1',
    orderNumber: 'ORD-DEMO-001',
    status: 'pending_verification',
    paymentMethod: 'UPI',
    paymentStatus: 'pending_verification',
    totalAmount: 299,
    items: [
      {
        productId: 'demo-product-1',
        name: 'Fresh Organic Tomatoes',
        quantity: 2,
        price: 149.50
      }
    ],
    shippingAddress: {
      street: '123 Demo Street',
      city: 'Demo City',
      state: 'Demo State',
      pincode: '123456'
    },
    createdAt: new Date().toISOString(),
    paymentScreenshot: 'demo-screenshot.jpg',
    upiTransactionId: 'DEMO123456789'
  },
  {
    _id: 'demo-order-2',
    orderNumber: 'ORD-DEMO-002',
    status: 'delivered',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'confirmed',
    totalAmount: 199,
    items: [
      {
        productId: 'demo-product-2',
        name: 'Organic Rice',
        quantity: 1,
        price: 199
      }
    ],
    shippingAddress: {
      street: '123 Demo Street',
      city: 'Demo City',
      state: 'Demo State',
      pincode: '123456'
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const isDemoMode = () => {
  return !import.meta.env.VITE_API_URL || import.meta.env.VITE_DEMO_MODE === 'true';
};
