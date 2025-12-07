
import logo from "../assets/logo.png";
import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-6">
      <motion.img
        src={logo}
        alt="Logo"
        className="w-40 h-32"
        animate={{
          y: [0, -20, 0], // bounce up, then back down
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default Spinner;
