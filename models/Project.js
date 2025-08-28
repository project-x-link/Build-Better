import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  budget: Number
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
