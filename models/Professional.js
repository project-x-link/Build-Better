// models/Professional.js
import mongoose from "mongoose";

const ProfessionalSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "plumbers",
      "electricians",
      "contractors",
      "civilengineers",
      "skilledlabor",
      "unskilledlabor",
      "painters",
      "carpenters",
      "machinery",
      "workshops"
    ],
    required: true
  },
  experience: String,
  serviceArea: String,
  description: String,
  rate: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Professional", ProfessionalSchema);
