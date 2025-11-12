import Tenant from "../models/tenantModel.js";

export const getTenantSettings = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.tenant._id);
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings" });
  }
};

export const updateTenantSettings = async (req, res) => {
  try {
    const updated = await Tenant.findByIdAndUpdate(
      req.tenant._id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};
