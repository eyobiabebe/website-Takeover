import type React from "react"
import { Mail, Eye, EyeOff, AlertCircle, Key } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import axios from "axios"
import { login } from "../lib/authSlice"
import { useDispatch } from "react-redux"
import { GoogleLogin } from "@react-oauth/google";

const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5 },
  }),
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useDispatch()

  // axios.defaults.withCredentials = true; // important for cookies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const res = await axios.post("/api/users/login", {
        email: formData.email,
        password: formData.password,
      },
        { withCredentials: true } // ✅ ensures cookie is saved
      );

      if (res.status === 200) {
        console.log("✅ Login successful:", res.data);
        toast.success("Login Successfull")
        dispatch(login(res.data))
        // Redirect to dashboard
        navigate("/profile");
      }

    } catch (err: any) {
    let message = "Login failed. Please try again.";

    if (err.response) {
      // Handle unverified email specifically
      if (err.response.status === 403 && err.response.data?.message) {
        message = "Go to your email and activate your account before logging in.";
      } else {
        message = err.response.data?.message || "Invalid credentials";
      }
    } else if (err.request) {
      message = "No response from server. Please check your connection.";
    } else {
      message = err.message;
    }

    setErrors({ general: message });
    toast.error(message);
  } finally {
      setLoading(false) // ✅ always stop loader
    }
  }

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await axios.post(
        `/api/users/google-mobile`,
        { token: credentialResponse.credential }, { withCredentials: true }
      );

      console.log("✅ Google login success:", res.data);
      // Store JWT and redirect
      // localStorage.setItem("token", res.data.token);
      // Dispatch user only
      console.log("Dispatching login with user data:", res.data);
      dispatch(login(res.data));

      // Redirect
      navigate("/profile");
      toast.success("Login Successful");

    } catch (err: any) {
      let message = "Google login failed";
      if (err.response) message = err.response.data?.message || message;
      setErrors({ general: message });
      toast.error(message);
      console.error("❌ Google login failed:", err);
    } finally {
      setLoading(false);
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
                <h2 className="text-3xl text-gray-500 font-bold">Welcome Back</h2>
                <p className="text-gray-400">Sign in to your Takeover account</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-red-900/10 border border-red-500 text-red-400 px-2 py-1 rounded-lg text-sm flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.general}
                  </motion.div>
                )}

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
                </motion.div>

                {/* Password Field */}
                <motion.div custom={0.2} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      required
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-gray-300 py-2 w-full pl-10 rounded-lg border-gray-600 focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div custom={0.3} variants={fadeVariant} initial="hidden" animate="visible" className="flex justify-between">
                  <label className="flex items-center space-x-2 text-sm text-gray-400">
                    <input type="checkbox" className="rounded border-gray-600 bg-gray-700 focus:ring-yellow-400" />
                    <span>Remember me</span>
                  </label>
                  <Link to={`/forgot-password?email=${formData.email}`} className="text-yellow-500 hover:text-yellow-300">
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  custom={0.4}
                  variants={fadeVariant}
                  initial="hidden"
                  animate="visible"
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#7f5fba] hover:bg-[#b99deb] text-gray-900  hover:scale-105 font-semibold py-3 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin mr-4" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
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
              <motion.div custom={0.6} variants={fadeVariant} initial="hidden" animate="visible" className="w-full mt-4 ">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    toast.error("Google login failed");
                    console.error("Google login failed");
                  }}
                  width="100%"
                  text="continue_with"
                  theme="outline"
                />

                {/* <button className="w-full rounded-lg bg-blue-500 text-white hover:scale-105 flex items-center justify-center gap-3 py-2 font-medium">
                  <FaFacebook size={20} />
                  Facebook
                </button> */}
              </motion.div>

              <motion.div custom={0.7} variants={fadeVariant} initial="hidden" animate="visible" className="text-center text-sm text-gray-400 mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="text-yellow-500 hover:text-yellow-300 font-medium">
                  Sign up
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}

export default Login
