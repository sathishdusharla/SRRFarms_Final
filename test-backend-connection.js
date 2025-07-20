// Quick test to verify backend connection

const testBackendConnection = async () => {
  const API_BASE = 'http://localhost:3001/api';
  
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE}/health`);
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend is healthy:', healthData);
    }
    
    // Test products endpoint
    const productsResponse = await fetch(`${API_BASE}/products`);
    console.log('Products endpoint status:', productsResponse.status);
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ Products endpoint working, found:', productsData.length, 'products');
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
};

// Run the test
testBackendConnection();
