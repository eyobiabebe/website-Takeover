import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://website-takeover.onrender.com/success",
      },
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("Payment processing...");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Complete Your Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stripe Payment Element */}
          <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
            <PaymentElement />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading || !stripe}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
              loading || !stripe
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        {/* Message Section */}
        {message && (
          <div
            className={`mt-4 text-center text-sm font-medium ${
              message.includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Footer Info */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secure payment powered by <span className="font-semibold text-indigo-600">Stripe</span>.
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;
