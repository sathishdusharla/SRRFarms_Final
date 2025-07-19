import React from 'react';
import { AlertCircle, ExternalLink, Server } from 'lucide-react';

interface DemoModeNoticeProps {
  onClose: () => void;
}

const DemoModeNotice: React.FC<DemoModeNoticeProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Backend Not Available
            </h3>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            The frontend is deployed but the backend server is not yet available. 
            To use the full functionality including authentication and payments, 
            please deploy the backend first.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              <Server className="inline w-4 h-4 mr-1" />
              Backend Deployment Options:
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Railway.app (Recommended)</li>
              <li>• Render.com</li>
              <li>• Heroku</li>
              <li>• DigitalOcean App Platform</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Current Features Available:
            </h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Frontend UI and design</li>
              <li>• Product browsing (static data)</li>
              <li>• Shopping cart (local storage)</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Continue Browsing
          </button>
          <a
            href="https://github.com/sathishdusharla/SRRFarms_Final"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Code
          </a>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            This is a complete e-commerce platform ready for production!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoModeNotice;
