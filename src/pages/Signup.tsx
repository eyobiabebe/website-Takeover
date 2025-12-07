import type React from "react"

import { Mail, Eye, EyeOff, User, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import google from "../assets/google.jpg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion"
import axios from "axios";


const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5 },
  }),
}

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', name: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    setErrors({ confirmPassword: "Passwords do not match." });
    return;
  }

  setIsLoading(true);
  setErrors({});
  setMessage("");

  try {
    console.log("hi signup");
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    console.log("response from backend:", res.data);

    // Display success message
    setMessage(res.data.message);

    // Redirect to login after a short delay
    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err: any) {
    console.log("error occurred:", err);

    // Check if backend returned a message
    if (err.response && err.response.data) {
      setMessage(err.response.data.message || "Registration failed");
    } else {
      setMessage("Registration failed. Please try again later.");
    }
  } finally {
    setIsLoading(false);
  }

  console.log("Signup data:", formData);
};


  const handleGoogleSignUp = async () => {
    try {
      console.log("Google sign-up initiated");
    } catch (error) {
      console.error("Google sign-up error:", error);
    }
  };

  return (
    <div className="bg-[url('./assets/white-bg3.jpg')] bg-cover bg-center min-h-screen text-white">
      <div className="pt-12 text-black">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="px-6 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)] text-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 border-gray-700 shadow-2xl p-4 rounded-lg"
            >

              <motion.div
                custom={0}
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                className="text-center pb-8"
              >
                <h2 className="text-3xl text-gray-500 font-bold">Join Takeover</h2>
                <p className="text-gray-400">Create your account to get started</p>
              </motion.div>

              {/* Email Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.general}
                  </motion.div>
                )}

                {/* Name Field */}
                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <div className="relative items-center">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      required
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 w-full py-2 rounded-lg bg-gray-300 border-gray-600 focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="relative items-center">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      required
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 w-full py-2 rounded-lg bg-gray-300 border-gray-600 focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-1 ">{errors.email}</p>}
                </motion.div>

                <motion.div custom={0.2} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      required
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pr-10 w-full py-2 rounded-lg pl-3 bg-gray-300 border-gray-600 focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm mt-1 ">{errors.password}</p>}
                  {formData.password && formData.password.length >= 6 && (
                    <p className="text-green-400 text-sm mt-1 flex items-center ">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Password strength: Good
                    </p>
                  )}
                </motion.div>

                <motion.div custom={0.2} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      required
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={` w-full py-2 rounded-lg pl-3 bg-gray-300 border-gray-600 focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1 ">{errors.confirmPassword}</p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-green-400 text-sm mt-1 flex items-center ">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Passwords match
                    </p>
                  )}
                </motion.div>

                <div className="flex items-start space-x-2  -5 pl-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-700 mt-1 focus:ring-yellow-400"
                    required
                  />
                  <span className="text-sm text-gray-500">
                    I agree to the{" "}
                    <Link to="/terms" className="text-yellow-500 hover:text-yellow-300 transition-colors">
                      Terms of Service and Privacy Policy
                    </Link>
                  </span>
                </div>

                <motion.button
                  custom={0.4}
                  variants={fadeVariant}
                  initial="hidden"
                  animate="visible"
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-[#7f5fba] hover:bg-[#b99deb] text-gray-900  hover:scale-105 font-semibold py-3 transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin mr-4" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
                <p className="text-red-400 text-sm mt-1 flex items-center ">
                      {message}
                </p>
              </form>

              {/* Divider */}
              <motion.div custom={0.5} variants={fadeVariant} initial="hidden" animate="visible" className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 text-gray-400">Or continue with Social logins</span>
                </div>
              </motion.div>

              {/* Social Buttons */}
              <motion.div custom={0.6} variants={fadeVariant} initial="hidden" animate="visible" className="flex gap-4 mt-4">
                <button
                  onClick={handleGoogleSignUp}
                  className="w-full rounded-lg bg-white border border-green-500 text-gray-900 hover:scale-105 flex items-center justify-center gap-3 py-1 font-medium"
                >
                  <img src={google} alt="Google Logo" className="w-7 h-7 bg-white" />
                  Google
                </button>

                {/* <button className="w-full rounded-lg bg-blue-500 text-white hover:scale-105 flex items-center justify-center gap-3 py-2 font-medium">
                  <FaFacebook size={20} />
                  Facebook
                </button> */}
              </motion.div>

              <motion.div custom={0.7} variants={fadeVariant} initial="hidden" animate="visible" className="text-center text-sm text-gray-400 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-yellow-600 hover:text-yellow-300 font-medium">
                  Sign in
                </Link>
              </motion.div>

            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}

export default Signup;
