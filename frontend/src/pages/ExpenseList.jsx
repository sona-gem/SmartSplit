import ExpenseCard from "../components/ExpenseCard";
import useTripStore from "../store/useTripStore";
import { useParams } from "react-router-dom";

export default function ExpenseList() {
  const { tripId } = useParams();
  const expenses = useTripStore((state) => state.expenses);
  const trip = useTripStore((state) => state.trip);
  //idea : to display all expenses using ExpenseCard for each expense
  //props passed are key(to identify each expnseCard uniquely), exoense, members
  //null check
  if (!trip) return <p className="mt-4 text-gray-500">Loading...</p>;
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">All expenses</h2>
      {expenses.length === 0 && (
        <p className="text-gray-400 text-sm">No expenses yet. Add one!</p>
      )}
      {expenses.map((exp) => (
        <ExpenseCard key={exp._id} expense={exp} />
      ))}
    </div>
  );
}
