const defaultTheme = {
  primary: "#1f3d7a",
  accent: "#3b82f6",
  background: "#f5f7fb",
  surface: "#ffffff",
  text: "#1f2933",
  muted: "#64748b",
};

const darkTheme = {
  primary: "#93c5fd",
  accent: "#60a5fa",
  background: "#0b1220",
  surface: "#0f172a",
  text: "#e5e7eb",
  muted: "#94a3b8",
};

export const themes = {
  light: defaultTheme,
  dark: darkTheme,
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

const THEME_MODE_KEY = "themeMode";

export const getThemeMode = () => {
  const stored = localStorage.getItem(THEME_MODE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const setThemeMode = (mode) => {
  const nextMode = mode === "dark" ? "dark" : "light";
  localStorage.setItem(THEME_MODE_KEY, nextMode);
  applyTheme(nextMode === "dark" ? darkTheme : defaultTheme);
};

export const toggleThemeMode = () => {
  const current = getThemeMode();
  const next = current === "dark" ? "light" : "dark";
  setThemeMode(next);
  return next;
};
