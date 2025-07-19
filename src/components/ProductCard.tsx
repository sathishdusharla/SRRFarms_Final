import React from 'react';
import { Star, ShoppingCart, Eye, Droplets, Milk } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, onViewDetails, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      addToCart(product);
    } else {
      alert('Please sign in to add items to cart');
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(product);
  };

  const CategoryIcon = product.category === 'ghee' ? Droplets : Milk;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl group">
        <div className="flex">
          {/* Product Image */}
          <div className="relative w-48 h-48 flex-shrink-0">
            {product.badge && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                {product.badge}
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-gray-600 mb-3">{product.size}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : i < product.rating
                          ? 'text-yellow-400 fill-current opacity-50'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm ml-2">({product.reviews})</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-yellow-600">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleViewDetails}
                  className="px-4 py-2 border-2 border-yellow-600 text-yellow-600 rounded-lg font-semibold hover:bg-yellow-600 hover:text-white transition-all duration-300"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    product.inStock && user
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!product.inStock ? 'Out of Stock' : !user ? 'Sign In to Buy' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
          {product.badge}
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handleViewDetails}
            className="bg-white text-gray-800 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center space-x-2 hover:bg-yellow-600 hover:text-white"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <CategoryIcon className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.size}</p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : i < product.rating
                    ? 'text-yellow-400 fill-current opacity-50'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-yellow-600">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
            )}
          </div>
          {product.originalPrice && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
              Save ₹{product.originalPrice - product.price}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              product.inStock && user
                ? 'bg-yellow-600 text-white hover:bg-yellow-700 hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{!product.inStock ? 'Out of Stock' : !user ? 'Sign In to Buy' : 'Add to Cart'}</span>
          </button>
          <button
            onClick={handleViewDetails}
            className="px-4 py-3 border-2 border-yellow-600 text-yellow-600 rounded-lg font-semibold hover:bg-yellow-600 hover:text-white transition-all duration-300"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}