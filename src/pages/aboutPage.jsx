import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, Users, Award, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Headers from '../components/Header';

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-[#FDFDFD]">
        <Headers />

      {/* 1. Hero Section with Background Image */}
      <section className="relative h-[60vh] flex items-center justify-center bg-fixed bg-center bg-cover"
               style={{ backgroundImage: "url('/about.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="uppercase text-[11px] tracking-[0.3em] font-semibold text-white/60 mb-4">Who We Are</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Better <span className="italic text-[#00AEEF]">Bar</span>
          </motion.h1>
          <p className="mt-4 text-lg md:text-xl font-light max-w-2xl mx-auto text-white/80">
            Premium online shopping for high-performance computers, components, and accessories.
          </p>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="uppercase text-[11px] tracking-[0.3em] font-semibold text-[#00AEEF]">About Us</p>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Performance & Quality <span className="italic text-[#00AEEF]">Guaranteed</span>
          </h2>
          <p className="text-gray-500 leading-relaxed text-lg">
            At Better Bar, we're passionate about helping you build, upgrade, and enjoy reliable computing setups. Every product in our catalog is selected for quality, durability, and real-world performance.
          </p>
          <p className="text-gray-500 leading-relaxed text-lg">
            From laptops and desktops to gaming peripherals and components, our mission is to deliver the right hardware at the right value with dependable service.
          </p>
          <div className="pt-4">
             <Link to="/contact" className="inline-block bg-[#00AEEF] hover:bg-[#0096CE] text-white px-10 py-4 rounded-full font-bold transition-all duration-500 shadow-lg shadow-[#00AEEF]/20 uppercase text-[11px] tracking-widest hover:scale-105">
               Get In Touch
             </Link>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src="/background.jpg"
            alt="Computer hardware products"
            className="rounded-[15rem] shadow-sm hover:shadow-2xl transition-all duration-500 z-10 relative"
          />
          <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-[#00AEEF]/10 rounded-full -z-0 opacity-70 blur-3xl"></div>
        </motion.div>
      </section>

      {/* 3. Why Choose Us (Icon Cards) */}
      <section className="bg-[#FAFAFA] py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="uppercase text-[11px] tracking-[0.3em] font-semibold text-[#00AEEF] mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            What Makes Us <span className="italic">Special</span>
          </h2>
          <div className="w-20 h-1 bg-[#00AEEF] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Heart size={28} />, title: "Curated Quality", desc: "Every product is selected for reliability and performance." },
            { icon: <Zap size={28} />, title: "Fast Delivery", desc: "Get your tech gear delivered quickly and securely." },
            { icon: <Award size={28} />, title: "Best Value", desc: "Competitive prices on trusted hardware brands." },
            { icon: <Shield size={28} />, title: "Warranty Support", desc: "Shop confidently with dependable after-sales support." },
            { icon: <Users size={28} />, title: "Trusted by Gamers", desc: "Preferred by students, professionals, and creators." },
            { icon: <Globe size={28} />, title: "Wide Selection", desc: "Explore laptops, desktops, accessories, and components." }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 text-center group cursor-pointer"
            >
              <div className="text-[#00AEEF] mb-5 flex justify-center group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { num: "500+", label: "Products" },
            { num: "10K+", label: "Happy Customers" },
            { num: "4.9/5", label: "Star Rating" },
            { num: "99%", label: "Satisfaction" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-5xl font-bold text-[#00AEEF]" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.num}</h4>
              <p className="text-gray-500 uppercase tracking-widest text-xs mt-2 font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="bg-gradient-to-r from-[#00AEEF]/10 to-[#00AEEF]/5 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Experience Premium Quality?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers building better setups with trusted hardware.
          </p>
          <Link to="/products" className="inline-block bg-[#00AEEF] hover:bg-[#0096CE] text-white px-12 py-4 rounded-full font-bold transition-all duration-500 shadow-lg shadow-[#00AEEF]/30 uppercase text-sm tracking-widest hover:scale-105 hover:shadow-xl">
            Start Shopping Now
          </Link>
        </div>
      </section>

    </main>
  );
}
