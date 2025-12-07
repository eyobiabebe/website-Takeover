import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CompleteProfile from "./CompleteProfile";
import { checkProfileComplete } from "@/lib/utils";

interface Listing {
  id: number;
  userId: string;
  title: string;
  description?: string;
  type: "apartment" | "car";
  monthlyPrice: number;
  location: string;
  termLeft: number;
  takeoverAttempts?: number;
  status?: string;
  images: Record<string, string[]>;
}

const MyListings: React.FC = () => {
  const [leases, setLeases] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const navigate = useNavigate();

  const userId = useSelector((state: any) => state.auth.user?.id);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  useEffect(() => {
    const fetchLeases = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`/api/listings/mylisting/${userId}`);
        setLeases(res.data);
      } catch (err) {
        console.error("Failed to fetch user leases:", err);
      }
    };

    fetchLeases();
  }, [userId]);

  const filteredListings = leases.filter((l) =>
    [l.title, l.description, l.location].some((field) =>
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

  const handleAddListing = async () => {
      const isProfileComplete = await checkProfileComplete(userId);
  
      if (isProfileComplete) {
        navigate("/addListing");
      } else {
        setIsWarningOpen(true);
      }
    };

    const handleDeleteListing = (id: number) => {
  setDeleteId(id);
  setIsDeleteModalOpen(true);
};

const confirmDeleteListing = async (id: number) => {
  try {
    await axios.delete(`/api/listings/${id}`);
    setLeases(leases.filter((l) => l.id !== id)); // remove from UI
    setIsDeleteModalOpen(false);
  } catch (err) {
    console.error("Failed to delete listing:", err);
    setIsDeleteModalOpen(false);
  }
};


  return (
    <div className="min-h-screen mx-auto p-4 ">
      <CompleteProfile
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent">
          My Listings
        </h1>
        <button
          onClick={handleAddListing}
          className="bg-gradient-to-l from-[#3182ed] to-[#56d28e] text-sm font-semibold hover:scale-105 text-white px-3 py-1 rounded"
        >
          Add New Lease
        </button>
      </div>


      {/* <div>
        <p className="text-sm text-gray-600">Your Listing is not Published Yet</p>
      </div> */}
      <hr className="mb-3 mt-2 border-gray-300" />

      {/* Search */}
      <div className="max-w-md mb-2">
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
              <th className="py-2 px-6 text-center">Takeover Seekers</th>
              <th className="py-2 px-6 text-center">Status</th>
              <th className="py-2 px-6 text-center">View</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {filteredListings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 text-center text-gray-500"
                >
                  No listings found.
                </td>
              </tr>
            ) : (
              filteredListings.map((listing) => (
                <tr
                  key={listing.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-1 px-6 text-left">

                    <img
                      src={
                        listing.images && Object.keys(listing.images).length > 0
                          ? `${listing.images[Object.keys(listing.images)[0]][0]}`
                          : "https://via.placeholder.com/400x250"
                      }
                      alt={listing.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-1 px-6 text-left font-medium">{listing.title}</td>
                  <td className="py-1 px-6 text-left">{listing.type}</td>
                  <td className="py-1 px-6 text-left">${listing.monthlyPrice}</td>
                  <td className="py-1 px-6 text-center">
                    {listing.takeoverAttempts}
                  </td>
                  <td className={`py-1 px-6 text-center font-semibold ${listing.status === "active" ? "text-green-600" : "text-red-600"}`}>
                    {listing.status?.toUpperCase()}
                  </td>
                  <td className="py-1 px-6 text-center relative">
  <div className="inline-block text-left">
    <button
      onClick={() => setOpenDropdown(listing.id)}
      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded inline-flex items-center"
    >
      Actions
      <svg
        className="ml-1 w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    {openDropdown === listing.id && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-md shadow-lg w-64">
      <div className="py-2">
        <Link
          to={`/dashboard/mylistings/${listing.id}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          View
        </Link>
        <Link
          to={`/editlisting/${listing.id}`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDeleteListing(listing.id)}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      </div>
      <div className="flex justify-end p-2">
        <button
          onClick={() => setOpenDropdown(null)}
          className="text-gray-500 hover:text-gray-700 px-2 py-1"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


{isDeleteModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
      <p className="mb-6">Are you sure you want to delete this listing? This action cannot be undone.</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => confirmDeleteListing(deleteId!)}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


  </div>
</td>

                </tr>
              ))
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyListings;
