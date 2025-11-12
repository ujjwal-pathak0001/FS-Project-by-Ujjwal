import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";
import resourceRoutes from "./routes/resourceroutes.js";

const app = express();

// ✅ Permanent CORS fix: allow any localhost port
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow any localhost port (5173, 5174, 3000, etc.)
    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }

    // Block everything else
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api/user", userRoutes);
app.use("/api/admin", adminSettingsRoutes);
app.use("/api/tenants", resourceRoutes);

export default app;
