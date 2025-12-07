import React, { useEffect, useState } from "react";
import { AlertCircle, Mail, SendHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ForgotPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const navigate = useNavigate()

    // ✅ Auto-fill email from query params
    useEffect(() => {
        const paramEmail = searchParams.get("email");
        if (paramEmail) setEmail(paramEmail);
    }, [searchParams]);

    useEffect(() => {
        if(isAuthenticated){
            navigate(-1)
        }
    }, []);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return alert("Please enter your email.");

        setLoading(true);

        await fetch("/api/users/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        // Simulate backend API call
        setTimeout(() => {
            setLoading(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">
                <h1 className="text-2xl font-semibold text-center mb-2 text-gray-800">
                    Forgot Password
                </h1>
                <p className="text-center text-gray-500 mb-3">
                    Enter your email address to receive a password reset link.
                </p>
                <div
                    className="bg-green-900/10 border border-green-500 text-green-400 px-2 py-1 mb-6 rounded-lg text-sm flex items-center"
                >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <p>Make sure your email address is registered.</p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSendEmail} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-[#3182ed] to-[#56d28e] hover:scale-105 text-white py-2.5 rounded-lg transition disabled:opacity-70"
                        >
                            {loading ? (
                                <span>Sending...</span>
                            ) : (
                                <>
                                    <SendHorizontal size={18} />
                                    <span>Send Email</span>
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="text-green-600 font-medium">
                            A password reset link has been sent to:
                        </div>
                        <div className="font-semibold text-gray-800">{email}</div>
                        <button
                            onClick={() => setIsSent(false)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Send Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
