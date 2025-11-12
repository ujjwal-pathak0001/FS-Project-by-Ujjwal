import { useState } from "react";
import axios from "axios";
import { persistTheme } from "../utils/theme.js";
import { authRoutes } from "../utils/api.js";

// ✅ Hardcode this to ALWAYS allow role selection
const allowRoleOnRegister = true;

const tenantOptions = [
  { id: "t1", label: "Tenant 1" },
  { id: "t2", label: "Tenant 2" },
  { id: "t3", label: "Tenant 3" },
];

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tenantId: tenantOptions[0].id,
    role: "USER",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: "" });

    try {
      const payload = allowRoleOnRegister
        ? formData
        : { ...formData, role: undefined };

      const { data } = await axios.post(authRoutes.register, payload);

      if (data?.tenant?.theme) {
        persistTheme(data.tenant.theme);
      }

      setMessage({
        type: "success",
        text: `Workspace ready for ${data?.tenant?.name || formData.tenantId}. You can log in now.`,
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        tenantId: tenantOptions[0].id,
        role: "USER",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* ✅ ALWAYS SHOW HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-6 py-10 shadow-sm sm:px-10">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[color:var(--color-accent)]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[color:var(--color-primary)]/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Multi-tenant
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-[color:var(--color-primary)] sm:text-4xl">
            Ship faster with tenant-aware auth, theming, and data scoping.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-muted)] sm:text-base">
            Create a workspace and invite others later. Each login applies its own color theme.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/"
              className="button-link rounded-xl bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 ui-glow"
            >
              Create workspace
            </a>

            <a
              href="/login"
              className="button-link rounded-xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-muted)]/40 hover:bg-[color:var(--color-surface)]/90"
            >
              I already have an account
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="grid gap-10 rounded-3xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] p-8 shadow-sm shadow-slate-200/80 lg:grid-cols-[1.1fr,1fr] lg:p-12 ui-surface ui-border">

        <section className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Multi-tenant basics
          </span>
          <h1 className="text-3xl font-semibold text-[color:var(--color-primary)] sm:text-4xl">
            Create a shared app with calm, tenant-first defaults.
          </h1>
          <p className="text-sm text-[color:var(--color-muted)] sm:text-base">
            Each tenant receives isolated data, themed colors, and scoped access.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-2xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] p-6 shadow-inner ui-surface ui-border"
        >
          <div>
            <h2 className="text-xl font-semibold text-[color:var(--color-primary)]">
              Register
            </h2>
            <p className="text-sm text-[color:var(--color-muted)]">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-[color:var(--color-accent)]">
                Log in
              </a>
            </p>
          </div>

          {message.text && (
            <p
              className={`rounded-xl border px-3 py-2 text-sm ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <label className="space-y-1 text-sm">
            <span className="font-medium">Full name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              autoComplete="name"
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium">Tenant workspace</span>
            <select
              name="tenantId"
              value={formData.tenantId}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
            >
              {tenantOptions.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.label}
                </option>
              ))}
            </select>
          </label>

          {/* ✅ ALWAYS SHOW ROLE DROPDOWN NOW */}
          <label className="space-y-1 text-sm">
            <span className="font-medium">Role (development)</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-[color:var(--color-accent)] py-3 text-sm font-semibold text-white"
          >
            {loading ? "Creating workspace..." : "Create workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
