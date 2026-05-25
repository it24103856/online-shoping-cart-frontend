import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleRedirect = (role) => {
  if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/");
  }
};

  const GoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: (response) => {
      setIsLoading(true);
      axios.post(import.meta.env.VITE_BACKEND_URL + "/users/google-login", {
        token: response.access_token,
      }).then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.role);
        handleRedirect(res.data.role);
        toast.success("Welcome to the Sweet Journey!");
      }).catch(() => {
        toast.error("Google Login Failed");
      }).finally(() => { setIsLoading(false); });
    },
    onError: () => { toast.error("Google Login Failed"); }
  });

  async function login(e) {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.role);
      handleRedirect(res.data.role);
      toast.success("Welcome to Better Bar!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center relative overflow-hidden px-6">

      {/* Background image — full opacity, clearly visible */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3962287/pexels-photo-3962287.jpeg?auto=compress&cs=tinysrgb&w=2000"
          className="w-full h-full object-cover"
          alt=""
        />
      </div>

      {/* Overlay tint */}
      <div className="absolute inset-0 z-[1] bg-black/40"></div>

      {/* Bottom fade for readability */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-16">

        {/* Left — Brand Identity */}
        <div className="text-center md:text-left max-w-[600px]">
          <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
            <div className="w-12 h-12 bg-[#00AEEF] rounded-full flex items-center justify-center font-black text-white italic text-xl shadow-lg">B</div>
            <span className="text-white font-black uppercase tracking-[0.4em] text-sm drop-shadow-md">Better Bar</span>
          </div>

          <h1
            className="font-black text-6xl md:text-8xl leading-[0.95] italic uppercase tracking-tighter drop-shadow-lg text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shop <br />
            <span className="text-[#00AEEF]">Premium.</span>
          </h1>

          <p className="mt-8 text-white/90 text-lg font-light tracking-[0.15em] uppercase italic max-w-md drop-shadow">
            "Quality products delivered to your door. Shop with confidence."
          </p>

          <div className="w-24 h-0.5 bg-white/60 mt-8 mx-auto md:mx-0"></div>
        </div>

        {/* Right — Frosted Glass Form Card */}
        <div className="w-full max-w-[440px]">
          <form
            onSubmit={login}
            className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_20px_60px_rgba(244,63,94,0.15)] p-10 flex flex-col"
          >
            <div className="mb-8">
             

              <h2
                className="text-3xl font-black text-[#1A1A1A] italic tracking-tighter"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Sign In
              </h2>
              <div className="h-1 w-12 bg-[#00AEEF] mt-2 rounded-full"></div>
            </div>

            <div className="w-full space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em] ml-1 mb-2 block font-semibold">
                  Email
                </label>
                <input
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full p-4 rounded-2xl bg-white/80 border border-[#00AEEF]/20 focus:border-[#00AEEF] focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] font-light tracking-wide text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em] ml-1 mb-2 block font-semibold">
                  Password
                </label>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 rounded-2xl bg-white/80 border border-[#00AEEF]/20 focus:border-[#00AEEF] focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] font-light tracking-wide text-sm"
                />
              </div>
            </div>

            <div className="w-full flex justify-end mt-3 mb-6">
              <Link
                to="/froget-password"
                className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-[#00AEEF] transition-all"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00AEEF] text-white font-bold py-4 rounded-full hover:bg-[#0096CE] active:scale-[0.97] transition-all duration-500 uppercase text-xs tracking-[0.2em] shadow-md"
            >
              {isLoading ? "Verifying..." : "Sign In"}
            </button>

            <div className="w-full flex items-center gap-4 my-6">
              <div className="h-[1px] bg-gray-200 flex-1"></div>
              <span className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">OR</span>
              <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>

            <button
              onClick={() => GoogleLogin()}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-transparent border border-rose-200 text-[#1A1A1A] py-4 rounded-full hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 font-semibold uppercase text-[10px] tracking-[0.2em]"
            >
              <GrGoogle className="text-rose-500" size={15} />
              Continue with Google
            </button>

            <p className="text-gray-500 mt-8 text-center text-[10px] uppercase tracking-[0.2em]">
              New here?{" "}
              <Link to="/register" className="text-rose-500 font-black hover:text-rose-700 underline underline-offset-4">
                Create Profile
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}