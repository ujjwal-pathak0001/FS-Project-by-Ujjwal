import { useState } from "react";
import axios from "axios";
import { persistTheme, applyTheme } from "../utils/theme.js";
import { authRoutes } from "../utils/api.js";

const tenantOptions = [{ id: "t1" }, { id: "t2" }, { id: "t3" }];

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    tenantId: tenantOptions[0].id,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(authRoutes.login, formData);

      // ✅ Save user for Dashboard & Settings
      const userPayload = {
        token: data.token,
        role: data.user.role,         // USER | EDITOR | ADMIN
        tenantId: data.user.tenantId,
        tenant: data.user.tenantId,   // alias for components using "tenant"
        email: data.user.email,
        name: data.user.name || "",
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      localStorage.setItem("token", data.token);

      // ✅ Apply tenant theme IMMEDIATELY after login
      if (data.tenant?.theme) {
        persistTheme(data.tenant.theme);
        applyTheme(data.tenant.theme);    // <-- THE MOST IMPORTANT FIX
      }

      // ✅ Go to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 rounded-3xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] p-8 shadow-sm lg:grid-cols-[1.05fr,1fr] lg:p-12 ui-surface ui-border">

      {/* LEFT SECTION */}
      <section className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
          Welcome back
        </span>

        <h1 className="text-3xl font-semibold text-[color:var(--color-primary)] sm:text-4xl">
          Hop into your workspace and pick up where you left off.
        </h1>

        <p className="text-sm text-[color:var(--color-muted)] sm:text-base">
          Tenant-aware JWTs ensure you only ever see your own data.
        </p>
      </section>

      {/* LOGIN FORM */}
      <form
        className="flex w-full flex-col gap-4 rounded-2xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] p-6 shadow-inner ui-surface ui-border"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--color-primary)]">
            Log in
          </h2>

          <p className="text-sm text-[color:var(--color-muted)]">
            Need an account?{" "}
            <a
              href="/"
              className="font-medium text-[color:var(--color-accent)]"
            >
              Create one
            </a>
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <label className="space-y-1 text-sm">
          <span className="font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full rounded-xl border px-3 py-2"
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
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
                {tenant.id}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-[color:var(--color-accent)] py-3 text-sm font-semibold text-white"
        >
          {loading ? "Signing you in..." : "Access dashboard"}
        </button>
      </form>
    </div>
  );
}

export default Login;
