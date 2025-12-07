import { useEffect, useState } from "react";
import MyListings from "./MyListings";
import MyTakeovers from "./MyTakeovers";
import MyListingDetail from "./MyListingDetail";
import { Route, Routes, useNavigate } from "react-router-dom";
import MyTakeoverDetail from "./MytakeoverDetail";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("/dashboard/mylistings");
    const navigate = useNavigate();

    useEffect(() => {
        navigate(activeTab);
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[url('./assets/white-bg3.jpg')] bg-cover bg-center">
            {/* Main Content */}
            <div className="flex-1 pt-16 px-4 md:px-8 lg:px-12">
                {/* Tabs */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 text-sm border-t px-2 pt-2">
                        <button
                            onClick={() => { navigate("/dashboard/mylistings"); setActiveTab("/dashboard/mylistings") }}
                            className={`px-4 font-semibold ${activeTab === "/dashboard/mylistings"
                                ? 'border px-2 py-1 bg-[#7f5fba] text-white rounded-t-md border-b-0'
                                : 'border rounded-t-md border-b-0 px-2 py-1 bg-gray-300'
                            }`}
                        >
                            My Listings
                        </button>
                        <button
                            onClick={() => { navigate("/dashboard/mytakeovers"); setActiveTab("/dashboard/mytakeovers") }}
                            className={`px-4 font-semibold ${activeTab === "/dashboard/mytakeovers"
                                ? 'border py-1 bg-[#7f5fba] text-white rounded-t-md px-2 border-b-0'
                                : 'border rounded-t-md border-b-0 px-2 py-1 bg-gray-300'
                            }`}
                        >
                            My Takeovers
                        </button>
                    </div>
                </div>

                {/* Content Routes */}
                <div className="shadow border rounded p-2 md:p-4 w-full">
                    <Routes>
                        <Route path="/mylistings" element={<MyListings />} />
                        <Route path="/mytakeovers" element={<MyTakeovers />} />
                        <Route path="/mylistings/:leaseId" element={<MyListingDetail />} />
                        <Route path="/mytakeover/:id" element={<MyTakeoverDetail />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
