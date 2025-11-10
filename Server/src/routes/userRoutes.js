import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import User from "../models/userModel.js";
import Tenant from "../models/tenantModel.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/tenant/profile", verifyToken, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ tenantId: req.user.tenantId });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json({ tenant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: update a user's role within the same tenant
router.put("/role", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { email, role } = req.body;
    const allowed = ["admin", "editor", "viewer"];
    if (!email || !role) {
      return res.status(400).json({ message: "email and role are required" });
    }
    if (!allowed.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const updated = await User.findOneAndUpdate(
      { email, tenantId: req.user.tenantId },
      { role },
      { new: true }
    ).select("-password");
    if (!updated) {
      return res.status(404).json({ message: "User not found in your tenant" });
    }
    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
