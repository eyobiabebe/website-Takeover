import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword';
import Navbar from './components/Navbar';
import AddListing from './pages/user_pages/AddListing';
import Profile from './pages/user_pages/Profile';
import LeaseLists from './pages/LeaseLists';
import HowItWorks from './pages/HowItWorks';
import Footer from './components/Footer';
import LeaseDetail from './pages/LeaseDetail';
import Protected from './lib/Protected';
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';
import Messages from './pages/user_pages/Messages';
import EditListing from './pages/user_pages/EditListing';
import { Slide, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import Takeover from './pages/user_pages/Takeover';
import Dashboard from './pages/user_pages/Dashbord';
import MyListingDetail from './pages/user_pages/MyListingDetail';
import Spinner from './components/Spinner';
import Favorites from './pages/user_pages/Favorites';
import VerfiyEmail from './pages/VerifyEmail'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login, logout } from './lib/authSlice';
import PaymentPage from './pages/user_pages/payment/PaymentPage';
import SuccessPage from './pages/user_pages/payment/SuccessPage';
import MyTakeoverDetail from './pages/user_pages/MytakeoverDetail';
import CancelPage from './pages/user_pages/payment/CancelPage';
// import ForgotPassword from './components/ForgotPassword';
import ResetPasswordPage from './components/ResetPasswordPage';
import TermsPage from './components/TermsPage';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // ✅ axios must send cookies
        const res = await axios.get("https://backend-takeover-4.onrender.com/api/users/me", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });

        if (res.status === 200 ) {
            if (res.data.token) {
       localStorage.setItem("authToken", res.data.token);
      }
          dispatch(login(res.data.user)); // put user in Redux
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [dispatch]);

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <>

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerfiyEmail/>} />

          <Route path="/leaseLists" element={<LeaseLists />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/lease/:leaseId" element={<LeaseDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/unauthorised" element={<Unauthorized />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected Routes */}

          {/* Add other routes here */}
          <Route element={<Protected />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/addListing" element={<AddListing />} />
            <Route path="/mylistings/:leaseId" element={<MyListingDetail />} />
            <Route path="/mytakeover/:id" element={<MyTakeoverDetail />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/editlisting/:id" element={<EditListing />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/takeover/:leaseId" element={<Takeover />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success/:title" element={<SuccessPage />} />
            <Route path="/cancel/:title" element={<CancelPage />} />
          </Route>

        </Routes>
        <Footer />
        <ToastContainer
          position='bottom-right'
          theme='dark'
          transition={Slide}
        />
      </Router>
    </>
  )
}

export default App
