import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function HomePage() {
  // මේවා උදාහරණ දත්ත පමණි (Sample Data)
  const featuredProducts = [
    { id: 1, name: 'Fresh Organic Carrots', price: 'LKR 4.99', image: '/vegetable.jpg' },
    { id: 2, name: 'Sweet Strawberries', price: 'LKR 6.50', image: '/fruits.jpg' },
    { id: 3, name: 'Chocolate Truffle Cake', price: 'LKR 24.00', image: '/cakes.jpg' },
    { id: 4, name: 'Vanilla Ice Cream', price: 'LKR 5.50', image: '/Icecreams.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-0 -mt-[72px]">
      {/* --- Hero Section --- */}
      <div className="relative bg-gray-900 h-[500px] flex items-center justify-center text-white">
        <img 
          src="/background.jpg" 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
          alt="Hero background"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Elevate Your <span className="text-blue-500">Style</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the latest trends in fashion and technology. Premium quality products delivered right to your doorstep.
          </p>
          <Link 
            to="/products" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition duration-300 shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* --- Featured Categories --- */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Top Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { name: 'Vegetables', img: '/vegetable.jpg' },
            { name: 'Fruits', img: '/fruits.jpg' },
            { name: 'Cakes', img: '/cakes.jpg' },
            { name: 'Biscuits', img: '/Biscuits.jpg' },
            { name: 'Icecreams', img: '/Icecreams.jpg' },
            { name: 'Cheese', img: '/Cheese.jpg' },
            { name: 'Chocolate', img: '/Chocolate.jpg' },
            { name :'Yogurt', img: '/yogurt.jpg' }
          ].map((cat) => (
            <div key={cat.name} className="group relative h-64 overflow-hidden rounded-2xl shadow-md cursor-pointer">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300 z-10"></div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-white text-2xl font-bold uppercase tracking-widest">{cat.name}</h3>
              </div>
              <img 
                src={cat.img} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                alt={cat.name} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- Featured Products Section --- */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-500 mt-2">Handpicked items just for you</p>
            </div>
            <Link to="/products" className="text-blue-600 font-medium hover:underline">View All &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition duration-300 shadow-md">
                    Add to Cart
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-blue-600 font-bold mt-1">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Promotion Banner --- */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Summer Sale 50% Off!</h2>
            <p className="text-blue-100 text-lg mb-8">Grab your favorites before they are gone.</p>
            <Link to="/products" className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition duration-300">
              Get Discount
            </Link>
          </div>
          <div className="mt-10 md:mt-0 relative z-10">
            <span className="text-9xl font-extrabold text-white/20">SALE</span>
          </div>
        </div>
      </div>

      
    </div>
  );
}