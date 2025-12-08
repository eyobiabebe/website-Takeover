import { useEffect,  useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
    Calendar,
    MapPin,
    BedDouble,
    Bath,
    DollarSign,
    Building2,
    Send,
    PartyPopper,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { format } from "date-fns";

// -----------------------------
// Types
// -----------------------------

interface Listing {
    id: number;
    userId: string;
    title: string;
    description?: string;
    type: "apartment" | "car";
    monthlyPrice: number;
    location: string;
    startDate: Date,
    endDate: Date;
    appliedAt?: string;
    status?: string;
    images: Record<string, string[]>;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    incentive?: number;
}

interface TakeOver {
    listing: Listing;
    id: number;
    userId: string;
    status: "pending" | "talking" | "proceeding" | "accepted" | "rejected";
    createdAt?: string;
}

// -----------------------------
// Helpers
// -----------------------------

function formatMoney(n: number) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(n);
}



const statusBadge: Record<TakeOver["status"], string> = {
    pending: "bg-green-100 text-green-700 border-green-200",
    talking: "bg-amber-100 text-amber-700 border-amber-200",
    rejected: "bg-rose-100 text-rose-700 border-rose-200",
    accepted: "bg-blue-100 text-blue-700 border-blue-200",
    proceeding: "bg-purple-100 text-purple-700 border-purple-200",
};

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 120, damping: 14 },
    },
};

export default function MyTakeoverDetail() {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [takeover, setTakeover] = useState<TakeOver | null>(null);
    const userId = useSelector((state: any) => state.auth.user?.id);
    const [isProceed, setIsProceed] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTakeover = async () => {
            setLoading(true);
            try {
                console.log(id);

                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/takeover/${id}`);
                setTakeover(res.data);
                console.log("Takeover data:", res.data);
            } catch (error) {
                console.error("Failed to fetch takeover:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTakeover();
    }, [id]);

    const handleMessage = () => {
        if (!takeover?.userId) return;

        navigate(`/messages?listingId=${takeover.listing.id}&receiverId=${takeover.listing.userId}`);
    };

    const handleAttempt = () => {
        if (!userId) {
            toast.error("Please log in to proceed.");
            return;
        }
        setIsProceed(true);
    }

    const handlePayment = async () => {
        setIsProceed(false);
        try {
            // Call backend to create a Stripe checkout session
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/create-takeover-checkout`, {
                leaseId: takeover?.listing.id,
                takeover_id: takeover?.id,
                title: "Lease Takeover Fee",
                type: "takeover_fee",
                price: 5, // Example system fee
            });

            // Redirect user to Stripe Checkout
            window.location.href = data.url;
        } catch (error) {
            console.error("Payment initialization failed:", error);
            toast.error("Failed to initialize payment!");
        }
    };

    if (loading) return <Spinner />

    return (
        <div className="min-h-screen  lg:p-6 p-4">
            <div className="">
                {/* Modal for payment confirmation */}
                {isProceed && (
                    <div
                        className="fixed inset-0 flex flex-col justify-center items-center min-h-screen bg-gray-400/50 px-6"
                        onClick={() => setIsProceed(false)} // ✅ clicking overlay closes modal
                    >
                        <div
                            className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
                            onClick={(e) => e.stopPropagation()} // prevent inside click from closing
                        >
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
                                className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${loading
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
                )}
                {/* Header */}
                <div className="mb-2 mt- flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="">
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent md:text-2xl">
                            Your Takeover Details
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Review and manage your takeover.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-400 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-500 transition"
                    >
                        ← Back
                    </button>
                </div>

                {/* Two-column responsive grid */}
                <div className="">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="mb-2"
                    >
                        <motion.div variants={item} className="rounded-2xl bg-white p-4 shadow md:p-5">
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <h3 className="text-base font-semibold text-slate-900 md:text-lg">Details</h3>
                            </div>

                            <motion.ul
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1"
                            >
                                <div className="flex gap-2">
                                    <p className="">Takeover status:</p>
                                    <span
                                        className={`truncate rounded-full border px-2 py-0.5 text-[11px] ${statusBadge[takeover?.status ?? "pending"]
                                            }`}
                                    >
                                        {takeover?.status ?? "pending"}
                                    </span>

                                </div>

                                <div className="flex gap-2">
                                    {(takeover?.status === "talking") ? (
                                        <div className="flex gap-2 text-sm">
                                            <button
                                                onClick={handleAttempt}
                                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                                            >
                                                Proceed Now
                                            </button>
                                        </div>
                                    ) : takeover?.status === "proceeding" ? (
                                        <p className="border p-2 bg-emerald-50 rounded-lg text-sm w-fit">You have successfully proceeded with the takeover wait for acceptance.</p>
                                    ) : (
                                        <p></p>
                                    )}
                                    {takeover?.status === "accepted" && (
                                        <div className="flex gap-2 items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-1 w-fit">
                                            <PartyPopper size={20} />
                                            <p className="text-sm text-gray-600">Congragulation You have been accepted for this lease takeover.</p>
                                            <button className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                                onClick={() => { }}
                                            >
                                                Download pdf
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleMessage}
                                        className="bg-blue-500 flex items-center hover:bg-blue-600 text-white py-1 px-4 rounded-md text-sm"
                                    >
                                        <Send className="mr-2" size={16} /> Message
                                    </button>
                                </div>

                            </motion.ul>
                        </motion.div>
                    </motion.div>
                    {/* LEFT: Lease details */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className=""
                    >
                        <h3 className="text-base font-semibold text-slate-900 md:text-lg mb-2 ml-2">Lease Details</h3>
                        <motion.div variants={item} className="flex lg:flex-row flex-col rounded-2xl bg-white shadow">
                            <div className="m-4">
                                <img
                                    src={
                                        takeover?.listing.images && Object.keys(takeover?.listing.images).length > 0
                                            ? `${takeover?.listing.images[Object.keys(takeover?.listing.images)[0]][0]}`
                                            : "https://via.placeholder.com/400x250"
                                    }
                                    alt={takeover?.listing.title}
                                    className="h-56 w-56 object-cover rounded-lg border"
                                />
                            </div>
                            <div className="space-y-4 p-5 md:p-6">
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">{takeover?.listing?.title}</h2>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>
                                                {takeover?.listing?.location},
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 px-4 py-2 text-right">
                                        <div className="text-sm text-slate-500">Monthly</div>
                                        <div className=" font-bold text-slate-900">{formatMoney(Number(takeover?.listing?.monthlyPrice) || 0)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                                        <BedDouble className="h-4 w-4" />
                                        <span className="text-sm">{takeover?.listing?.bedrooms} beds</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                                        <Bath className="h-4 w-4" />
                                        <span className="text-sm">{takeover?.listing?.bathrooms} baths</span>
                                    </div>
                                    {typeof takeover?.listing?.sqft === "number" && (
                                        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                                            <Building2 className="h-4 w-4" />
                                            <span className="text-sm">{takeover?.listing?.sqft} sqft</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-sm">incentive: {formatMoney(Math.round(Number(takeover?.listing?.incentive)))}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Start Date: {takeover?.listing?.startDate ? format(new Date(takeover?.listing?.startDate), "PPP") : ""}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">End Date: {takeover?.listing?.endDate ? format(new Date(takeover?.listing?.endDate), "PPP") : ""}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    {/* <span className="rounded-full bg-slate-100 px-3 py-1">Posted by {listing?.postedBy}</span> */}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Applicants list */}

                </div>
            </div>
        </div>
    );
}
