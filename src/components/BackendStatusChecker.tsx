import React, { useState, useEffect } from 'react';
import { checkBackendStatus } from '../utils/backendStatus';
import DemoModeNotice from './DemoModeNotice';

interface BackendStatusProps {
  children: React.ReactNode;
}

const BackendStatusChecker: React.FC<BackendStatusProps> = ({ children }) => {
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const isAvailable = await checkBackendStatus();
      setBackendAvailable(isAvailable);
      
      if (!isAvailable) {
        setShowNotice(true);
      }
    };

    checkStatus();

    // Check backend status every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseNotice = () => {
    setShowNotice(false);
  };

  return (
    <>
      {children}
      {backendAvailable === false && showNotice && (
        <DemoModeNotice onClose={handleCloseNotice} />
      )}
      
      {/* Backend status indicator */}
      {backendAvailable !== null && (
        <div className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-40 ${
          backendAvailable 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {backendAvailable ? '🟢 Backend Online' : '🔴 Backend Offline'}
        </div>
      )}
    </>
  );
};

export default BackendStatusChecker;
