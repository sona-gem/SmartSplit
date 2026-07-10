import { useState, useEffect } from "react";
import useTripStore from "../store/useTripStore";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function AddExpense() {
  const { tripId } = useParams();
  const trip = useTripStore((state) => state.trip);
  const addExpense = useTripStore((state) => state.addExpense);
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);

  // set defaults once trip loads
  useEffect(() => {
    if (trip) {
      setPaidBy(trip.members[0].name);
      setSplitAmong(trip.members.map((m) => m.name));
    }
  }, [trip]);

  // wait for trip to load before rendering
  if (!trip) return <p className="mt-4 text-gray-500">Loading...</p>;

  // to select or deselect a member
  function toggleMember(memberName) {
    setSplitAmong(
      (
        prev, //updates the split among state
      ) =>
        prev.includes(memberName) //if prev state includes memeber then remove
          ? prev.filter((n) => n !== memberName) //filter => keep everything else except the merberId that is already present
          : [...prev, memberName], //spread op copies all the existing elems and adds the new one
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description || !amount || splitAmong.length === 0) return;

    // creating a js obj and pass it as an argumnt to the store
    //zustand then updates the expenses state
    //since tripdash board is subscribes => it re-renders
    await addExpense({
      tripId: tripId,
      description,
      amount: parseFloat(amount),
      paidBy,
      splitAmong,
      date: new Date().toISOString().split("T")[0], //Date func returns both date and time together => use split to splt at time and select the 1st val that gives date
    });

    navigate(`/trip/${tripId}/expenses`); //redirect after adding
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
      {/* that func executes on submitting */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* for description */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Desciption</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="eg: Hotel, Dinner..."
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* for amount */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* for paidBy */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Paid by</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          >
            {trip.members.map((m) => (
              <option key={m._id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* split among  */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Split among
          </label>
          <div className="flex gap-2 flex-wrap">
            {/* for each mmeber we create a button */}
            {trip.members.map((m) => (
              <button
                type="button"
                key={m._id}
                onClick={() => toggleMember(m.name)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  splitAmong.includes(m.name)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
