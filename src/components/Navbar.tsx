import React, { useEffect, useState } from "react";
import { Bell, Bookmark, Menu, PlusCircle, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../lib/authSlice";
import axios from "axios";
import NotificationSidebar from "../pages/user_pages/Notification";
import { useSelector, useDispatch } from "react-redux";
import logo from '../assets/logo.png';
import CompleteProfile from "@/pages/user_pages/CompleteProfile";
import { checkProfileComplete } from "@/lib/utils";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const userId = user?.id;

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    const dashboardPaths = ["/dashboard", "/dashboard/mylistings", "/dashboard/mytakeovers"];
    if (dashboardPaths.includes(currentPath) && dashboardPaths.includes(path)) {
      return "text-[#7f5fba] font-semibold";
    }
    return currentPath === path ? "text-[#7f5fba] font-semibold" : "text-gray-700 hover:text-[#7f5fba]";
  };

  const isActiveMobile = (path: string) => {
  return currentPath === path ? "text-blue-400 font-semibold" : "text-[#7f5fba] hover:text-blue-400";
};

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const fetchUnreadCount = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/api/notifications/${userId}`);
      const unread = res.data.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch unread notifications", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userId]);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/users/logout", {}, { withCredentials: true });
      if (res.status === 200) dispatch(logout());
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleAddListing = async () => {
    const isProfileComplete = await checkProfileComplete(userId);
    if (isProfileComplete) navigate("/addListing");
    else setIsWarningOpen(true);
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 transition-all duration-200 bg-transparent md:bg-white md:shadow-md">
  <CompleteProfile isOpen={isWarningOpen} onClose={() => setIsWarningOpen(false)} />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
    {/* Logo */}
    <Link to="/" className="flex items-center">
      <img src={logo} alt="TakeOver Logo" className="h-8 sm:h-10" />
    </Link>

    {/* Desktop Menu */}
    <div className="hidden md:flex justify-between items-center w-full ml-6">
      <div className="flex space-x-6 text-sm font-medium text-gray-700">
        <Link to="/" className={isActive("/")}>Home</Link>
        <Link to="/leaseLists" className={isActive("/leaseLists")}>Browse</Link>
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
            <Link to="/messages" className={isActive("/messages")}>Messages</Link>
            <Link to="/profile" className={isActive("/profile")}>Profile</Link>
          </>
        )}
        {!isAuthenticated && <Link to="/how-it-works" className={isActive("/how-it-works")}>How it works</Link>}
      </div>

      {/* Right Buttons */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <button onClick={handleAddListing} className="text-[#d25692] hover:text-[#7f5fba] p-2 rounded-full"><PlusCircle size={22} /></button>

            <button onClick={() => setOpenNotification(true)} className="relative p-2 hover:text-[#7f5fba]">
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</span>
              )}
            </button>

            <Link to="/favorites" className={`p-2 hover:text-[#7f5fba] ${isActive("/favorite")}`}><Bookmark size={22} /></Link>

            <button onClick={handleLogout} className="bg-[#7f5fba] text-white px-3 py-1 rounded hover:scale-105 transition">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-[#7f5fba] px-3 py-1 rounded transition">Log In</Link>
            <Link to="/signup" className="bg-gradient-to-l from-[#3182ed] to-[#56d28e] text-white px-3 py-1 rounded hover:scale-105 transition">Sign Up</Link>
          </>
        )}
      </div>
    </div>

    {/* Mobile Menu Button */}
    <div className="md:hidden">
      <button onClick={toggleMenu}>{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
    </div>
  </div>

  {/* Mobile Slide-in Menu */}
  {menuOpen && (
    <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-end p-4">
        <button onClick={toggleMenu}><X className="w-6 h-6" /></button>
      </div>
      <Link to="/" className="flex items-center mb-4">
        <img src={logo} alt="TakeOver Logo" className="h-10 sm:h-12" />
      </Link>
      <div className="flex flex-col space-y-4 px-4">
        <Link to="/" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">Home</Link>
        <Link to="/leaseLists" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">Browse</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">Dashboard</Link>
            <Link to="/messages" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">Messages</Link>
            <Link to="/profile" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">Profile</Link>
            <button onClick={() => { handleAddListing(); toggleMenu(); }} className="text-[#7f5fba] hover:text-[#7f5fba] py-2 text-left w-full">Add Lease</button>
            <button onClick={() => { setOpenNotification(true); toggleMenu(); }} className="text-[#7f5fba] hover:text-[#7f5fba] py-2 text-left w-full">Notifications</button>
            <Link to="/favorites" onClick={toggleMenu} className={`py-2 ${isActiveMobile("/favorite")}`}>Favorites</Link>
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-[#7f5fba] hover:text-[#7f5fba] py-2 text-left w-full">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/how-it-works" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">How it works</Link>
            <Link to="/login" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">Log In</Link>
            <Link to="/signup" onClick={toggleMenu} className="text-[#7f5fba] hover:text-[#7f5fba] py-2">Sign Up</Link>
          </>
        )}
      </div>
    </div>
  )}

  {openNotification && <NotificationSidebar open={openNotification} onClose={() => setOpenNotification(false)} />}
</nav>

  );
};

export default Navbar;
