import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Tenant from "../models/tenantModel.js";

dotenv.config();

const defaultTenantThemes = {
  t1: {
    name: "Acme HQ",
    theme: {
      primary: "#1f2937",
      accent: "#2563eb",
      background: "#f5f5f4",
      surface: "#ffffff",
      text: "#0f172a",
      muted: "#4b5563",
    },
  },
  t2: {
    name: "Northwind Ops",
    theme: {
      primary: "#14532d",
      accent: "#0ea5e9",
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#082f49",
      muted: "#64748b",
    },
  },
  t3: {
    name: "Globex Labs",
    theme: {
      primary: "#1e1b4b",
      accent: "#f59e0b",
      background: "#f9fafb",
      surface: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
    },
  },
  default: {
    name: "Community Tenant",
    theme: {
      primary: "#1f2937",
      accent: "#2563eb",
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#111827",
      muted: "#6b7280",
    },
  },
};

const generateToken = (user) =>
  jwt.sign({ id: user._id, tenantId: user.tenantId, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const ensureTenant = async (tenantId) => {
  const existing = await Tenant.findOne({ tenantId });
  if (existing) return existing;

  const fallback = defaultTenantThemes[tenantId] || defaultTenantThemes.default;
  return Tenant.create({
    tenantId,
    name: fallback.name,
    theme: fallback.theme,
  });
};

const sanitizeUser = (userDoc) => {
  const userObject = userDoc.toObject();
  delete userObject.password;
  return userObject;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, tenantId } = req.body;
    const requestRole = req.body?.role;
    const allowRoleOnRegister = String(process.env.ALLOW_ROLE_ON_REGISTER).toLowerCase() === "true";
    const allowedRoles = ["admin", "editor", "viewer"];

    if (!tenantId) {
      return res.status(400).json({ message: "tenantId is required" });
    }

    const tenant = await ensureTenant(tenantId);
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists for this tenant" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      tenantId: tenant.tenantId,
      role: allowRoleOnRegister && allowedRoles.includes(requestRole) ? requestRole : "viewer",
    });
    const token = generateToken(newUser);

    res.status(201).json({ user: sanitizeUser(newUser), tenant, token });
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
    const token = generateToken(user);
    res.status(200).json({ user: sanitizeUser(user), tenant, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
