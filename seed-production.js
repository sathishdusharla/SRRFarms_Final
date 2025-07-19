const mongoose = require('mongoose');
const Product = require('./server/models/Product');
require('dotenv').config();

// Use your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://dusharlasathish:EiTIDwE7eQtwa4Tk@clustersrr.xxo8sse.mongodb.net/?retryWrites=true&w=majority&appName=Clustersrr';

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
    },
    isActive: true,
    inStock: true
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
    },
    isActive: true,
    inStock: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Clearing existing products...');
    await Product.deleteMany({});

    console.log('🌱 Seeding products...');
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log(`📦 Added ${products.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
