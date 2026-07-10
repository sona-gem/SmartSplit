import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import TripDashboard from "./pages/TripDashboard";
import ExpenseList from "./pages/ExpenseList";
import AddExpense from "./pages/AddExpense";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import useTripStore from "./store/useTripStore";
import Trips from "./pages/Trips";

function Navbar({ user, logout }) {
  const location = useLocation();
  const tripId = location.pathname.split("/")[2]; // extracts tripId from /trip/:tripId/...

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center text-sm font-medium">
      <div className="flex gap-6">
        <Link to="/" className="text-blue-600">
          My Trips
        </Link>
        {tripId && (
          <>
            <Link to={`/trip/${tripId}`} className="text-blue-600">
              Dashboard
            </Link>
            <Link to={`/trip/${tripId}/expenses`} className="text-blue-600">
              Expenses
            </Link>
            <Link to={`/trip/${tripId}/add`} className="text-blue-600">
              + Add
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">Hi, {user.name}</span>
        <button onClick={logout} className="text-red-500 hover:text-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  const user = useTripStore((state) => state.user);
  const logout = useTripStore((state) => state.logout);

  return (
    <BrowserRouter>
      {user && <Navbar user={user} logout={logout} />}
      <div className="max-w-2xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId"
            element={
              <ProtectedRoute>
                <TripDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/expenses"
            element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:tripId/add"
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
