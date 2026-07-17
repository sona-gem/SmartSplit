import { useMemo, useEffect } from "react"; //its a react hook, helps to improve performace by caching the result (eg: recalculate teh total if expences change
import { useNavigate, useParams } from "react-router-dom"; //allows navigating to another page
import useTripStore from "../store/useTripStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCategoryEmoji } from "../utils/categories";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function TripSummary() {
  const { tripId } = useParams();
  const trip = useTripStore((state) => state.trip);
  const expenses = useTripStore((state) => state.expenses);
  const navigate = useNavigate();
  const fetchTrip = useTripStore((state) => state.fetchTrip);
  const token = useTripStore((state) => state.token);

  useEffect(() => {
    if (token && tripId) fetchTrip(tripId);
  }, []);

  // total spent
  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  );

  // per person total
  const perPersonSpend = useMemo(() => {
    const spend = {};
    trip?.members.forEach((m) => (spend[m.name] = 0));
    expenses.forEach((e) => {
      spend[e.paidBy] = (spend[e.paidBy] || 0) + e.amount;
    });
    return spend;
  }, [expenses, trip]);

  // by category for pie chart
  const categoryData = useMemo(() => {
    const cats = {};
    expenses.forEach((e) => {
      cats[e.category] = (cats[e.category] || 0) + e.amount;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  if (!trip) return <p className="mt-4 text-gray-500">Loading...</p>;

  return (
    <div className="mt-4 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900">{trip.name} — Summary</h2>

      {/* total spent card */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <p className="text-sm text-gray-500">Total spent</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          ₹{totalSpent.toFixed(2)}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {expenses.length} expenses · {trip.members.length} members
        </p>
      </div>

      {/* per person breakdown */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">
          Paid by each member
        </h3>
        {Object.entries(perPersonSpend).map(([name, amount]) => (
          <div
            key={name}
            className="flex justify-between items-center py-2 border-b last:border-0"
          >
            <span className="text-gray-700">{name}</span>
            <div className="text-right">
              <span className="font-semibold text-gray-900">
                ₹{amount.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                ({totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(0) : 0}
                %)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* category pie chart */}
      {categoryData.length > 0 && (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">
            Spending by category
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) =>
                  `${getCategoryEmoji(name)} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* category breakdown list */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Category breakdown</h3>
        {categoryData.map(({ name, value }) => (
          <div
            key={name}
            className="flex justify-between items-center py-2 border-b last:border-0"
          >
            <span className="text-gray-700">
              {getCategoryEmoji(name)} {name}
            </span>
            <span className="font-semibold text-gray-900">
              ₹{value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
