import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentPage: React.FC = () => {
  const { leaseId } = useParams<{ leaseId: string }>();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Call backend to create a Stripe checkout session
      const { data } = await axios.post("/api/payments/create-checkout-session", {
        leaseId,
        title: "Lease Takeover",
        price: 50, // Example system fee
      });

      // Redirect user to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          System Fee Payment
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          To continue with your lease takeover, a one-time <b>$5</b> system fee
          is required. Secure payments are processed via{" "}
          <span className="text-blue-600 font-semibold">Stripe</span>.
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Securely handled by <span className="font-semibold">Stripe</span>.
      </p>
    </div>
  );
};

export default PaymentPage;
