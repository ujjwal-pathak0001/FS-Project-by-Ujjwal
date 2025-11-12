import Tenant from "../models/tenantModel.js";

const tenantResolver = async (req, res, next) => {
  try {
    const paramTenant = req.params?.tenantId;
    const headerTenant = req.header("x-tenant-id");
    const tokenTenant = req.user?.tenantId;

    const resolved = paramTenant || headerTenant || tokenTenant;

    if (!resolved) {
      return res.status(400).json({ message: "Tenant context required" });
    }

    if (tokenTenant && resolved !== tokenTenant) {
      return res.status(403).json({ message: "Tenant mismatch" });
    }

    const tenant = await Tenant.findOne({ tenantId: resolved });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    req.tenantId = tenant.tenantId;
    req.tenant = tenant;

    next();
  } catch (err) {
    res.status(500).json({ message: "Tenant resolution failed" });
  }
};

export default tenantResolver;
