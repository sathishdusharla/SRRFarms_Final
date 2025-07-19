import React from 'react';
import { Shield, Award, Truck, Star, CheckCircle, Droplets, Leaf, Heart, Milk } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              About <span className="text-yellow-600">SRR Farms</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Preserving ancient traditions while delivering the purest A2 dairy products to your doorstep
            </p>
          </div>
        </div>
      </section>

      {/* SRR Farms About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="SRR Farm"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                The <span className="text-yellow-600">SRR Farms</span> Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded with a vision to bring pure, traditional A2 dairy products to modern households, SRR Farms represents a commitment to quality, authenticity, and health. Located in the heart of Shanigaram Village, Koheda Mandal, Karimnagar District, our farm is home to indigenous A2 cows and buffaloes that graze freely on lush green pastures.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that the best dairy products come from happy, healthy animals. Our indigenous breeds are raised with love and care, following ethical farming practices that have been passed down through generations. Every drop of our milk and ghee carries the essence of traditional Indian dairy farming.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-yellow-600" />
                  <span className="text-gray-700">100% Pure & Natural</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <span className="text-gray-700">Traditional Methods</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-yellow-600" />
                  <span className="text-gray-700">Farm to Table</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-600" />
                  <span className="text-gray-700">Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-yellow-600">Product Range</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From traditional ghee to fresh milk - discover what makes our dairy products special
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Ghee Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Premium Ghee</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Our ghee is made using the traditional Bilona method from pure A2 cow milk. This ancient process preserves all the natural nutrients and gives our ghee its distinctive taste and aroma.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Traditional Bilona Method</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">100% A2 Cow Milk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Rich in Vitamins A, D, E, K</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">No Preservatives or Chemicals</span>
                </div>
              </div>
            </div>

            {/* Milk Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Milk className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Fresh Milk</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Our fresh milk is delivered daily from our farm. We offer both A2 cow milk and buffalo milk, each with its unique nutritional benefits and taste profile.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Daily Fresh Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">A2 Cow & Buffalo Milk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">High Protein & Calcium</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Grass-Fed Animals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Health <span className="text-yellow-600">Benefits</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the amazing health benefits of our pure A2 dairy products
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Heart Healthy</h3>
              <p className="text-gray-600">Rich in omega-3 fatty acids that support cardiovascular health and reduce inflammation naturally.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🧠</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Brain Function</h3>
              <p className="text-gray-600">Contains essential fatty acids that nourish brain cells and improve cognitive function.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl">🔥</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Boosts Metabolism</h3>
              <p className="text-gray-600">Medium-chain fatty acids help in burning fat and increasing energy levels naturally.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Immune Support</h3>
              <p className="text-gray-600">Contains antioxidants and vitamins that strengthen the immune system and promote overall wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Bilona Method Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              The <span className="text-yellow-600">Bilona Method</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our traditional ghee-making process preserves all nutritional benefits and authentic taste
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {[
              { 
                step: 1, 
                title: 'Fresh Milk Collection', 
                desc: 'We collect fresh milk daily from our own indigenous A2 cows that graze freely on natural pastures. The milk is collected during optimal hours to ensure maximum nutritional content.',
                icon: <Droplets className="w-8 h-8 text-white" />
              },
              { 
                step: 2, 
                title: 'Natural Curd Formation', 
                desc: 'The fresh milk is allowed to set naturally into yogurt without any artificial starters or chemicals. This process takes 8-12 hours and preserves all natural probiotics.',
                icon: <div className="text-2xl text-white">🥛</div>
              },
              { 
                step: 3, 
                title: 'Traditional Hand Churning', 
                desc: 'We hand-churn the yogurt using traditional wooden churners (bilona) in a clockwise and anti-clockwise motion to extract pure white butter. This ancient method preserves the molecular structure.',
                icon: <div className="text-2xl text-white">🔄</div>
              },
              { 
                step: 4, 
                title: 'Slow Copper Vessel Cooking', 
                desc: 'The butter is slowly simmered in traditional copper vessels over a controlled flame until it transforms into golden ghee. This process can take 2-3 hours for perfect consistency.',
                icon: <div className="text-2xl text-white">🔥</div>
              },
              { 
                step: 5, 
                title: 'Careful Filtering & Storage', 
                desc: 'The ghee is carefully filtered through fine cloth to remove milk solids, resulting in pure, clear ghee. It\'s then stored in glass containers to maintain purity and freshness.',
                icon: <Leaf className="w-8 h-8 text-white" />
              }
            ].map((process, index) => (
              <div key={index} className="flex items-start space-x-6 mb-8">
                <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {process.icon}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg flex-1 border-l-4 border-yellow-600">
                  <div className="flex items-center mb-3">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                      Step {process.step}
                    </span>
                    <h3 className="text-xl font-semibold">{process.title}</h3>
                  </div>
                  <p className="text-gray-600">{process.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience the SRR Farms Difference
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to pure, traditional A2 dairy products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919490507045"
              className="bg-white text-yellow-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Order Now on WhatsApp
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-yellow-600 transition-all duration-300">
              Call +91 9490507045
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}