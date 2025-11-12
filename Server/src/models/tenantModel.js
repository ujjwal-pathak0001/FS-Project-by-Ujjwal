import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    background: { type: String, default: "#ffffff" },
    surface: { type: String, default: "#f5f5f5" },
    primary: { type: String, default: "#3b82f6" },
    text: { type: String, default: "#1f2937" },
    muted: { type: String, default: "#6b7280" },
    accent: { type: String, default: "#10b981" }
  },
  { _id: false }
);

const themeSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: "" },
    colors: { type: colorSchema, default: () => ({}) }
  },
  { _id: false }
);

const featuresSchema = new mongoose.Schema(
  {
    posts: { type: Boolean, default: true },
    chat: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },
  { _id: false }
);

const tenantSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, default: "Workspace" },
    theme: { type: themeSchema, default: () => ({}) },
    features: { type: featuresSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model("Tenant", tenantSchema);
