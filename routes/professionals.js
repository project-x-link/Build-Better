// routes/professionals.js
import express from "express";
import Professional from "../models/Professional.js";

const router = express.Router();

// ✅ GET all professionals by category
router.get("/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const pros = await Professional.find({ category }).sort({ createdAt: -1 });
    res.json(pros);
  } catch (err) {
    console.error("Error fetching professionals:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST create a new professional
router.post("/", async (req, res) => {
  try {
    const pro = await Professional.create(req.body);
    res.status(201).json(pro);
  } catch (err) {
    console.error("Error creating professional:", err.message);
    res.status(400).json({ error: err.message });
  }
});

export default router;   // 👈 important for ESM
