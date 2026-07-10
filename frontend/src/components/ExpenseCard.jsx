import useTripStore from "../store/useTripStore";

export default function ExpenseCard({ expense }) {
  const deleteExpense = useTripStore((state) => state.deleteExpense);
  const perPerson = (expense.amount / expense.splitAmong.length).toFixed(2);

  return (
    <div className="bg-white border rounded-xl p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{expense.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Paid by <span className="font-medium">{expense.paidBy}</span>
          </p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-lg font-bold text-gray-900">₹{expense.amount}</p>
          <p className="text-xs text-gray-400">₹{perPerson}/person</p>
          <button
            onClick={() => deleteExpense(expense._id)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
