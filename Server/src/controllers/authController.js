import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Tenant from "../models/tenantModel.js";

dotenv.config();

const defaultThemes = {
  t1: { name: "Acme HQ", colors: { primary:"#1f2937", accent:"#2563eb", background:"#f5f5f4", surface:"#ffffff", text:"#0f172a", muted:"#4b5563" }},
  t2: { name: "Northwind Ops", colors: { primary:"#14532d", accent:"#0ea5e9", background:"#f8fafc", surface:"#ffffff", text:"#082f49", muted:"#64748b" }},
  t3: { name: "Globex Labs", colors: { primary:"#1e1b4b", accent:"#f59e0b", background:"#f9fafb", surface:"#ffffff", text:"#111827", muted:"#6b7280" }},
  default: { name: "Community", colors: {} }
};

const ensureTenant = async (tenantId) => {
  const found = await Tenant.findOne({ tenantId });
  if (found) return found;

  const seed = defaultThemes[tenantId] || defaultThemes.default;

  return Tenant.create({
    tenantId,
    slug: tenantId,
    name: seed.name,
    theme: { colors: seed.colors }
  });
};

const sanitizeUser = (u) => {
  const o = u.toObject();
  delete o.password;
  return o;
};

const createToken = (u) => jwt.sign(
  { id: u._id.toString(), tenantId: u.tenantId, role: u.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, tenantId } = req.body;
    let role = req.body.role || "USER";
    role = role.toUpperCase();

    const allowed = ["USER", "EDITOR", "ADMIN"];

    const tenant = await ensureTenant(tenantId);

    const exists = await User.findOne({ email, tenantId });
    if (exists) return res.status(400).json({ message: "User already exists" });

    if (!allowed.includes(role)) role = "USER";

    const user = await User.create({
      name, email, password, tenantId, role
    });

    const token = createToken(user);

    res.status(201).json({ user: sanitizeUser(user), tenant, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, tenantId } = req.body;

    const user = await User.findOne({ email, tenantId });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const tenant = await ensureTenant(tenantId);
    const token = createToken(user);

    res.json({ user: sanitizeUser(user), tenant, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
