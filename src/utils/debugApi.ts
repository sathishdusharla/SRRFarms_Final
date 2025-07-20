// Debug utility for API calls

export const debugApiCall = async (endpoint: string, options: any = {}) => {
  const baseURL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? 'https://srrfarms-backend.onrender.com/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  
  const url = `${baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  console.log('🔍 API Debug Info:');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');
  console.log('Base URL:', baseURL);
  console.log('Full URL:', url);
  console.log('Method:', options.method || 'GET');
  console.log('Body:', options.body);
  
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response Text:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('Parsed Data:', data);
      return { success: response.ok, data, status: response.status };
    } catch {
      return { success: response.ok, data: responseText, status: response.status };
    }
  } catch (error) {
    console.error('❌ API Call Failed:', error);
    throw error;
  }
};
