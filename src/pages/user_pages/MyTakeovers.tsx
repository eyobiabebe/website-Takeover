import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { checkProfileComplete } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import CompleteProfile from "./CompleteProfile";

interface Listing {
  id: number;
  userId: string;
  title: string;
  description?: string;
  type: "apartment" | "car";
  monthlyPrice: number;
  location: string;
  termLeft: number;
  appliedAt?: string;
  status?: string;
  images: Record<string, string[]>;
}

interface TakeOver {
  listing: Listing;
  id: number;
  userId: string;
  status: "pending" | "talking" | "proceeding" | "accepted" | "rejected";
  createdAt?: string;
}

const MyTakeovers: React.FC = () => {
  const [takeovers, setTakeovers] = useState<TakeOver[]>([]);
  const [search, setSearch] = useState("");
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeases = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`/api/listings/mytakeovers/${userId}`);
        setTakeovers(res.data);
        console.log(res.data);
        

      } catch (err) {
        console.error("Failed to fetch user leases:", err);
      }
    };

    fetchLeases();
  }, [userId]);

  const filteredTakeovers = takeovers.filter((l) =>
    [l.listing.title, l.listing.description, l.listing.location].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (!userId) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p>Please log in to view your leases.</p>
      </div>
    );
  }

  const handleProceed = async (id: number) => {
    const isProfileComplete = await checkProfileComplete(userId);
    if (!isProfileComplete) {
      navigate(`/takeover/${id}`);
    } else {
      // Handle incomplete profile case
      setIsWarningOpen(true);
    }
  }

  return (
    <div className="min-h-screen mx-auto p-4 ">
      <CompleteProfile  
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      <h1 className="text-xl font-bold bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent">My Takeovers</h1>

      <hr className="mb-3 mt-2 border-gray-300" />

      {/* Filters */}
      <div className="max-w-md mb-2">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title, location, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-2 px-6 text-left">Picture</th>
              <th className="py-2 px-6 text-left">Title</th>
              <th className="py-2 px-6 text-left">Type</th>
              <th className="py-2 px-6 text-left">Price</th>
              <th className="py-2 px-6 text-center">Applied at</th>
              <th className="py-2 px-6 text-center">Status</th>
              <th className="py-2 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {filteredTakeovers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 text-center text-gray-500"
                >
                  No takeovers found.
                </td>
              </tr>
            ) : (
              filteredTakeovers.map((takeover) => (
                <tr
                  key={takeover.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                <td className="py-1 px-6 text-left">
                  <img
                    src={
                      takeover.listing.images && Object.keys(takeover.listing.images).length > 0
                        ? `${takeover.listing.images[Object.keys(takeover.listing.images)[0]][0]}`
                        : "https://via.placeholder.com/400x250"
                    }
                    alt={takeover.listing.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                </td>
                <td className="py-1 px-6 text-left font-medium">
                  {takeover.listing.title}
                </td>
                <td className="py-1 px-6 text-left">{takeover.listing.type}</td>
                <td className="py-1 px-6 text-left">${takeover.listing.monthlyPrice}</td>
                <td className="py-1 px-6 text-center">
                  {takeover.createdAt?.slice(0, 10)}
                </td>
                <td className={`py-1 px-6 text-center font-semibold ${(takeover.status === "pending") ? "text-green-600" : "text-red-600"}`}>
                  {takeover.status.toUpperCase()}
                </td>
                <td className="py-1 px-6 text-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition"
                    onClick={() => navigate(`/dashboard/mytakeover/${takeover.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default MyTakeovers;
