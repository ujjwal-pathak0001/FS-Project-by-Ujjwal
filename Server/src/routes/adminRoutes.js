import { Router } from "express";
import { tenantResolver } from "../middlewares/tenantResolver.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import Tenant from "../models/tenantModel.js";

const router = Router();

// Must be an ADMIN in this tenant
router.use(verifyToken, tenantResolver, authorizeRoles("ADMIN"));

router.get("/settings", async (req, res) => {
  const t = await Tenant.findOne({ tenantId: req.tenantId });
  res.json(t);
});

router.put("/settings", async (req, res) => {
  const updated = await Tenant.findOneAndUpdate(
    { tenantId: req.tenantId },
    req.body,
    { new: true }
  );
  res.json(updated);
});

export default router;
