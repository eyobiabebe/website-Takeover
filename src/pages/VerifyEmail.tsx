import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification token link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `https://backend-takeover-4.onrender.com/api/users/verify-email/${token.trim()}`
        );
        setMessage(res.data.message);
        setStatus("success");

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setStatus("error");
        if (axios.isAxiosError(error)) {
          setMessage(error.response?.data?.message || "Verification failed");
        } else if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("Verification failed");
        }
      }
    };

    verifyEmail();
  }, [token]);

  // Colors for different statuses
  const bgColor = status === "success" ? "bg-green-100" : status === "error" ? "bg-red-100" : "bg-yellow-100";
  const textColor = status === "success" ? "text-green-800" : status === "error" ? "text-red-800" : "text-yellow-800";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className={`w-full max-w-md p-8 rounded-xl border ${bgColor} shadow-md text-center`}>
        <h1 className={`text-xl font-semibold ${textColor}`}>{message}</h1>
        {status === "error" && (
          <button
            onClick={() => navigate("/signup")}
            className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
          >
            Go to Signup
          </button>
        )}
        {status === "success" && (
          <p className="text-gray-600 mt-2">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
