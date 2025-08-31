import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------- CREATE PROJECT --------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, budget, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newProject = new Project({
      title,
      description,
      budget,
      location,
      userId: req.user.id, // ✅ from JWT
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GET ALL PROJECTS --------------------
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("userId", "username email"); // ✅ show creator details
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GET LOGGED-IN USER PROJECTS --------------------
router.get("/my-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- UPDATE PROJECT --------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // ✅ only allow owner to update
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Project not found or unauthorized" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------- DELETE PROJECT --------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Project not found or unauthorized" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
