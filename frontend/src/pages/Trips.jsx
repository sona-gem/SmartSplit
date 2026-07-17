import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTripStore from "../store/useTripStore";

export default function Trips() {
  const trips = useTripStore((state) => state.trips);
  const fetchTrips = useTripStore((state) => state.fetchTrips);
  const createTrip = useTripStore((state) => state.createTrip);
  const navigate = useNavigate();
  const user = useTripStore((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [tripName, setTripName] = useState("");
  const [membersInput, setMembersInput] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!tripName) return;
    // create trip with only the creator as a member
    const newTrip = await createTrip({
      name: tripName,
      members: [{ name: user.name, userId: user.id }], // only creator
    });
    if (newTrip) navigate(`/trip/${newTrip._id}`);
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Trips</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Trip"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border rounded-xl p-4 mb-4 bg-white shadow-sm flex flex-col gap-3"
        >
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Trip name
            </label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g. Goa Trip 2025"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <p className="text-xs text-gray-400">
            You'll be added automatically. Invite others via link after
            creating.
          </p>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Create Trip
          </button>
        </form>
      )}

      {trips.map((trip) => (
        <div
          key={trip._id}
          onClick={() => navigate(`/trip/${trip._id}`)}
          className="border rounded-xl p-4 mb-3 bg-white shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
        >
          <p className="font-semibold text-gray-800">{trip.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            {trip.members?.length ?? 0} members
          </p>
        </div>
      ))}
    </div>
  );
}
