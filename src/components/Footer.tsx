import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-white text-2xl font-bold mb-4">Takeover</h2>
          <p className="text-sm leading-relaxed">
            Find and lease apartments or cars with ease. Your next takeover is just a click away.
          </p>
        </motion.div>

        {/* Explore Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/leaseLists" className="hover:text-white">Browse Leases</Link></li>
            <li><Link to="/addListing" className="hover:text-white">Add Lease</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
          </ul>
        </motion.div>

        {/* Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/terms" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <p className="text-sm">takeover@takeovermobile.com</p>
          <p className="text-sm mt-1">California, United States</p>
        </motion.div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Takeover. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
