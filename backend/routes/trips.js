import express from "express";
import Trip from "../models/Trip.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// create a trip — protected
router.post("/", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, createdBy: req.userId });
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get all trips for logged in user — protected
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ createdBy: req.userId });
    res.json(trips);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get a trip by id — protected
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;