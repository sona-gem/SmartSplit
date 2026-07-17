//defines how the trip data will  be stored in mongodb
import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    {
      name: { type: String, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // sparse: true => many trips can have no invite token , once assigned must be unique
  //basically an optional filed that must be unique when present
  //the trips will not be indexed till an invite link is generated
  //this is done to prevent multiple trips having null as the initial value for the inviteToken
  inviteToken: { type: String, unique: true, sparse: true },
  settlements: [
    {
      from: { type: String },
      to: { type: String },
      amount: { type: Number },
      settledAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Trip", tripSchema);

//this creates a model called trip
//model help to interact wit mongodb(create, read, update, delete documents)
