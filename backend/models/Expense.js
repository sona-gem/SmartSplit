import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true },
  splitAmong: [{ type: String }], //array of member names
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", expenseSchema);
