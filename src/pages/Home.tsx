import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Star, ArrowRight, Shield, Clock, DollarSign, Headphones,
   ChevronDown, ChevronUp,
  Sparkles,
  ShieldCheck,
 
  MessageSquare,
  Key
} from "lucide-react"
import { useEffect, useState } from "react";
import hero from "../assets/hero.png";

import { useSelector } from "react-redux";

// const session = authClient.useSession();
// const isAuthenticated = !!session.data?.user;

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 5,
    quote:
      "TakeOver made my lease transfer so easy! I found someone to take over my apartment in just 3 days. The background check process gave me peace of mind.",
    avatar: "SJ",
  },
  {
    name: "Mike Chen",
    location: "San Francisco, CA",
    rating: 5,
    quote:
      "I saved over $3,000 in broker fees using TakeOver. The platform is intuitive and the verification process is thorough. Highly recommend!",
    avatar: "MC",
  },
  {
    name: "Emma Rodriguez",
    location: "Chicago, IL",
    rating: 5,
    quote:
      "Found my dream apartment through TakeOver when someone needed to transfer their lease. The messaging system made communication seamless.",
    avatar: "ER",
  },
]

const faqs = [
  {
    question: "How does TakeOver work?",
    answer:
      "TakeOver connects people who need to exit their lease with those looking for apartments and cars. Simply create an account, post your listing or browse available transfers, and connect with verified users.",
  },
  {
    question: "What fees does TakeOver charge?",
    answer:
      "TakeOver charges a small service fee only upon successful lease transfer. There are no upfront costs or hidden fees. You save thousands compared to traditional broker fees.",
  },
  {
    question: "How long does a typical lease transfer take?",
    answer:
      "Most successful transfers happen within 1-2 weeks. Our smart matching algorithm helps connect compatible renters quickly.",
  },
  {
    question: "Can I share my listing on other platforms?",
    answer:
      "TakeOver integrates with Facebook Marketplace, Reddit, and other platforms to maximize your listing's visibility.",
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Welcome = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000); // 6 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center ">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {/* Hero Section */}
          <section className="relative bg-white overflow-hidden min-h-screen ">
            <div className="absolute inset-0 bg-[url('./assets/white-bg3.jpg')] bg-cover bg-center opacity-50" />
            <div className="relative max-w- mx-auto px-4 sm:px-6 lg:px-8 pt-28 my-">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className=""
                >
                  <h1 className="text-5xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6 text-left">
                    The Smarter Way to Transfer Your Lease
                  </h1>
                  <p className=" text-gray-600 mb-8 text-left">
                    Join thousands who've found their perfect lease match. Save money, save time, and connect with
                    verified renters in your area.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-12 text-sm font-semibold">
                    {!isAuthenticated ? (
                      <>
                        <Link
                          to="/signup"
                          className="border-2 border-blue-600 text-blue-600 px-2 py-1 hover:scale-105 font-semibold hover:bg-blue-50 bg-transparent rounded-md"
                        >
                          Sign Up Free
                        </Link>
                        <Link
                          to="/how-it-works"
                          className="border-2 border-blue-600 text-blue-600 px-2 py-1 hover:scale-105 font-semibold hover:bg-blue-50 bg-transparent rounded-md"
                        >
                          How It Works
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/dashboard" className="border-2 border-blue-600 text-blue-600 px-3 py-1 hover:scale-105 font-semibold hover:bg-blue-50 bg-transparent rounded-md">
                          Go to Dashboard
                        </Link>
                        <Link to="/browse" className="border-2 border-blue-600 text-blue-600 px-3 py-1 hover:scale-105 font-semibold hover:bg-blue-50 bg-transparent rounded-md">
                          Browse Listings
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">10k+</div>
                      <div className="text-gray-600">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">5k+</div>
                      <div className="text-gray-600">Successful Transfers</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img
                    src={hero}
                    alt="Successful lease transfer - modern apartment building with happy people"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          {/* <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Steps to Success</h2>
                <p className="text-xl text-gray-600">Get started with TakeOver in just three easy steps</p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create Account</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sign up for free and complete your profile with verified information. Our secure process ensures trust
                    from day one.
                  </p>
                </motion.div>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Post or Browse</h3>
                  <p className="text-gray-600 leading-relaxed">
                    List your lease for transfer or browse available apartments. Our smart algorithm matches you with
                    compatible options.
                  </p>
                </motion.div>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserCheck className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect & Transfer</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Message verified users, complete background checks, and finalize your lease transfer with confidence.
                  </p>
                </motion.div> */}
          {/* </div> */}
          {/* <div className="text-center mt-12">
                {!user ? (
                  <Link to="/signup">
                    Get Started
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </section> */}

          {/* Benefits Grid */}
          {/* <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Money</h3>
                  <p className="text-gray-600">No broker fees or hidden costs. Save thousands on your lease transfer.</p>
                </motion.div>
                <motion.div
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Time</h3>
                  <p className="text-gray-600">Quick matching algorithm connects you with the right people faster.</p>
                </motion.div>
                <motion.div
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Users</h3>
                  <p className="text-gray-600">Secure background checks ensure safe and trustworthy connections.</p>
                </motion.div>
                <motion.div
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Headphones className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                  <p className="text-gray-600">Our dedicated support team is always available to help you succeed.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Showcase */}
          {/* <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Social Sharing Integration</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Maximize your listing's reach by sharing on Facebook Marketplace, Reddit, and other platforms. Our
                      integrated sharing tools help you find the perfect match faster.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        One-click sharing to multiple platforms
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        Optimized listing formats for each platform
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        Track engagement across all channels
                      </li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={social_sharing}
                      alt="Social sharing feature - smartphone showing social media integration"
                      className="w-76 h-80 object- rounded-xl shadow-lg "
                    />
                  </motion.div>
                </div>

                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    className="order-2 lg:order-1 relative"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={background_check}
                      alt="Background verification process with security badges"
                      className="w-full h-auto object-cover rounded-xl shadow-lg"
                    />
                  </motion.div>
                  <motion.div
                    className="order-1 lg:order-2"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Secure Background Verification</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Our comprehensive background check process ensures trust and transparency between all parties. Feel
                      confident in every connection you make.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        Credit and employment verification
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        Criminal background screening
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        Identity verification and references
                      </li>
                    </ul>
                  </motion.div>
                </div> 

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Smart Messaging System</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Communicate securely with potential matches through our built-in messaging platform. Keep all
                      conversations organized and accessible.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        End-to-end encrypted messaging
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        Photo and document sharing
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        Real-time notifications
                      </li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={messaging_system}
                      alt="Secure messaging system interface on mobile device"
                      className="w-full h-auto object-cover rounded-xl shadow-lg"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </section> */}
          {/* <PricingPage/> */}

          {/* ================== Benefits Grid ================== */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Money</h3>
                  <p className="text-gray-600">No broker fees or hidden costs. Save thousands on your lease transfer.</p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Time</h3>
                  <p className="text-gray-600">Quick matching algorithm connects you with the right people faster.</p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Users</h3>
                  <p className="text-gray-600">Secure email checks ensure safe.</p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Headphones className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                  <p className="text-gray-600">Our dedicated support team is always available to help you succeed.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ================== CATEGORIES ================== */}
          {/* <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-center mb-14">Browse by Category</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { title: "Car Leases", icon: CarFront, link: "/listings?type=car" },
                  { title: "Apartment Leases", icon: Building, link: "/listings?type=apartment" }
                ].map((cat, i) => (
                  <motion.a
                    key={i}
                    href={cat.link}
                    whileHover={{ scale: 1.02 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-5"
                  >
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <cat.icon size={30} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{cat.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Verified listings updated daily
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </section> */}

          {/* ================== HOW IT WORKS PREVIEW ================== */}
          <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeIn}
              className="max-w-6xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center mb-14">How It Works</h2>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Search,
                    title: "Find a Lease",
                    desc: "Browse cars or apartments that match your budget and move-in date."
                  },
                  {
                    icon: MessageSquare,
                    title: "Connect & Apply",
                    desc: "Chat with the tenant, exchange details, and apply safely through the platform."
                  },
                  {
                    icon: Key,
                    title: "Take Over",
                    desc: "Finish paperwork, receive confirmation and move in — hassle free."
                  }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    variants={fadeIn}
                    whileHover={{ scale: 1.03 }}
                    className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <div className="p-3 w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      <step.icon size={24} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-10">
                <a
                  href="/how-it-works"
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  View full process <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </section>


          {/* ================== FEATURED LISTINGS (STATIC MOCKUP) ================== */}
          {/* <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-14">Featured Listings</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
                  >
                    <div className="h-40 bg-slate-200 dark:bg-slate-700" />
                    <div className="p-4">
                      <h3 className="font-semibold">Sample Listing #{i}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        $1,250 / month • 8 months left
                      </p>
                      <a
                        href="/listing/example"
                        className="text-indigo-600 dark:text-indigo-400 text-sm mt-3 inline-block"
                      >
                        View details →
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section> */}

          {/* ================== WHY CHOOSE US ================== */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-14">Why Choose Our Platform?</h2>

              <div className="grid md:grid-cols-3 gap-10">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified & Secure",
                    desc: "Every user is identity-checked to maintain a safe community."
                  },
                  {
                    icon: Sparkles,
                    title: "Fast & Transparent",
                    desc: "Track applications, messages, and paperwork in one simple dashboard."
                  },
                  {
                    icon: Star,
                    title: "Trusted by Thousands",
                    desc: "Real reviews from real people successfully transferring leases."
                  }
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6"
                  >
                    <div className="p-4 inline-block rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      <feat.icon size={28} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{feat.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {feat.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ================== TESTIMONIALS ================== */}
          {/* <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-14">Testimonials</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  "Found a new tenant in just 3 days. The process was unbelievably smooth!",
                  "Took over a car lease and saved thousands. Highly recommended.",
                  "The built-in chat and paperwork checklist made everything simple."
                ].map((quote, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      “{quote}”
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section> */}

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                <p className="text-xl text-gray-600">Real stories from successful lease transfers</p>
              </motion.div>
              <div className="relative">
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{testimonials[activeTestimonial].avatar}</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-4">
                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                        "{testimonials[activeTestimonial].quote}"
                      </blockquote>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</div>
                        <div className="text-gray-600">{testimonials[activeTestimonial].location}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <div className="flex justify-center mt-8 space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${index === activeTestimonial ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">Everything you need to know about TakeOver</p>
              </motion.div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">Still have questions?</p>
                <Link to="/contact" className="inline-flex items-center text-blue-600 hover:underline">
                  Contact Support <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </section>

          {/* ================== CTA BANNER ================== */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Whether you're looking to get in or get out — we’ve got you covered.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link to="/leaseLists" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                  Start Browsing
                </Link>
                {/* <Link to="" className="px-6 py-3 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                  Post a Listing
                </Link> */}
                {!isAuthenticated ? (
                  <Link to="/signup" className="px-6 py-3 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    Sign Up Now
                  </Link>
                ) : (
                  <Link to="/dashboard" className="px-6 py-3 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          {/* <section className="py-20 bg-blue-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Lease Experience?</h2>
                <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                  Join thousands of successful users who've found their perfect lease match. Start your journey today with
                  no upfront costs.
                </p>
                {!isAuthenticated ? (
                  <Link to="/signup" className="px-4 py-2 hover:scale-105 bg-gradient-to-l from-[#3182ed] to-[#56d28e] text-white transition-colors duration-300 rounded">
                    Sign Up Now
                  </Link>
                ) : (
                  <Link to="/dashboard" className="px-4 py-2 hover:scale-105 bg-gradient-to-l from-[#3182ed] to-[#56d28e] text-white transition-colors duration-300 rounded">
                    Go to Dashboard
                  </Link>
                )}
              </motion.div>
            </div>
          </section> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
