import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const CancelPage = () => {
  const navigate = useNavigate();
  const { title } = useParams<{ title: string }>();
  const userId = useSelector((state: any) => state.auth.user?.id);

  // useEffect(() => {
  //   const handleContinue = async () => {
  //     try {
  //       const res = await axios.post("/api/takeover/proceed", { leaseId, userId });

  //       if (res.status === 200) {

  //         const timer = setTimeout(() => {
  //           navigate("/dashboard");
  //         }, 3000); // 3000ms = 3 seconds

  //         // Cleanup timer when component unmounts
  //         return () => clearTimeout(timer);
  //       }
  //     } catch (error) {
  //       console.error("Failed to navigate:", error);
  //     }
  //   };

  //   handleContinue();

  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 4000); // 3000ms = 3 seconds

    // Cleanup timer when component unmounts
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-red-500 w-20 h-20 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-red-700 mb-3">
          {title} Payment Cancelled!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Your transaction has been cancelled. please try again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-md"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Redirecting...
          </button> */}
          <p className="text-gray-600 mt-2">
            Redirecting to your dashboard in a few seconds...
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-500">
        Secure payment processed by{" "}
        <span className="font-semibold text-emerald-600">Stripe</span>.
      </p>
    </div>
  );
};

export default CancelPage;
