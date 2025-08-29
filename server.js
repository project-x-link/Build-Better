import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import User from "./models/User.js";
import Project from "./models/Project.js";
import Service from "./models/Service.js";
import professionalRoutes from "./routes/professionals.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Secure CORS
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",           // Local testing
    "http://localhost:3000",           // Local React/Vite
    "https://project-x-link.github.io" // GitHub Pages frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
   allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ MongoDB Connection (use env variable!)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));



// ✅ Routes
app.use("/api/auth", authRoutes); 
app.use("/api/professionals", professionalRoutes);
app.use("/api/projects", projectRoutes);

// -------------------- USER ROUTES --------------------
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------- PROJECT ROUTES --------------------
app.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(404).json({ error: "Project not found" });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------- SERVICE ROUTES --------------------
app.post("/services", async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/services/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(404).json({ error: "Service not found" });
  }
});

app.put("/services/:id", async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/services/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend is running on Render 🚀");
});

// ✅ Start Server (only once!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
