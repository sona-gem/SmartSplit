import { Navigate } from "react-router-dom";
import useTripStore from "../store/useTripStore";

//"Should I show Dashboard, or should I redirect the user?"

export default function ProtectedRoute({ children }) {
  const token = useTripStore((state) => state.token);
  if (!token) return <Navigate to="/login" />;
  return children;
}

//children refers to whatever component is  wrapped inside ProtectedRoute