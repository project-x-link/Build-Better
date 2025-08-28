import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: String,
  category: String,
  cost: Number
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
