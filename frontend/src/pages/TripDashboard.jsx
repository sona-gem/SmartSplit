//fetches a trip and its expenses from backend when a page loads
//passes the data to balanceSummary for calculation
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTripStore from "../store/useTripStore";
import BalanceSummary from "../components/BalanceSummary";

export default function TripDashboard() {
  const { tripId } = useParams(); //reads the tripid from  the URL
  const trip = useTripStore((state) => state.trip); //subscribe to the store so that if any chnages r made to trip the TripDashboard will rerender
  const expenses = useTripStore((state) => state.expenses);
  const loading = useTripStore((state) => state.loading);
  const fetchTrip = useTripStore((state) => state.fetchTrip);
  const token = useTripStore((state) => state.token);
  const generateInvite = useTripStore((state) => state.generateInvite);
  const [inviteLink, setInviteLink] = useState("");

  //this enables to fetch data inside a component when the component loads
  //[] => dependency array => tells react to run the effect only when the component mounts
  useEffect(() => {
    if (token && tripId) fetchTrip(tripId); // ← only fetch if logged in
  }, [tripId]);

  if (loading) return <p className="mt-4 text-gray-500">Loading...</p>;
  if (!trip) return <p className="mt-4 text-gray-500">No trip found</p>;

  async function handleInvite() {
    const token = await generateInvite(tripId);
    console.log("token received:", token);
    const link = `${window.location.origin}/join/${token}`;
    setInviteLink(link);
    navigator.clipboard.writeText(link);
    alert("Invite link copied to clipboard!");
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-gray-900">{trip.name}</h2>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleInvite}
          className="text-sm bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          🔗 Invite members
        </button>
        {inviteLink && (
          <p className="text-xs text-gray-400 truncate max-w-xs">
            {inviteLink}
          </p>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">
        {trip.members.length} members . {expenses.length} expenses
      </p>
      <BalanceSummary expenses={expenses} members={trip.members} />
    </div>
  );
}
