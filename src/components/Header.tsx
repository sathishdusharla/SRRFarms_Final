import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Store, User, Search as SearchIcon, CheckCircle, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import UserProfile from './UserProfile';
import AdminDashboard from './AdminDashboard';
import SearchBar from './SearchBar';
import { Product } from '../types';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onViewProduct: (product: Product) => void;
}

export default function Header({ onNavigate, currentPage, onViewProduct }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toggleCart, getTotalItems } = useCart();
  const { user } = useAuth();

  // Debug admin status
  console.log('Header: user =', user?.fullName, 'isAdmin =', user?.isAdmin, 'showAdmin =', showAdmin);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show success message and auto-hide after 3 seconds
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    showSuccessMessage('Login successful! Welcome back.');
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    showSuccessMessage('Account created successfully! Welcome to SRR Farms.');
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isSticky ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Store className="w-12 h-12 text-yellow-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">SRR FARMS</h2>
              <p className="text-xs text-gray-600">Est. 2025</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <SearchBar onProductSelect={onViewProduct} />
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-medium transition-colors duration-300 hover:text-yellow-600 ${
                  currentPage === item.id ? 'text-yellow-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-700 hover:text-yellow-600 transition-colors duration-300"
            >
              <SearchIcon className="w-6 h-6" />
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors duration-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Admin Dashboard Button for Admin Users */}
                {user.isAdmin && (
                  <button
                    onClick={() => {
                      console.log('🚨 Admin button clicked!');
                      setShowAdmin(true);
                    }}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-red-600 transition-colors duration-300"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="hidden lg:block font-medium">Admin</span>
                  </button>
                )}
                
                {/* User Profile Button */}
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-yellow-600 transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden lg:block font-medium">
                    {user.fullName.split(' ')[0] || 'Profile'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300"
                >
                  Sign In
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setShowSignup(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-full font-medium hover:bg-yellow-700 transition-colors duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-yellow-600 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex space-x-2 pt-4 px-4 mb-4">
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 text-center py-2 px-4 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setShowSignup(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 text-center py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile User Profile */}
            {user && (
              <div className="px-4 pt-4 mb-4">
                {/* Admin Dashboard Button for Mobile */}
                {user.isAdmin && (
                  <button
                    onClick={() => {
                      setShowAdmin(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full p-3 bg-red-50 rounded-lg mb-3"
                  >
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-red-800">Admin Dashboard</p>
                      <p className="text-sm text-red-600">Manage users & settings</p>
                    </div>
                  </button>
                )}
                
                {/* User Profile Button */}
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full p-3 bg-yellow-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">
                      {user.fullName || 'Profile'}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </button>
              </div>
            )}

            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-yellow-50 hover:text-yellow-600 ${
                    currentPage === item.id ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden mt-4 px-4 pb-4 border-t border-gray-200">
            <SearchBar onProductSelect={(product) => {
              onViewProduct(product);
              setShowMobileSearch(false);
            }} />
          </div>
        )}
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSuccess={handleSignupSuccess}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
      <AdminDashboard
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
      />
    </header>
  );
}