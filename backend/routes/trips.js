import express from "express";
import crypto from "crypto";
import Trip from "../models/Trip.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/join/:token", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ inviteToken: req.params.token });
    if (!trip) return res.status(404).json({ error: "Invalid invite link" });

    const normalizedName = req.body.name.trim().toLowerCase();

    const alreadyMember = trip.members.some(
      (m) => m.userId?.toString() === req.userId || m.name === req.body.name,
    );

    if (alreadyMember) return res.json({ trip, alreadyMember: true });

    trip.members.push({ name: req.body.name, userId: req.userId });
    await trip.save();

    res.json({ trip, alreadyMember: false });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

// generate invite link
router.post("/:id/invite", authMiddleware, async (req, res) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { inviteToken: token },
      { new: true },
    );
    res.json({ inviteToken: trip.inviteToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//make a payment as settled
router.post("/:id/settle", authMiddleware, async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $push: { settlements: { from, to, amount } } }, //$push => mongodb command to update
      { new: true }, //tells mongoose to return the updated doc after adding each expense
    );
    res.json(trip); //send to frontend
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//clear all settlements
router.delete("/:id/settle", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: { settlements: [] } },
      { new: true },
    );
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
