import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// Add a service
router.post("/", async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all services (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { location, category } = req.query;
    let filter = {};
    if (location) filter.location = location;
    if (category) filter.category = category;

    const services = await Service.find(filter).populate("userId");
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
