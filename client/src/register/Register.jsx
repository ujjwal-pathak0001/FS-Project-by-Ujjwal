import { useState } from "react";
import axios from "axios";
import { persistTheme } from "../utils/theme.js";
import { authRoutes } from "../utils/api.js";

const tenantOptions = [
  { id: "t1",  },
  { id: "t2", },
  { id: "t3", },
];

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tenantId: tenantOptions[0].id,
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
      const { data } = await axios.post(authRoutes.register, formData);
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
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 rounded-3xl border border-slate-200/70 bg-[color:var(--color-surface)] p-8 shadow-sm shadow-slate-200/80 lg:grid-cols-[1.1fr,1fr] lg:p-12">
      <section className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
          Multi-tenant basics
        </span>
        <h1 className="text-3xl font-semibold text-[color:var(--color-primary)] sm:text-4xl">
          Create a shared app with calm, tenant-first defaults.
        </h1>
        <p className="text-sm text-[color:var(--color-muted)] sm:text-base">
          Each tenant receives isolated data, themed colors, and scoped access. Pick one of the
          starter tenants or create a new identifier during development.
        </p>
        <dl className="grid gap-4 text-sm text-[color:var(--color-text)] sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Isolation
            </dt>
            <dd className="mt-1 font-medium">Tenant locked queries & JWT guard</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Theming
            </dt>
            <dd className="mt-1 font-medium">CSS variables switch per login</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Tooling
            </dt>
            <dd className="mt-1 font-medium">Express, MongoDB, and Vite</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Scope
            </dt>
            <dd className="mt-1 font-medium">Posts per tenant for quick demos</dd>
          </div>
        </dl>
      </section>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-inner"
      >
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--color-primary)]">Register</h2>
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
          <span className="font-medium text-[color:var(--color-text)]">Full name</span>
          <input
            type="text"
            name="name"
            placeholder="Taylor Jenkins"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base text-[color:var(--color-text)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-[color:var(--color-text)]">Email</span>
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base text-[color:var(--color-text)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-[color:var(--color-text)]">Password</span>
          <input
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base text-[color:var(--color-text)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
            required
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-[color:var(--color-text)]">Tenant workspace</span>
          <select
            name="tenantId"
            value={formData.tenantId}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-[color:var(--color-text)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
          >
            {tenantOptions.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.label} ({tenant.id})
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-[color:var(--color-accent)] py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating workspace..." : "Create workspace"}
        </button>
      </form>
    </div>
  );
}

export default Register;
