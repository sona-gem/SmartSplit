//this componet displays teh final balance of each member after all expenses are calculated

import { calculateBalances } from "../utils/calculateBalances";
export default function BalanceSummary({ expenses, members }) {
  // calls the utility func, returns an obj that contains each members bal
  const balances = calculateBalances(expenses, members);

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Who owes what</h3>
      {members.map((member) => {
        const amount = balances[member.name];
        const isPositive = amount >= 0; //checks if balance is +ve, later used to decide the color
        return (
          // key is used to identify each list item
          <div
            key={member._id}
            className="flex justify-between items-center py-2 border-0"
          >
            <span className="text-gray-700">{member.name}</span>
            <span
              className={`font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}
            >
              {isPositive ? "+" : " "}₹{amount.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
