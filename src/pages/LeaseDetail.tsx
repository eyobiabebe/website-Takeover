import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin, DollarSign, Send, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import CompleteProfile from "./user_pages/CompleteProfile";
import { checkProfileComplete } from "@/lib/utils";
import { format } from "date-fns/format";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Lease {
  id: number;
  userId: string;
  title: string;
  description?: string;
  type: "apartment" | "car";
  monthlyPrice: number | string;
  location: string;
  lat: number;
  lng: number;
  endDate: Date;
  images: Record<string, string[]>; // ✅ Fix here

  incentive?: number | string;

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


const LeaseDetail: React.FC = () => {
  const { leaseId } = useParams<{ leaseId: string }>();
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const user = useSelector((state: any) => state.auth.user)
  const currentUserId = user?.id

  useEffect(() => {
    const fetchLease = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/listings/${leaseId}`, {
          withCredentials: true
        });
        setLease(res.data);
        console.log("Lease data:", res.data);
      } catch (error) {
        console.error("Failed to fetch lease:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLease();
  }, [leaseId]);

  const handleMessage = () => {
    if(!currentUserId) navigate('/signup')
    if (!lease?.userId) return;

    navigate(`/messages?listingId=${lease?.id}&receiverId=${lease?.userId}`);
  };

  if (loading)
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  if (!lease)
    return <div className="p-8 text-center text-red-600">Lease not found.</div>;

  // Utility function to safely format numbers that might come as strings
  const formatNumber = (value?: number | string, decimals = 2) => {
    if (value === undefined || value === null) return "N/A";
    const num = Number(value);
    return isNaN(num) ? "N/A" : num.toFixed(decimals);
  };

  const handleApply = async (id: number) => {
    if(!currentUserId) navigate('/signup')
    const isProfileComplete = await checkProfileComplete(currentUserId);

    if (isProfileComplete) {
      navigate(`/takeover/${id}`);
    } else {
      setIsWarningOpen(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-sm pt-20">
      <CompleteProfile
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      <h1 className="text-2xl font-bold bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent mb-3">
        Lease Details
      </h1>

      {/* Image gallery */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {lease.images && Object.keys(lease.images).length ? (
          Object.entries(lease.images).map(([section, imgs], i, arr) => (
            <div key={i} className="relative">
              <img
                src={`${imgs[0]}`} // only first image
                alt={`${section} image`}
                className="w-full h-60 border rounded-md shadow-md shadow-green-300 hover:shadow-lg transition-shadow duration-200 object-cover"
              />

              {/* Show "more images" badge only on the last section */}
              {i === arr.length - 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-2 rounded-md hover:scale-105">
                  <button
                    onClick={handleOpen}
                    className="text-white flex gap-2 "
                  >
                    <List size={16} /> View More Images
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <img
            src="https://via.placeholder.com/800x400"
            alt="Placeholder"
            className="w-full h-64 object-cover rounded-md"
          />
        )}
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
          <span>${formatNumber(lease.monthlyPrice)} / month</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-500" />
          <span>End Date: {lease?.endDate ? format(new Date(lease.endDate), "PPP") : ""}</span>
        </div>
      </div>

      {lease.description && (
        <div className="mb-6 rounded-lg p-4 bg-gray-50 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{lease.description}</p>
        </div>
      )}

      {/* Car-specific info */}
      {lease.type === "car" ? (
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
              {lease.leasingCompany?.name ?? "N/A"}
            </div>
            <div>
              <span className="font-semibold">Incentive:</span> $
              {formatNumber(lease.incentive)}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-gray-50 p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Apartments Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <div>
              <span className="font-semibold">Bedrooms:</span>{" "}
              {lease.bedrooms ?? "N/A"}
            </div>
            <div>
              <span className="font-semibold">Bathrooms:</span>{" "}
              {lease.bathrooms ?? "N/A"}
            </div>
            <div>
              <span className="font-semibold">Square Footage:</span>{" "}
              {lease.sqft ?? "N/A"}sqft
            </div>
            <div>
              <span className="font-semibold">Incentive:</span> $
              {formatNumber(lease.incentive)}
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-96 mb-6 pb-5">
        <p className="">Location At Map</p>
        <MapContainer
          center={[lease.lat, lease.lng]}
          zoom={16}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[lease.lat, lease.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="flex gap-4">

        <Link
          to="/leaseLists"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
        >
          Back to Listings
        </Link>
        {Number(lease.userId) !== Number(currentUserId) && (
          <div className="flex gap-2">
            <button
              onClick={handleMessage}
              className="bg-blue-500 flex hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              <Send className="mr-2" size={16} /> Message
            </button>
            <button
              onClick={() => handleApply(lease.id)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative bg-white rounded-lg max-w-4xl w-full p-4 overflow-y-auto h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 z-10"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4">Image Gallery</h2>

              {/* Sections and images */}
              <div className="flex flex-col gap-6">
                {/* Sections */}
                {Object.entries(lease.images).map(([section, imgs]) => (
                  <div key={section} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{section}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imgs.map((img: string, i: number) => ( // ✅ explicitly typed
                        <img
                          key={i}
                          src={`${img}`}
                          alt={`${section} ${i}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaseDetail;
