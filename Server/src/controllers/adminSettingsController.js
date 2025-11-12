import Tenant from "../models/tenantModel.js";

export const getTenantSettings = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];

    const tenant = await Tenant.findOne({ tenantId });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTenantSettings = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];

    const updated = await Tenant.findOneAndUpdate(
      { tenantId },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
