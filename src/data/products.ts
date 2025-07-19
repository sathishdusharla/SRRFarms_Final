import { Product } from '../types';

export const products: Product[] = [
  // Ghee Products
  {
    id: '1',
    name: 'Premium SRR Cow Ghee',
    size: '250ml',
    price: 500,
    category: 'ghee',
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    reviews: 127,
    badge: 'Bestseller',
    description: 'Pure A2 cow ghee made using traditional Bilona method. Rich in vitamins A, D, E, and K.',
    benefits: [
      '100% Pure A2 Cow Milk',
      'Traditional Bilona Method',
      'No Chemicals or Preservatives',
      'Rich in Essential Vitamins',
      'Boosts Immunity'
    ],
    inStock: true
  },
  {
    id: '2',
    name: 'Premium SRR Cow Ghee',
    size: '500ml',
    price: 1000,
    originalPrice: 1100,
    category: 'ghee',
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 98,
    badge: 'Best Value',
    description: 'Perfect family size pack of our premium A2 cow ghee. Made with love and traditional methods.',
    benefits: [
      'Family Size Pack',
      'Better Value for Money',
      'Traditional Bilona Method',
      'Grass-Fed Cows',
      'Heart Healthy'
    ],
    inStock: true
  },
  {
    id: '3',
    name: 'Premium SRR Cow Ghee',
    size: '1000ml',
    price: 1500,
    originalPrice: 1700,
    category: 'ghee',
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    reviews: 56,
    badge: 'Most Popular',
    description: 'Large family pack perfect for regular cooking. Premium quality A2 cow ghee at the best value.',
    benefits: [
      'Large Family Pack',
      'Best Value for Money',
      'Premium Quality',
      'Long Shelf Life',
      'Authentic Taste'
    ],
    inStock: true
  },
  // Milk Products
  {
    id: '4',
    name: 'Fresh A2 Cow Milk',
    size: '500ml',
    price: 40,
    category: 'milk',
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 234,
    badge: 'Fresh Daily',
    description: 'Fresh A2 cow milk delivered daily from our farm. Rich in protein, calcium, and natural goodness.',
    benefits: [
      'Fresh Daily Delivery',
      'A2 Protein Rich',
      'No Preservatives',
      'High Calcium Content',
      'Natural & Pure'
    ],
    inStock: true
  },
  {
    id: '5',
    name: 'Fresh A2 Cow Milk',
    size: '1 Liter',
    price: 75,
    originalPrice: 80,
    category: 'milk',
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 189,
    badge: 'Family Pack',
    description: 'One liter pack of fresh A2 cow milk, perfect for families. Delivered fresh every morning.',
    benefits: [
      'Family Size Pack',
      'Morning Fresh Delivery',
      'A2 Beta Casein',
      'Easy to Digest',
      'Farm to Table'
    ],
    inStock: true
  },
  {
    id: '6',
    name: 'Organic Buffalo Milk',
    size: '500ml',
    price: 50,
    category: 'milk',
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviews: 156,
    badge: 'High Fat',
    description: 'Rich and creamy buffalo milk with high fat content. Perfect for making sweets and desserts.',
    benefits: [
      'High Fat Content',
      'Rich & Creamy',
      'Perfect for Sweets',
      'Natural Taste',
      'Organic Farming'
    ],
    inStock: true
  },
  {
    id: '7',
    name: 'Organic Buffalo Milk',
    size: '1 Liter',
    price: 95,
    originalPrice: 100,
    category: 'milk',
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviews: 123,
    badge: 'Premium',
    description: 'Premium buffalo milk in family size. Rich in protein and perfect for traditional recipes.',
    benefits: [
      'Premium Quality',
      'High Protein',
      'Traditional Taste',
      'Family Size',
      'Fresh Daily'
    ],
    inStock: true
  },
  {
    id: '8',
    name: 'Flavored Milk - Chocolate',
    size: '200ml',
    price: 25,
    category: 'milk',
    image: 'https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviews: 89,
    badge: 'Kids Favorite',
    description: 'Delicious chocolate flavored milk made with fresh A2 cow milk. Perfect for kids and adults.',
    benefits: [
      'Natural Chocolate Flavor',
      'Kids Favorite',
      'A2 Milk Base',
      'No Artificial Colors',
      'Ready to Drink'
    ],
    inStock: true
  },
  {
    id: '9',
    name: 'Flavored Milk - Strawberry',
    size: '200ml',
    price: 25,
    category: 'milk',
    image: 'https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviews: 67,
    badge: 'Natural',
    description: 'Fresh strawberry flavored milk with natural fruit extracts. Healthy and delicious treat.',
    benefits: [
      'Natural Strawberry Flavor',
      'Fruit Extracts',
      'Healthy Treat',
      'No Preservatives',
      'Fresh Ingredients'
    ],
    inStock: true
  }
];

export const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'ghee', name: 'Ghee Products', count: products.filter(p => p.category === 'ghee').length },
  { id: 'milk', name: 'Milk Products', count: products.filter(p => p.category === 'milk').length }
];