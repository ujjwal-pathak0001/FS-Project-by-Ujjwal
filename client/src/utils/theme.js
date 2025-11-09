const defaultTheme = {
  primary: "#1f3d7a",
  accent: "#3b82f6",
  background: "#f5f7fb",
  surface: "#ffffff",
  text: "#1f2933",
  muted: "#64748b",
};

export const applyTheme = (themeInput) => {
  if (typeof document === "undefined") return;

  const theme = { ...defaultTheme, ...themeInput };
  const root = document.documentElement;

  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-accent", theme.accent);
  root.style.setProperty("--color-background", theme.background);
  root.style.setProperty("--color-surface", theme.surface);
  root.style.setProperty("--color-text", theme.text);
  root.style.setProperty("--color-muted", theme.muted);
};

export const getStoredTheme = () => {
  try {
    const raw = localStorage.getItem("tenantTheme");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Unable to parse stored theme", err);
    return null;
  }
};

export const persistTheme = (theme) => {
  if (!theme) return;
  localStorage.setItem("tenantTheme", JSON.stringify(theme));
  applyTheme(theme);
};

export const clearStoredTheme = () => {
  localStorage.removeItem("tenantTheme");
  applyTheme({});
};
