import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";

const Protected = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  if (isAuthenticated === undefined) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    // ✅ Allow navigation to login or signup even if unauthenticated
    if (location.pathname !== "/login" && location.pathname !== "/signup") {
      return <Navigate to="/login" replace />;
    }

    
  }

  return <Outlet />;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorised" state={{ from: location }} replace />
  );
};


export default Protected;
