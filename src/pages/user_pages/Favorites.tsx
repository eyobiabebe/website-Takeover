import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { Heart, Share2 } from "lucide-react";
import { useSelector } from "react-redux";

interface Listing {
  id: number;
  userId: string;
  title: string;
  description?: string;
  type: "apartment" | "car";
  monthlyPrice: number;
  location: string;
  termLeft: number;
  endDate: Date;
  images: Record<string, string[]>;
  incentive: number;

  // for cars
  currentMiles: number;
  remainingMiles: number;
  milesPerMonth: number;

  // for apartments
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

interface Favorite {
  id: number;
  listingId: number;
  userId: string;
  Listing: Listing;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;

  const userId = useSelector((state: any) => state.auth.user?.id);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${userId}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [userId]);

  const toggleFavorite = async (listingId: number) => {
    if (!userId) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`,{
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }, { userId, listingId });
      const { favorited } = res.data;

      if (!favorited) {
        // removed from favorites
        setFavorites(favorites.filter((f) => f.listingId !== listingId));
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
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="px-16 py-12 text-sm bg-[url('./assets/white-bg3.jpg')] bg-cover bg-center min-h-screen">
      <h1 className="text-2xl font-bold bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent mb-6 text-center pt-10">
        My Favorites
      </h1>

      {favorites.length ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {favorites.map((fav) => (
            <LeaseCard
              key={fav.id}
              lease={fav.Listing}
              isFavorite={true}
              toggleFavorite={toggleFavorite}
              handleShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">You have no favorites yet.</p>
      )}
    </div>
  );
};

interface LeaseCardProps {
  lease: Listing;
  isFavorite: boolean;
  toggleFavorite: (id: number) => void;
  handleShare: (lease: Listing) => void;
}

const LeaseCard: React.FC<LeaseCardProps> = ({
  lease,
  isFavorite,
  toggleFavorite,
  handleShare,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative border">
        <img
          src={
            lease.images && Object.keys(lease.images).length > 0
              ? `${
                  lease.images[Object.keys(lease.images)[0]][0]
                }`
              : "https://via.placeholder.com/400x250"
          }
          alt={lease.title}
          className="w-full h-52 object-cover rounded-md"
        />

        {/* Favorite & Share Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => toggleFavorite(lease.id)}
            className={`p-2 rounded-full ${
              isFavorite ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
          </button>

          <button
            onClick={() => handleShare(lease)}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-blue-500"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{lease.title}</h3>
        <p className="text-sm text-gray-500">{lease.location}</p>
        <p className="text-sm mt-1 text-gray-600">End Date: {lease.endDate.toString()}</p>
        {lease.type === "apartment" ? (
          <>
            <p className="text-sm text-gray-500">Bedrooms: {lease.bedrooms}</p>
            <p className="text-sm text-gray-500">Bathrooms: {lease.bathrooms}</p>
            <p className="text-sm text-gray-500">Square Footage: {lease.sqft}sqft</p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">Current Miles: {lease.currentMiles}</p>
            <p className="text-sm text-gray-500">Remaining Miles: {lease.remainingMiles}</p>
            <p className="text-sm text-gray-500">Miles Per Month: {lease.milesPerMonth}</p>
          </>
        )}
        <p className="mt-2 text-blue-600 font-semibold">${lease.monthlyPrice}</p>
        <p className="mt-2 text-blue-600 font-semibold">
          Incentives: ${lease.incentive || 0}
        </p>
      </div>

      <div className="flex justify-between p-4 gap-2">
        <Link
          to={`/lease/${lease.id}`}
          className="w-full py-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600 transition"
        >
          View Details
        </Link>

        <Link
          to={`/lease/${lease.id}/apply`}
          className="w-full py-2 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default Favorites;
