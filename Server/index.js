
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import resourceRoutes from "./src/routes/resourceroutes.js";
import { connectDB } from "./src/config/db.js";
import { requestLogger } from "./src/middlewares/requestLogger.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

// Connect user and resource routes
app.use("/api/user", userRoutes);
app.use("/api/tenants/:tenantId/posts", resourceRoutes);
app.use("/api/posts", resourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
