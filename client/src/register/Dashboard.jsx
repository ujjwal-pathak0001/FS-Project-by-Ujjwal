import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { postsRoute } from "../utils/api.js";

const emptyPostState = { title: "", description: "" };

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyPostState);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeUser, setActiveUser] = useState(null);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (parseError) {
      console.error("Failed to parse stored user:", parseError);
      localStorage.removeItem("user");
      return null;
    }
  }, []);

  const ensureAuth = () => {
    if (!token || !storedUser) {
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    if (!ensureAuth()) return;

    setActiveUser(storedUser);
    setIsFetching(true);

    try {
      const response = await axios.get(postsRoute(storedUser.tenantId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": storedUser.tenantId,
        },
      });

      if (response.data.success) {
        setPosts(response.data.data);
        setError("");
      } else {
        setError("No data received");
      }
    } catch (err) {
      console.error("Error details:", err.response || err.message);
      setError("We couldn't fetch your posts. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!ensureAuth()) return;
    setLoading(true);

    try {
      const response = await axios.post(postsRoute(storedUser.tenantId), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": storedUser.tenantId,
        },
      });

      if (response.data.success) {
        setFormData(emptyPostState);
        await fetchData();
      }
    } catch (err) {
      console.error("Error creating post:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!ensureAuth()) return;
    if (!window.confirm("Remove this update?")) return;

    try {
      await axios.delete(`${postsRoute(storedUser.tenantId)}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": storedUser.tenantId,
        },
      });

      await fetchData();
    } catch (err) {
      console.error("Error deleting post:", err.response || err.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/70 bg-[color:var(--color-surface)] p-6 shadow-sm shadow-slate-200/70 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
              Tenant dashboard
            </p>
            <h1 className="text-2xl font-semibold text-[color:var(--color-primary)] sm:text-3xl">
              {activeUser ? `Hello ${activeUser.name || "there"}!` : "Welcome back"}
            </h1>
            <p className="text-sm text-[color:var(--color-muted)] sm:text-base">
              Publish small updates for your tenant and keep everything scoped to{" "}
              <strong>{activeUser?.tenantId || "your workspace"}</strong>.
            </p>
          </div>
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-[color:var(--color-text)]">
            <div className="flex items-center justify-between gap-6">
              <span className="text-[color:var(--color-muted)]">Workspace</span>
              <span className="font-semibold text-[color:var(--color-primary)]">
                {activeUser?.tenantId || "unknown workspace"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-[color:var(--color-muted)]">Total posts</span>
              <span className="font-semibold">{posts.length}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,320px),1fr]">
        <form
          onSubmit={handleAddPost}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-[color:var(--color-surface)] p-6 shadow-sm shadow-slate-200/70"
        >
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--color-primary)]">
              Add a tenant update
            </h2>
            <p className="text-sm text-[color:var(--color-muted)]">
              Keep it short and focused on this tenant.
            </p>
          </div>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-[color:var(--color-text)]">Title</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Sprint retrospective notes"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-[color:var(--color-text)]">Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Share upcoming work or quick announcements..."
              rows={5}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[color:var(--color-accent)] py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : "Post update"}
          </button>
        </form>

        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-[color:var(--color-surface)] p-6 shadow-sm shadow-slate-200/70">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--color-primary)]">
              Recent posts
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Tenant feed
            </span>
          </div>

          {isFetching ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-full rounded bg-slate-200/80" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-slate-200/80" />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((item) => (
                <article
                  key={item._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <header className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[color:var(--color-primary)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-[color:var(--color-text)] whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </header>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-white px-3 py-6 text-center text-sm text-[color:var(--color-muted)]">
              No posts yet. Use the form to share the first update for this tenant.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
