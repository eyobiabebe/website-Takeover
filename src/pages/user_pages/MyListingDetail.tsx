import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Calendar,
  MapPin,
  BedDouble,
  Bath,
  Users,
  DollarSign,
  Clock,
  Mail,
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Send,
  PartyPopper,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { AiFillWarning } from "react-icons/ai";
import Swal from 'sweetalert2';
import { format } from "date-fns";

// -----------------------------
// Types
// -----------------------------

interface Lease {
  id: number;
  userId: string;
  title: string;
  description?: string;
  type: "apartment" | "car";
  monthlyPrice: number | string;
  location: string;
  startDate: Date;
  endDate: Date;
  images: Record<string, string[]>; // ✅ Fix here

  incentive?: number | string;
  status?: string;

  // Car-specific fields
  currentMiles?: number | string;
  remainingMiles?: number | string;
  milesPerMonth?: number | string;
  leasingCompany?: {
    name: string,
    email: string,
  };
  vin_no: number;

  // For apartments
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

type Applicant = {
  id: number;
  User: {
    id: number;
    name: string;
    email: string;
    image?: string | null;
  };
  UserProfile: {
    employmentStatus: string;
    currentAddress: string;
  };
  status: "talking" | "pending" | "proceeding" | "accepted" | "rejected";
  createdAt: string; // ISO date
};

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

function initials(name: string) {
  const parts = name.split(" ");
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const statusBadge: Record<Applicant["status"], string> = {
  accepted: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
  talking: "bg-blue-100 text-blue-700 border-blue-200",
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

export default function MyListingDetail() {
  const { leaseId } = useParams<{ leaseId: string }>();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOneAccepted, setIsOneAccepted] = useState(false);
  const [listing, setListing] = useState<Lease | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | Applicant["status"]>("all");
  const [viewUser, setViewUser] = useState<Applicant | null>(null);
  const [isProceed, setIsProceed] = useState(false);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLease = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/listings/${leaseId}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        setListing(res.data);
        console.log("Lease data:", res.data);
      } catch (error) {
        console.error("Failed to fetch lease:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/listings/applicants/${leaseId}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        setApplicants(res.data);
        console.log("Applicants data:", res.data);

        const acceptedExists = res.data.some((a: Applicant) => a.status === "accepted");
        setIsOneAccepted(acceptedExists);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLease();
    fetchApplicants();
  }, [leaseId]);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const q = query.toLowerCase();
      const matches =
        a.User?.name.toLowerCase().includes(q) ||
        a.User?.email.toLowerCase().includes(q);
      const statusOk = statusFilter === "all" ? true : a.status === statusFilter;
      return matches && statusOk;
    });
  }, [applicants, query, statusFilter]);

  const statsData = useMemo(() => {
    const counts = { pending: 0, accepted: 0, rejected: 0 } as Record<Applicant["status"], number>;
    applicants.forEach((a) => counts[a.status]++);
    return [
      { name: "Pending", value: counts.pending },
      { name: "Accepted", value: counts.accepted },
      { name: "Rejected", value: counts.rejected },
    ];
  }, [applicants]);

  // Update status locally after API call
  const handleAccept = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Accept',
        text: "Are you sure you want to accept this applicant?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, accept it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/takeover/accept/${id}`);

        if(res.data.error){
        console.error("Failed to accept listing:", res.data.details);
        }

        setApplicants((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: "accepted" } : a
          ));

        setIsOneAccepted(true);

        setListing(res.data.listing);
        setViewUser(null);

        toast.success("You accepted the applicant successfuly")
      }
    } catch (err) {
      console.error("Failed to accept listing:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Reject',
        text: "Are you sure you want to reject this applicant?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/takeover/reject/${id}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        setApplicants((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: "rejected" } : a
          ));

        toast.success("You rejected the applicant successfuly")
      }
    } catch (err) {
      console.error("Failed to reject listing:", err);
    }
  };

  const handleMessage = (a: Applicant) => {
    if (!listing?.userId) return;

    navigate(`/messages?listingId=${listing.id}&receiverId=${a.User.id}`);
  };

  const handlePayment = async () => {
    if (!listing?.id) return toast.error("Missing listing ID.");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/create-listing-checkout`, {
        listingId: listing.id,
        price: 10, // fixed or dynamic fee
        title: 'Listing Fee',
        type: 'listing_fee',
      },{
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });

      window.location.href = data.url; // redirect to Stripe
    } catch (err) {
      toast.error("Payment initialization failed.");
      console.log(err);
    }
  };

  const handleComplete = async () => {
    if (!listing?.id) return toast.error("Missing listing ID.");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/listings/complete`,{ listingId: listing.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      if (res.data) {
        setListing(res.data.listing);
        toast.success("Listing completed successfully.");
      }
    } catch (err) {
      toast.error("Payment initialization failed.");
      console.log(err);
    }
  };

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen p-6 py-4">
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
        {viewUser && (
          <div
            className="fixed inset-0 z-10 flex flex-col justify-center items-center min-h-screen bg-gray-400/50 px-6"
            onClick={() => setViewUser(null)} // ✅ clicking overlay closes modal
          >
            <div
              className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center "
              onClick={(e) => e.stopPropagation()} // prevent inside click from closing
            >
              <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                User Information
              </h1>

              <p className="text-gray-600 mb-8 leading-relaxed text-left">
                <strong>Name:</strong> {viewUser.User.name} <br />
                <strong>Email:</strong> {viewUser.User.email} <br />
                <strong>Employment Status:</strong> {viewUser.UserProfile.employmentStatus} <br />
                <strong>Location:</strong> {viewUser.UserProfile.currentAddress} <br />
              </p>

              {isOneAccepted ? (
                viewUser.status === "accepted" ? (
                  <p className="text-sm text-gray-500 bg-green-100 rounded-lg p-2 mt-2 w-fit">Congratulations you have accepted this user!</p>
                ) : (
                  <></>
                )
              ) : (
                viewUser.status === "talking" ? (
                  <p className="text-sm pt-1 text-gray-500">In conversation...</p>
                ) : viewUser.status === "proceeding" ? (
                  <div className="mt-3 flex gap-3">
                    <button className="inline-flex items-center gap-1 rounded-xl bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                      onClick={() => handleAccept(viewUser.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Accept
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-xl bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
                      onClick={() => handleReject(viewUser.id)}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                ) : viewUser.status === "accepted" ? (
                  <p className="text-sm pt-1 text-gray-500 bg-green-100 rounded-lg p-2 mt-1 w-fit">Congratulations you have accepted this user!</p>
                ) : (
                  <p className="text-sm pt-1 text-gray-500">This user in rejected</p>
                )
              )}
            </div>
          </div>
        )}
        {/* Header */}
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent md:text-2xl">
              Your Listing Details
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Review the listing and manage takeover applicants.
            </p>
          </div>
          <div className="flex gap-2 flex-row lg:flex-col">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-400 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-500 transition"
            >
              ← Back
            </button>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              <Users className="h-4 w-4" /> {applicants.length} Applicants
            </span>
          </div>
        </div>

        {/* Warning message for unpublished listings */}
        {listing?.status === "draft" && (
          <div className="mb-4 flex gap-2 items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-1 w-fit">
            <AiFillWarning size={20} />
            <p className="text-sm text-gray-600">Your Listing is not Published Yet. Your Listing will be visible to users once published.</p>
            <button className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
              onClick={handlePayment}
            >
              Publish Listing
            </button>
          </div>
        )}

        {listing?.status !== "draft" && (
          <div className="mb-1 flex gap-2 items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-1 w-fit">
            <p className="text-sm font-semibold text-gray-800">Status: {listing?.status?.toUpperCase()}</p>
          </div>
        )}

        {listing?.status === "archived" && (
          <div className="mb-2 flex gap-2 items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-1 w-fit">
            <PartyPopper size={20} />
            <p className="text-sm text-gray-600">You have got your takeoverer tab completed after the paper work.</p>
            <button className="cursor-pointer inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
              onClick={handleComplete}
            >
              Completed
            </button>
          </div>
        )}

        {/* Two-column responsive grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* LEFT: Lease details */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-1"
          >
            <motion.div variants={item} className="overflow-hidden rounded-2xl bg-white shadow">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  src={
                    listing?.images && Object.keys(listing.images).length > 0
                      ? `${listing.images[Object.keys(listing.images)[0]][0]}`
                      : "https://via.placeholder.com/400x250"
                  }
                  alt={listing?.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4 p-5 md:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">{listing?.title}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {listing?.location},
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-2 text-right">
                    <div className="text-sm text-slate-500">Monthly</div>
                    <div className=" font-bold text-slate-900">{formatMoney(Number(listing?.monthlyPrice) || 0)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                    <BedDouble className="h-4 w-4" />
                    <span className="text-sm">{listing?.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                    <Bath className="h-4 w-4" />
                    <span className="text-sm">{listing?.bathrooms} baths</span>
                  </div>
                  {typeof listing?.sqft === "number" && (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">{listing.sqft} sqft</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-700">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">incentive: {formatMoney(Math.round(Number(listing?.incentive)))}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Start Date: {listing?.startDate ? format(new Date(listing?.startDate), "PPP") : ""}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">End Date: {listing?.endDate ? format(new Date(listing?.endDate), "PPP") : ""}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">Applicant Status Overview</h3>
                  <div className="h-40 w-full text-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statsData} margin={{ left: 0, right: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  {/* <span className="rounded-full bg-slate-100 px-3 py-1">Posted by {listing?.postedBy}</span> */}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Applicants list */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="md:col-span-2"
          >
            <motion.div variants={item} className="rounded-2xl bg-white p-4 shadow md:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900 md:text-lg">Applicants</h3>
                <span className="text-xs text-slate-500">Sort by newest</span>
              </div>

              {/* Search + Filter */}
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="relative sm:col-span-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-slate-200 focus:ring-2"
                    placeholder="Search applicants"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">All statuses</option>
                  <option value="talking">Talking</option>
                  <option value="proceeding">Proceeding</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <motion.ul
                variants={container}
                initial="hidden"
                animate="show"
                className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1"
              >
                <AnimatePresence initial={false}>
                  {filtered.map((a) => (
                    <motion.li
                      key={a.id}
                      layout
                      variants={item}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="group flex items-start gap-3 rounded-2xl border border-slate-200 p-3 hover:shadow-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                        {initials(a.User.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-sm font-medium text-slate-900">{a.User.name}</div>
                          <span className={`truncate rounded-full border px-2 py-0.5 text-[11px] ${statusBadge[a.status]}`}>
                            {a.status}
                          </span>
                          {/* {typeof a.creditScore === "number" && (
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
                              Score {a.creditScore}
                            </span>
                          )} */}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {a.User.email}</span>
                          {/* {a.User.phone && (
                            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {a.User.phone}</span>
                          )} */}
                          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />
                            {new Date(a.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {/* {a.message && (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-700">{a.message}</p>
                        )} */}
                        {isOneAccepted ? (
                          a.status === "accepted" ? (
                            <p className="text-sm text-gray-500 bg-green-100 rounded-lg p-2 mt-2 w-fit">Congratulations you have accepted this user!</p>
                          ) : (
                            <></>
                          )
                        ) : (
                          a.status === "talking" ? (
                            <p className="text-sm pt-1 text-gray-500">In conversation...</p>
                          ) : a.status === "proceeding" ? (
                            <div className="mt-3 flex gap-3">
                              <button className="inline-flex items-center gap-1 rounded-xl bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200"
                                onClick={() => handleAccept(a.id)}
                              >
                                <CheckCircle2 className="h-4 w-4" /> Accept
                              </button>
                              <button className="inline-flex items-center gap-1 rounded-xl bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
                                onClick={() => handleReject(a.id)}
                              >
                                <XCircle className="h-4 w-4" /> Reject
                              </button>
                            </div>
                          ) : a.status === "accepted" ? (
                            <p className="text-sm pt-1 text-gray-500 bg-green-100 rounded-lg p-2 mt-1 w-fit">Congratulations you have accepted this user!</p>
                          ) : (
                            <p className="text-sm pt-1 text-gray-500">This user in rejected</p>
                          )
                        )}

                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMessage(a)}
                          className="flex items-center text-blue-500 hover:scale-105 cursor-pointer rounded-md"
                        >
                          <Send className="" size={20} />
                        </button>
                        <button className="ml-auto shrink-0 items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-slate-200 group-hover:flex"
                          onClick={() => { setViewUser(a) }}
                        >
                          View <span aria-hidden>→</span>
                        </button>
                      </div>

                    </motion.li>
                  ))}
                </AnimatePresence>

                {filtered.length === 0 && (
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600"
                  >
                    No applicants match your filters.
                  </motion.li>
                )}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
