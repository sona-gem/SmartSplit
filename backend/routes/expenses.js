import express from "express";
import Expense from "../models/Expense.js"; //rep expense collection in mongodb
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

//add an expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all expenses for a trip
router.get("/trip/:tripId", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId });
    res.json(expenses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//delete an expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Eexpense deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
