import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number },
    location: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 👈 Link to User
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
