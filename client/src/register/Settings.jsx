import { useEffect, useState } from "react";
import axios from "axios";
import { adminRoutes } from "../utils/api.js";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const token = stored?.token || localStorage.getItem("token");
  const tenant = stored?.tenant || stored?.tenantId;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(adminRoutes.settings, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": tenant,
          },
        });
        setSettings(data);
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token && tenant) load();
    else setLoading(false);
  }, [tenant, token]);

  const saveSettings = async () => {
    await axios.put(adminRoutes.settings, settings, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-id": tenant,
      },
    });
    alert("Settings updated!");
  };

  if (loading) return <p>Loading...</p>;
  if (!settings) return <p>No settings available.</p>;

  const themeColors = settings?.theme?.colors || {};

  return (
    <div className="p-6 space-y-6 text-[color:var(--color-text)]">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-[color:var(--color-primary)]">
        Tenant Settings
      </h1>

      {/* WORKSPACE NAME */}
      <div className="rounded-xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] p-4 space-y-2">
        <label className="font-semibold">Workspace Name</label>
        <input
          className="border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-3 py-2 rounded-xl w-full"
          value={settings.name || ""}
          onChange={(e) =>
            setSettings((s) => ({ ...s, name: e.target.value }))
          }
        />
      </div>

      {/* THEME COLORS */}
      <div className="rounded-xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] p-4 space-y-3">
        <h2 className="font-semibold text-[color:var(--color-primary)]">
          Theme Colors
        </h2>

        {Object.keys(themeColors).length === 0 && (
          <p className="text-sm text-[color:var(--color-muted)]">
            No theme colors found.
          </p>
        )}

        {Object.keys(themeColors).map((key) => (
          <div key={key} className="flex gap-4 items-center">
            <span className="w-32 font-medium">{key}</span>
            <input
              type="text"
              className="border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-3 py-2 rounded-xl flex-1"
              value={themeColors[key]}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  theme: {
                    ...(s.theme || {}),
                    colors: {
                      ...(s.theme?.colors || {}),
                      [key]: e.target.value,
                    },
                  },
                }))
              }
            />
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div className="rounded-xl border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] p-4 space-y-3">
        <h2 className="font-semibold text-[color:var(--color-primary)]">
          Feature Toggles
        </h2>

        {Object.keys(settings.features || {}).map((key) => (
          <label key={key} className="flex gap-3 items-center">
            <input
              type="checkbox"
              checked={Boolean(settings.features[key])}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  features: {
                    ...(s.features || {}),
                    [key]: e.target.checked,
                  },
                }))
              }
            />
            <span className="text-[color:var(--color-text)]">{key}</span>
          </label>
        ))}
      </div>

      <button
        onClick={saveSettings}
        className="px-4 py-2 bg-[color:var(--color-accent)] text-white rounded-xl"
      >
        Save Settings
      </button>
    </div>
  );
}
