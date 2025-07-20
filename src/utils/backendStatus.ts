// Backend status checker utility

export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Set a short timeout for status check
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    return response.ok;
  } catch (error) {
    console.log('Backend not available:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};

export const showBackendNotAvailableMessage = () => {
  return {
    title: 'Backend Server Not Available',
    message: 'The backend server is not running. Please start the backend server to enable full functionality.',
    instructions: [
      '1. Open terminal and navigate to project directory',
      '2. Run: npm run start:backend',
      '3. Or run: ./start-backend.sh',
      '4. Verify server is running at http://localhost:3001/api/health'
    ]
  };
};
