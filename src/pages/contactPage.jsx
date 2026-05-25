import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ContactPage() {
  const [adminDetails, setAdminDetails] = useState({
    phone: "0788 316 997",
    address: "40/A, Walasmulla, Monaragala",
    email: "info@betterbar.com"
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${backendUrl}/contact/get`);
        if (res.data?.data) {
          setAdminDetails(res.data.data);
        }
      } catch (err) { 
        console.error("Error fetching admin details:", err); 
      }
    };
    fetchAdmin();
  }, [backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${backendUrl}/contact/create`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.subject}\n\n${formData.message}`
      });
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#FDFDFD]">
        <Header />
      <Toaster position="top-right" />

      {/* 1. Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center bg-fixed bg-center bg-cover"
               style={{ backgroundImage: "url('/public/about.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="uppercase text-[11px] tracking-[0.3em] font-semibold text-white/60 mb-4">Get In Touch</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact <span className="italic">Us</span>
          </motion.h1>
          <p className="mt-4 text-lg md:text-xl font-light max-w-2xl mx-auto text-white/80">
            Have questions? We're here to help! Reach out to our friendly team anytime.
          </p>
        </div>
      </section>

      {/* 2. Main Content: Text & Contact Details */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="uppercase text-[11px] tracking-[0.3em] font-semibold text-[#00AEEF]">Reach Out</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Let's Start a <span className="italic text-[#00AEEF]">Conversation</span>
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg max-w-lg">
              Have a question about our products or need help with your order? Our customer service team is ready to assist you.
            </p>
          </div>

          {/* Detail Box */}
          <div className="bg-[#FAFAFA] p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 hover:shadow-lg transition-all duration-500">

            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-5 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-500">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Phone</p>
                <p className="text-gray-800 text-lg font-bold">{adminDetails.phone}</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-5 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-500">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Location</p>
                <p className="text-gray-800 text-lg font-medium leading-tight">
                  {adminDetails.address}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-5 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-500">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Email</p>
                <a href={`mailto:${adminDetails.email}`} className="text-[#00AEEF] text-lg font-bold hover:underline">
                  {adminDetails.email}
                </a>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-5 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-white transition-all duration-500">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Hours</p>
                <p className="text-gray-800 text-lg font-medium">Mon - Fri: 9 AM - 6 PM</p>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00AEEF] focus:bg-white focus:outline-none transition-all duration-300 text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00AEEF] focus:bg-white focus:outline-none transition-all duration-300 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 xxx xxx xxx"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00AEEF] focus:bg-white focus:outline-none transition-all duration-300 text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00AEEF] focus:bg-white focus:outline-none transition-all duration-300 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more..."
                rows="5"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#00AEEF] focus:bg-white focus:outline-none transition-all duration-300 text-gray-800 resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#00AEEF] hover:bg-[#0096CE] text-white font-bold py-4 rounded-full transition-all duration-500 shadow-lg shadow-[#00AEEF]/20 uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* 3. Info Boxes with Hover Animation */}
      <section className="bg-[#FAFAFA] py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Call Us Box */}
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm text-center group cursor-pointer transition-all duration-500 hover:shadow-2xl"
          >
            <div className="text-[#00AEEF] mb-4 flex justify-center text-4xl">
              <Phone size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Call Us</h3>
            <p className="text-gray-700 font-medium">{adminDetails.phone}</p>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">24/7 Support</p>
          </motion.div>

          {/* Location Box */}
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm text-center group cursor-pointer transition-all duration-500 hover:shadow-2xl"
          >
            <div className="text-[#00AEEF] mb-4 flex justify-center text-4xl">
              <MapPin size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Visit Us</h3>
            <p className="text-gray-700 font-medium leading-relaxed text-sm">
              {adminDetails.address}
            </p>
          </motion.div>

          {/* Email Box */}
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm text-center group cursor-pointer transition-all duration-500 hover:shadow-2xl"
          >
            <div className="text-[#00AEEF] mb-4 flex justify-center text-4xl">
              <Mail size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Email Us</h3>
            <a href={`mailto:${adminDetails.email}`} className="text-[#00AEEF] font-bold hover:underline text-sm">
              {adminDetails.email}
            </a>
          </motion.div>

        </div>
      </section>

    </main>
  );
}