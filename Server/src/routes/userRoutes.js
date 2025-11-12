import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put(
  "/role",
  verifyToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { email, role } = req.body;

      const allowed = ["USER", "EDITOR", "ADMIN"];
      const newRole = role.toUpperCase();

      if (!allowed.includes(newRole)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findOneAndUpdate(
        { email, tenantId: req.user.tenantId },
        { role: newRole },
        { new: true }
      ).select("-password");

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
