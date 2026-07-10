//defines how the trip data will  be stored in mongodb
import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ name: { type: String, required: true } }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Trip", tripSchema);

//this creates a model called trip
//model help to interact wit mongodb(create, read, update, delete documents)
