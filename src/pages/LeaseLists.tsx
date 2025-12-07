import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Heart, Share2 } from "lucide-react";
import { useSelector } from "react-redux";
import CompleteProfile from "./user_pages/CompleteProfile";
import { checkProfileComplete } from "@/lib/utils";
import { format } from "date-fns/format";
import { motion } from "framer-motion";

interface Listing {
  id: number;
  userId: number;
  title: string;
  description?: string;
  type: "apartment" | "car";
  monthlyPrice: number;
  location: string;
  endDate: Date;
  images: Record<string, string[]>;
  incentive: number;
  status: string;

  // for cars
  currentMiles: number;
  remainingMiles: number;
  milesPerMonth: number;

  // for apartments
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

const LeaseLists: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/listings");

        setListings(res.data);
        console.log("user id:", userId, typeof userId);
        console.log("Fetched listings:", res.data, typeof res.data[0]?.userId);

      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // separate effect for favorites
  useEffect(() => {
    if (!userId) return; // don’t run until session is loaded
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`/api/favorites/${userId}`);
        setFavorites(res.data.map((f: { listingId: number }) => f.listingId));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [userId]); // runs again whenever userId changes


  const toggleFavorite = async (listingId: number) => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    try {
      const res = await axios.post("/api/favorites", { userId, listingId });
      const { favorited } = res.data;

      if (favorited) {
        setFavorites([...favorites, listingId]);
      } else {
        setFavorites(favorites.filter((id) => id !== listingId));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleShare = async (listing: Listing) => {
    const shareUrl = `${window.location.origin}/lease/${listing.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: listing.description || "Check this out!",
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } else {
        // Ultimate fallback: prompt user to copy manually
        window.prompt("Copy this link:", shareUrl);
      }
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  const uniqueLocations = Array.from(
    new Set(listings.map((l) => l.location))
  ).sort();

  const filteredListings = listings.filter((l) => {
    const matchText = [l.title, l.description].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    );

    const matchPrice = l.monthlyPrice >= minPrice && l.monthlyPrice <= maxPrice;


    const matchLocation =
      locationFilter === "" ||
      l.location.toLowerCase() === locationFilter.toLowerCase();

    return matchText && matchPrice && matchLocation;
  });

  const apartments = filteredListings.filter((l) => l.type === "apartment");
  const cars = filteredListings.filter((l) => l.type === "car");

  const handleApply = async (id: number) => {
    if(!userId){ navigate('/signup')}
    const isProfileComplete = await checkProfileComplete(userId);

    if (isProfileComplete) {
      navigate(`/takeover/${id}`);
    } else {
      setIsWarningOpen(true);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
   <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-12 text-sm bg-[url('./assets/white-bg3.jpg')] bg-cover bg-center">

      <CompleteProfile
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      <h1 className="text-2xl font-bold bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent mb-3 text-center pt-10">
        Available Leases
      </h1>

      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-10 flex md:flex-row justify-center items-start gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white text-sm"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>


        {/* <div className="flex items-center gap-2">
          <select
            value={priceFilter}
            onChange={(e) =>
              setPriceFilter(e.target.value as "none" | "gt" | "lt")
            }
            className="px-2 py-1 border rounded-md bg-white text-sm"
          >
            <option value="none">Price: -</option>
            <option value="gt">Price &gt;</option>
            <option value="lt">Price &lt;</option>
          </select>

          <input
            type="number"
            placeholder="Enter price"
            value={targetPrice}
            onChange={(e) =>
              setTargetPrice(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="flex-1 px-2 py-1 border rounded-md text-sm"
          />
        </div> */}
        {/* ============ price filter ==================== */}
        {/* <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Monthly Rent
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        </div> */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow px-4 py-2">

          {/* Header */}
          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className=" font-semibold text-slate-800 dark:text-slate-200">
              Monthly Rent
            </span>
            <motion.span
              animate={{ rotate: showPriceFilter ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-slate-600 dark:text-slate-400"
            >
              ▼
            </motion.span>
          </button>

          {/* Collapsible Body */}
          <motion.div
            initial={false}
            animate={{ height: showPriceFilter ? "auto" : 0, opacity: showPriceFilter ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Min Price */}
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Apartments Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Apartments</h2>
        {apartments.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {apartments.map((apartment) => (
              <LeaseCard
                key={apartment.id}
                lease={apartment}
                userId={userId}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handleShare={handleShare}
                handleApply={handleApply}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No apartments found.</p>
        )}
      </section>

      {/* Cars Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cars</h2>
        {cars.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {cars.map((car) => (
              <LeaseCard
                key={car.id}
                lease={car}
                userId={userId}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handleShare={handleShare}
                handleApply={handleApply}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No cars found.</p>
        )}
      </section>
    </div>
  );
};

interface LeaseCardProps {
  lease: Listing;
  userId?: number;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  handleShare: (lease: Listing) => void;
  handleApply: (id: number) => void;
}

const LeaseCard: React.FC<LeaseCardProps> = ({
  lease,
  favorites,
  userId,
  toggleFavorite,
  handleShare,
  handleApply
}) => {

  const isOwner = String(lease?.userId) === String(userId);
  return (
    <div className="bg-white shadow-md rounded-3xl overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative border">
        <img
          src={
            lease.images && Object.keys(lease.images).length > 0
              ? `${lease.images[Object.keys(lease.images)[0]][0]}`
              : "https://via.placeholder.com/400x250"
          }
          alt={lease.title}
          className="w-full h-52 object-cover rounded-md"
        />

        {/* Favorite & Share Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => toggleFavorite(lease.id)}
            className={`p-2 rounded-full ${favorites.includes(lease.id)
              ? "bg-red-100 text-red-500"
              : "bg-gray-100 text-gray-500"
              }`}
          >
            <Heart
              className={`h-5 w-5 ${favorites.includes(lease.id) ? "fill-red-500" : ""
                }`}
            />
          </button>

          <button
            onClick={() => handleShare(lease)}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-blue-500"
          >
            <Share2 className="h-5 w-5" />
          </button>

        </div>

        {lease.images && Object.keys(lease.images).length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
            +{Object.keys(lease.images).length - 1} more
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{lease.title}</h3>
        <p className="text-sm text-gray-500">{lease.location}</p>
        <p className="text-sm mt-1 text-gray-600">End Date: {lease?.endDate ? format(new Date(lease.endDate), "PPP") : ""}</p>
        <p className="mt-2 text-[#b68fff] font-semibold">
          ${lease.monthlyPrice}
        </p>
        <p className="mt-2 text-[#b68fff] font-semibold">
          Incentives: ${lease.incentive | 0}
        </p>
      </div>

      <div className="flex justify-between p-4 gap-2">
        <Link
          to={`/lease/${lease.id}`}
          className="w-full py-2 bg-[#7f5fba] text-white rounded-lg text-center hover:bg-blue-600 transition"
        >
          View Details
        </Link>

        {isOwner ? null : (
          <button
            onClick={() => handleApply(lease.id)}
            className="w-full py-2 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition"
          >
            Apply Now
          </button>
        )}

      </div>
    </div>
  );
};

export default LeaseLists;
