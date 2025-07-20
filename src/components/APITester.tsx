import { useState } from 'react';

const APITester = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      const baseURL = typeof window !== 'undefined' && (
        window.location.hostname === 'srrfarms.netlify.app' || 
        window.location.hostname === 'srrfarms-final.netlify.app' ||
        window.location.hostname !== 'localhost'
      ) ? 'https://srrfarms-backend.onrender.com/api'
        : 'http://localhost:3001/api';

      console.log('Testing backend at:', baseURL);
      
      // Test health endpoint
      const healthResponse = await fetch(`${baseURL}/health`);
      const healthData = await healthResponse.text();
      
      let result = `Backend URL: ${baseURL}\n`;
      result += `Health Check: ${healthResponse.status} - ${healthData}\n`;
      
      // Test orders endpoint (guest order)
      const testOrder = {
        customer: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          address: {
            fullAddress: 'Test Address'
          }
        },
        items: [{
          productId: 'test',
          name: 'Test Product',
          price: 100,
          quantity: 1,
          size: '1kg'
        }],
        paymentMethod: 'cod',
        subtotal: 100,
        tax: 10,
        shippingCost: 20,
        total: 130,
        notes: 'Test order',
        orderType: 'guest'
      };

      try {
        const orderResponse = await fetch(`${baseURL}/orders/guest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testOrder)
        });
        
        const orderData = await orderResponse.text();
        result += `\nGuest Order Test: ${orderResponse.status}\n`;
        result += `Response: ${orderData.substring(0, 200)}...\n`;
      } catch (orderError) {
        result += `\nGuest Order Error: ${orderError}\n`;
      }

      setTestResult(result);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">API Debug Tool</h3>
      <button 
        onClick={testBackendConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Backend'}
      </button>
      {testResult && (
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default APITester;
