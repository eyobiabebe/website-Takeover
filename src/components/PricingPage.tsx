import React, { type ReactElement } from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Rocket, Check } from "lucide-react";

type Plan = {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
  icon: ReactElement;
};

const plans: Plan[] = [
  {
    title: "Bronze",
    price: "$30/year or $2.50/month",
    features: [
      "2 free listing boosts/year",
      "Bronze badge on profile",
      "Basic analytics (views, clicks, saves)",
      "Save unlimited listings"
    ],
    icon: <Flame className="text-orange-500" />
  },
  {
    title: "Silver",
    price: "$60/year or $5/month",
    features: [
      "*Includes everything in Bronze",
      "6 free boosts/year",
      "Auto share to Facebook & Reddit",
      "Weekly hot listing notifications",
      "Full analytics + performance comparison",
      "Best day/time insights"
    ],
    icon: <Zap className="text-sky-500" />,
    highlight: true
  },
  {
    title: "Gold",
    price: "$120/year or $10/month",
    features: [
      "*Includes everything in Silver",
      "1 free urgent boost (48h top listing)",
      "Unlimited boosts",
      "Auto reboost after 15 days",
      "Gold badge on profile",
      "Upload video tours",
      `"Roommate-eligible" listing option`
    ],
    icon: <Rocket className="text-yellow-500" />
  }
];

const addOns = [
  {
    title: "Single Time Boost",
    price: "$7/boost",
    description: "Prioritize your listing for 5 days"
  },
  {
    title: "Urgent Boost",
    price: "$25/boost",
    description: "#1 listing in your area for 48 hours"
  }
];

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-10"
      >
        Membership Plans
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`p-6 border rounded-2xl shadow-lg transition-all duration-300 ${
              plan.highlight
                ? "bg-yellow-50 border-yellow-400 scale-105"
                : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2 text-xl font-semibold mb-4">
              {plan.icon}
              {plan.title}
            </div>
            <div className="text-3xl font-bold mb-4">{plan.price}</div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="text-green-600 mt-1" size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 px-4 rounded-xl bg-black text-white hover:bg-gray-800 transition">
              Choose {plan.title}
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-20 max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">One-Time Add-Ons</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {addOns.map((addOn, i) => (
            <div
              key={i}
              className="bg-white border p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{addOn.title}</h3>
              <p className="text-sm text-gray-600">{addOn.description}</p>
              <p className="text-md font-bold mt-2">{addOn.price}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
