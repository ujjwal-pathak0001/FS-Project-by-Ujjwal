import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { postsRoute, authRoutes } from "../utils/api.js";

const emptyPost = { title: "", description: "" };

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyPost);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeUser, setActiveUser] = useState(null);

  const token = localStorage.getItem("token");

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const tenantId = storedUser?.tenantId || storedUser?.tenant || null;
  const userRole = activeUser?.role || storedUser?.role || "USER";

  const canCreate = userRole === "EDITOR" || userRole === "ADMIN";
  const canDelete = userRole === "ADMIN";
  const isAdmin = userRole === "ADMIN";

  const ensureAuth = () => {
    if (!token || !storedUser || !tenantId) {
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  const fetchPosts = async () => {
    if (!ensureAuth()) return;

    setActiveUser(storedUser);
    setIsFetching(true);

    try {
      const res = await axios.get(postsRoute(tenantId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data?.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err.response || err.message);
      setError("Could not fetch posts.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!ensureAuth()) return;

    setLoading(true);
    try {
      await axios.post(postsRoute(tenantId), formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData(emptyPost);
      fetchPosts();
    } catch (err) {
      console.error("Create error:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!ensureAuth()) return;
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${postsRoute(tenantId)}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPosts();
    } catch (err) {
      console.error("Delete error:", err.response || err.message);
    }
  };

  const [roleForm, setRoleForm] = useState({ email: "", role: "USER" });
  const [roleMsg, setRoleMsg] = useState(null);

  const updateRole = async (e) => {
    e.preventDefault();
    if (!isAdmin || !ensureAuth()) return;

    try {
      const res = await axios.put(authRoutes.setRole, roleForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRoleMsg({
        type: "success",
        text: `Updated ${res.data.user.email} to ${res.data.user.role}`,
      });
    } catch (err) {
      setRoleMsg({
        type: "error",
        text: err.response?.data?.message || "Role update failed",
      });
    }
  };

  return (
    <div className="space-y-6 text-[color:var(--color-text)]">

      {/* HEADER */}
      <section className="rounded-2xl border border-[color:var(--color-muted)]/30 p-6 shadow-sm bg-[color:var(--color-surface)]">
        <h1 className="text-2xl font-semibold text-[color:var(--color-primary)]">
          Hello {activeUser?.email || storedUser?.email || "User"}!
        </h1>

        <p className="text-[color:var(--color-muted)]">
          Tenant: <strong className="text-[color:var(--color-text)]">{tenantId || "-"}</strong>
        </p>

        <p className="text-[color:var(--color-muted)]">
          Role: <strong className="text-[color:var(--color-text)]">{userRole}</strong>
        </p>
      </section>

      {/* CREATE POST */}
      <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-muted)]/30 p-6 shadow-sm bg-[color:var(--color-surface)]"
        >
          <h2 className="text-lg font-semibold text-[color:var(--color-primary)]">Create Post</h2>

          {!canCreate && (
            <p className="bg-yellow-200/20 text-yellow-600 text-sm p-2 rounded">
              You need EDITOR or ADMIN role to create posts.
            </p>
          )}

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            disabled={!canCreate}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] rounded-xl px-3 py-2"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="5"
            disabled={!canCreate}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] rounded-xl px-3 py-2"
            required
          />

          <button
            type="submit"
            disabled={!canCreate || loading}
            className="bg-[color:var(--color-accent)] text-white py-2 rounded-xl"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>

        {/* POSTS LIST */}
        <div className="space-y-4 rounded-2xl border border-[color:var(--color-muted)]/30 p-6 shadow-sm bg-[color:var(--color-surface)]">
          <h2 className="text-lg font-semibold text-[color:var(--color-primary)]">Posts</h2>

          {isFetching ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : posts.length === 0 ? (
            <p className="text-[color:var(--color-muted)]">No posts available.</p>
          ) : (
            posts.map((post) => (
              <article
                key={post._id}
                className="border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] rounded-xl p-4"
              >
                <h3 className="font-semibold text-[color:var(--color-text)]">
                  {post.title}
                </h3>

                <p className="mt-2 text-[color:var(--color-muted)]">
                  {post.description}
                </p>

                {canDelete && (
                  <button
                    className="mt-3 text-red-400 border border-red-300 px-3 py-1 rounded"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      {/* ADMIN ROLE PANEL */}
      {isAdmin && (
        <section className="rounded-2xl border border-[color:var(--color-muted)]/30 p-6 shadow-sm bg-[color:var(--color-surface)]">
          <h2 className="text-lg font-semibold text-[color:var(--color-primary)] mb-3">
            Admin: Set User Role
          </h2>

          {roleMsg && (
            <p
              className={`p-2 rounded mb-3 ${
                roleMsg.type === "success"
                  ? "bg-green-200/20 text-green-500"
                  : "bg-red-200/20 text-red-500"
              }`}
            >
              {roleMsg.text}
            </p>
          )}

          <form
            onSubmit={updateRole}
            className="grid sm:grid-cols-[1fr,160px,auto] gap-3"
          >
            <input
              type="email"
              placeholder="user@company.com"
              required
              value={roleForm.email}
              onChange={(e) =>
                setRoleForm({ ...roleForm, email: e.target.value })
              }
              className="border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] rounded-xl px-3 py-2"
            />

            <select
              value={roleForm.role}
              onChange={(e) =>
                setRoleForm({ ...roleForm, role: e.target.value })
              }
              className="border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] rounded-xl px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button className="bg-[color:var(--color-accent)] text-white px-4 py-2 rounded-xl">
              Update
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
