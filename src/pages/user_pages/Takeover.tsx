import React, { useEffect,  useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { format } from "date-fns";

interface Lease {
  id: number;
  userId: string;
  title: string;
  description?: string;
  type: "apartment" | "car";
  price: number | string;
  location: string;
  startDate: Date;
  endDate: Date;
  images: Record<string, string[]>;

  // Car-specific fields (might be string or number from backend)
  currentMiles?: number | string;
  remainingMiles?: number | string;
  milesPerMonth?: number | string;
  leasingCompany?: string;
  incentive?: number | string;
}

const Takeover: React.FC = () => {
  const { leaseId } = useParams<{ leaseId: string }>();
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [lease, setLease] = useState<Lease | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [leaseLoading, setLeaseLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isProceed, setIsProceed] = useState(false);
axios.defaults.withCredentials = true;


  useEffect(() => {
    const fetchLease = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/listings/${leaseId}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        setLease(res.data);
      } catch (error) {
        console.error("Failed to fetch lease:", error);
      } finally {
        setLeaseLoading(false);
      }
    };
    fetchLease();
  }, [leaseId]);

  useEffect(() => {
    const getProfile = async () => {
      if (!userId) return;
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/profile/userProfile`,{ userId },{
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    getProfile();
  }, [userId]);


  if (leaseLoading || profileLoading)
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  if (!lease)
    return <div className="p-8 text-center text-red-600">Lease not found.</div>;

  // Utility function to safely format numbers that might come as strings
  const formatNumber = (value?: number | string, decimals = 2) => {
    if (value === undefined || value === null) return "N/A";
    const num = Number(value);
    return isNaN(num) ? "N/A" : num.toFixed(decimals);
  };

  const handleAttempt = () => {
    if (!userId) {
      toast.error("Please log in to proceed.");
      return;
    }
    setIsProceed(true);
  }

  const handlePayment = async () => {
    setLoading(true);   
    setIsProceed(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/takeover/findtakeover`, 
        { listingId: lease.id, userId: userId },
        {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      })
      const takeover_id = res.data.id;
      // Call backend to create a Stripe checkout session
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payments/create-takeover-checkout`, {
        leaseId: lease.id,
        takeover_id: takeover_id,
        title: "Lease Takeover Fee",
        type: "takeover_fee",
        price: 5, // Example system fee
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });

      // Redirect user to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment!");
    }
  };

  return (
    <div className=" p-6 text-sm pt-24 w-full min-h-screen bg-[url('./assets/white-bg3.jpg')] bg-cover bg-center">
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
      <div className="lg:mx-24">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent mb-3">
            Proceeding Lease Takeover
          </h1>
          <button
            onClick={handleAttempt}
            className="bg-gradient-to-l from-[#3182ed] to-[#56d28e] hover:bg-green-600 text-white py-2 px-4 rounded-md"
          >
            Proceed Now
          </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-6 p-4 border rounded shadow-sm bg-white/70">
            <h2 className="text-lg font-semibold mb-2">Lease Details</h2>
            <div className=" w-full overflow-hidden">
              <img
                src={
                  lease?.images && Object.keys(lease.images).length > 0
                    ? `${lease.images[Object.keys(lease.images)[0]][0]}`
                    : "https://via.placeholder.com/400x250"
                }
                alt={lease?.title}
                className="h-56 w-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{lease.title}</h1>
            <p className="text-gray-500 mb-4 capitalize">{lease.type}</p>

            <div className="grid md:grid-cols-2 gap-4 text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-gray-500" />
                <span>{lease.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-gray-500" />
                <span>${formatNumber(lease.price)} / month</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-500" />
                <span>Start Date: {lease?.startDate ? format(new Date(lease.startDate), "PPP") : ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-500" />
                <span>End Date: {lease?.endDate ? format(new Date(lease.endDate), "PPP") : ""}</span>
              </div>
            </div>

            {lease.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{lease.description}</p>
              </div>
            )}

            {/* Car-specific info */}
            {lease.type === "car" && (
              <div className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Car Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                  <div>
                    <span className="font-semibold">Current Miles:</span>{" "}
                    {lease.currentMiles ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Remaining Miles:</span>{" "}
                    {lease.remainingMiles ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Miles Per Month:</span>{" "}
                    {lease.milesPerMonth ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Leasing Company:</span>{" "}
                    {lease.leasingCompany ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Incentive:</span> $
                    {formatNumber(lease.incentive)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6 p-4 border rounded shadow-sm bg-white/70">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Applicant Information</h1>
            <div className="grid grid-cols-1  gap-4 text-gray-700">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {profile?.user.name ?? "N/A"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {profile?.user.email ?? "N/A"}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {profile?.profile.phoneNumber ?? "N/A"}
              </div>
              <div>
                <span className="font-semibold">Employment Status:</span>{" "}
                {profile?.profile.employmentStatus ?? "N/A"}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {profile?.profile.currentAddress ?? "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">

        </div>
      </div>

    </div>
  );
};

export default Takeover;
