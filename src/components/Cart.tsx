import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartProps {
  onCheckout: () => void;
}

export default function Cart({ onCheckout }: CartProps) {
  const { state, removeFromCart, updateQuantity, closeCart, getTotalPrice } = useCart();
  const { user } = useAuth();

  if (!state.isOpen) return null;

  const [popupMessage, setPopupMessage] = React.useState('');
  const handleCheckout = () => {
    if (user) {
      closeCart();
      onCheckout();
    } else {
      setPopupMessage('Please sign in to add items to cart');
      setTimeout(() => setPopupMessage(''), 3000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {popupMessage && (
        <div className="fixed top-20 right-4 z-[100]">
          <span className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">{popupMessage}</span>
        </div>
      )}
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeCart} />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some delicious ghee to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm">{item.product.size}</p>
                      <p className="text-yellow-600 font-semibold">₹{item.product.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-yellow-600">₹{getTotalPrice()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 ${
                  user 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                disabled={!user}
              >
                {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}