import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useTripStore from "../store/useTripStore";
import { calculateBalances } from "../utils/calculateBalances";
import { simplifyDebts } from "../utils/simplifyDebts";

export default function SettleUp() {
  const { tripId } = useParams();
  const trip = useTripStore((state) => state.trip);
  const expenses = useTripStore((state) => state.expenses);
  const settleUp = useTripStore((state) => state.settleUp);
  const clearSettlements = useTripStore((state) => state.clearSettlements);

  const balances = useMemo(() => {
    if (!trip) return {};
    return calculateBalances(expenses, trip.members);
  }, [expenses, trip]);

  const transactions = useMemo(() => {
    return simplifyDebts(balances);
  }, [balances]);

  const settlements = trip?.settlements || [];

  // check if a transaction is already settled
  function isSettled(from, to) {
    return settlements.some((s) => s.from === from && s.to === to);
  }

  if (!trip) return <p className="mt-4 text-gray-500">Loading...</p>;

  return (
    <div className="mt-4 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900">Settle Up</h2>

      {/* current balances */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Current balances</h3>
        {trip.members.map((member) => {
          const amount = balances[member.name];
          const isPositive = amount >= 0;
          return (
            <div
              key={member._id}
              className="flex justify-between items-center py-2 border-b last:border-0"
            >
              <span className="text-gray-700">{member.name}</span>
              <span
                className={`font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}
              >
                {isPositive ? "+" : ""}₹{amount?.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* suggested transactions */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Suggested payments</h3>
          {settlements.length > 0 && (
            <button
              onClick={() => clearSettlements(tripId)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Reset all
            </button>
          )}
        </div>

        {transactions.length === 0 && (
          <p className="text-green-600 text-sm font-medium">
            🎉 All settled up!
          </p>
        )}

        {transactions.map((t, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-3 border-b last:border-0"
          >
            <div>
              <p className="text-gray-800 text-sm">
                <span className="font-medium">{t.from}</span>
                <span className="text-gray-400 mx-2">→</span>
                <span className="font-medium">{t.to}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">₹{t.amount}</p>
            </div>
            {isSettled(t.from, t.to) ? (
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                ✓ Settled
              </span>
            ) : (
              <button
                onClick={() =>
                  settleUp(tripId, { from: t.from, to: t.to, amount: t.amount })
                }
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
              >
                Mark settled
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
