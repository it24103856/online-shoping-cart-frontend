import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // You'll need to implement this endpoint in your backend
      // await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/forgot-password', { email });
      toast.success('Check your email for password reset instructions!');
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3962287/pexels-photo-3962287.jpeg?auto=compress&cs=tinysrgb&w=2000"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>

      {/* Overlay tint */}
      <div className="absolute inset-0 z-[1] bg-black/40"></div>

      {/* Bottom fade */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,174,239,0.15)] p-10">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-[#00AEEF] rounded-full flex items-center justify-center font-black text-white text-lg shadow-lg">B</div>
            <span className="text-gray-800 font-black uppercase tracking-[0.3em] text-sm">Better Bar</span>
          </div>

          <div className="mb-8 text-center">
            <p className="uppercase text-[10px] tracking-[0.3em] font-semibold text-[#00AEEF] mb-2">Reset Password</p>
            <h2
              className="text-3xl font-black text-[#1A1A1A] italic tracking-tighter mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Recover Access
            </h2>
            <div className="h-1 w-12 bg-[#00AEEF] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm">
              {submitted
                ? 'Check your email for a link to reset your password.'
                : 'Enter your email address and we will send you a link to reset your password.'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-[#00AEEF]/20 focus:border-[#00AEEF] focus:bg-white focus:outline-none transition-all duration-300 text-gray-800"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00AEEF] hover:bg-[#0096CE] text-white font-bold py-3 rounded-full transition-all duration-500 shadow-lg shadow-[#00AEEF]/20 uppercase text-xs tracking-widest disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-700 mb-6">A reset link has been sent to your email.</p>
              <Link
                to="/login"
                className="inline-block bg-[#00AEEF] hover:bg-[#0096CE] text-white px-8 py-3 rounded-full font-bold transition-all duration-500 shadow-lg shadow-[#00AEEF]/20 uppercase text-xs tracking-widest"
              >
                Back to Login
              </Link>
            </div>
          )}

          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-[#00AEEF] font-black hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
