import express from "express";
import cors from "cors"; //allows react frontend to make request to backend(as they run on 2 ports)
import dotenv from "dotenv"; //helps to load env vars from .env
import mongoose from "mongoose"; //using this we won't have to write raw queries
import tripRoutes from "./routes/trips.js";
import expenseRoutes from "./routes/expenses.js";
import authRoutes from "./routes/auth.js";

dotenv.config(); //enables node to read from .env and store in process.env

const app = express(); //creates an express app
const PORT = process.env.PORT || 5000;

app.use(cors()); //cors adds special headers to cross-origin requests
app.use(express.json()); // lets us read JSON from request body

//connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected!"))
  .catch((err) => console.error("mongodb connection failed", err));

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SplitTrip API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
