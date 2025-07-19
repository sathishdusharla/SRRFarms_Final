const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Premium SRR Cow Ghee',
    description: 'Pure A2 cow ghee made using traditional Bilona method. Rich in vitamins A, D, E, and K.',
    size: '250ml',
    price: 500,
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'ghee',
    stock: 50,
    rating: 5,
    reviews: 127,
    badge: 'Bestseller',
    benefits: [
      '100% Pure A2 Cow Milk',
      'Traditional Bilona Method',
      'No Chemicals or Preservatives',
      'Rich in Essential Vitamins',
      'Boosts Immunity'
    ],
    nutritionalInfo: {
      calories: 900,
      fat: 100,
      protein: 0,
      carbs: 0,
      vitamins: ['A', 'D', 'E', 'K']
    }
  },
  {
    name: 'Premium SRR Cow Ghee',
    description: 'Perfect family size pack of our premium A2 cow ghee. Made with love and traditional methods.',
    size: '500ml',
    price: 1000,
    originalPrice: 1100,
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'ghee',
    stock: 30,
    rating: 4.5,
    reviews: 98,
    badge: 'Value Pack',
    benefits: [
      'Family Size Pack',
      'Better Value for Money',
      'Traditional Bilona Method',
      'Grass-Fed Cows',
      'Heart Healthy'
    ],
    nutritionalInfo: {
      calories: 900,
      fat: 100,
      protein: 0,
      carbs: 0,
      vitamins: ['A', 'D', 'E', 'K']
    }
  },
  {
    name: 'Premium SRR Cow Ghee',
    description: 'Large family pack perfect for regular cooking. Premium quality A2 cow ghee at the best value.',
    size: '1000ml',
    price: 1500,
    originalPrice: 1700,
    image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'ghee',
    stock: 20,
    rating: 5,
    reviews: 56,
    badge: 'Family Pack',
    benefits: [
      'Large Family Pack',
      'Best Value for Money',
      'Premium Quality',
      'Long Shelf Life',
      'Authentic Taste'
    ],
    nutritionalInfo: {
      calories: 900,
      fat: 100,
      protein: 0,
      carbs: 0,
      vitamins: ['A', 'D', 'E', 'K']
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/srrfarms');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    await Product.insertMany(products);
    
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();