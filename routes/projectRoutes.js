import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a project (only logged-in users)
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
      userId: req.user.id, // from JWT
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("userId", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get projects by the logged-in user
router.get("/my-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
