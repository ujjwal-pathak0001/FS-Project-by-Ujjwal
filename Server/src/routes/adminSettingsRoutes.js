import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import {
  getTenantSettings,
  updateTenantSettings
} from "../controllers/adminSettingsController.js";

const router = express.Router();

router.get("/settings", verifyToken, authorizeRoles("ADMIN"), getTenantSettings);
router.put("/settings", verifyToken, authorizeRoles("ADMIN"), updateTenantSettings);

export default router;
