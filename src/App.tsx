import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import AboutPage from './components/AboutPage';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import { Product } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedProduct(null);
    setOrderInfo(null);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    // Check if user is logged in before allowing checkout
    setCurrentPage('checkout');
  };

  const handleOrderComplete = (order: any) => {
    setOrderInfo(order);
    setCurrentPage('order-success');
  };

  const handleContinueShopping = () => {
    setCurrentPage('home');
    setOrderInfo(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
      case 'products':
        return <ProductsPage onViewProduct={handleViewProduct} />;
      case 'about':
        return <AboutPage />;
      case 'checkout':
        return <Checkout onBack={() => setCurrentPage('home')} onOrderComplete={handleOrderComplete} />;
      case 'order-success':
        return <OrderSuccess orderInfo={orderInfo} onContinueShopping={handleContinueShopping} />;
      case 'contact':
        return (
          <div className="pt-24 pb-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Contact <span className="text-yellow-600">Us</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Get in touch with us for orders or any questions
                </p>
              </div>
              <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Address</h3>
                      <p className="text-gray-600">Shanigaram Village, Koheda Mandal, Karimnagar District</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Phone</h3>
                      <p className="text-gray-600">+91 9490507045</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-gray-600">info@srrfarms.com</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Business Hours</h3>
                      <p className="text-gray-600">Sunday - Saturday: 9:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-8 rounded-xl">
                  <h2 className="text-2xl font-bold mb-6">Quick Order</h2>
                  <p className="text-gray-600 mb-6">
                    For quick orders and instant support, contact us directly on WhatsApp
                  </p>
                  <a
                    href="https://wa.me/919490507045"
                    className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 inline-block"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onNavigate={handleNavigate} 
            currentPage={currentPage} 
            onViewProduct={handleViewProduct}
          />
          {renderPage()}
          <Cart onCheckout={handleCheckout} />
          <ProductDetail product={selectedProduct} onClose={handleCloseProductDetail} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;