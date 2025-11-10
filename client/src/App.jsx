import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Register from "./register/Register";
import Login from "./register/Login";
import Dashboard from "./register/Dashboard";
import { applyTheme, clearStoredTheme, getStoredTheme, getThemeMode, toggleThemeMode, themes, setThemeMode } from "./utils/theme.js";

const NavigationBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState(getThemeMode());

  useEffect(() => {
    const evaluateAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };

    evaluateAuthState();
    window.addEventListener("storage", evaluateAuthState);
    return () => window.removeEventListener("storage", evaluateAuthState);
  }, []);

  useEffect(() => {
    // Initialize theme based on stored mode
    setThemeMode(mode);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearStoredTheme();
    window.location.href = "/login";
  };

  const handleToggleTheme = () => {
    const next = toggleThemeMode();
    setMode(next);
    // Persist a sample palette per mode for nicer demo contrast
    const palette = next === "dark" ? themes.dark : themes.light;
    localStorage.setItem("tenantTheme", JSON.stringify(palette));
  };

  return (
    <header className="border-b border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-surface)]/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="group inline-flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--color-accent)] text-white shadow-sm transition group-hover:brightness-105">
            MW
          </span>
          <span className="text-sm font-semibold text-[color:var(--color-primary)]">Multi-tenant Workspace</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-[color:var(--color-muted)]">
          <button
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] shadow-sm transition hover:border-[color:var(--color-muted)]/40 hover:bg-[color:var(--color-surface)]/90"
            title={mode === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {mode === "dark" ? "Light" : "Dark"}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full px-3 py-2 transition hover:bg-[color:var(--color-surface)]/80 hover:text-[color:var(--color-text)]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)] px-4 py-2 font-semibold text-[color:var(--color-text)] shadow-sm transition hover:border-[color:var(--color-muted)]/40 hover:bg-[color:var(--color-surface)]/90"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-3 py-2 transition hover:bg-[color:var(--color-surface)]/80 hover:text-[color:var(--color-text)]"
              >
                Login
              </Link>
              <Link
                to="/"
                className="rounded-full  text-white bg-[--color-accent] px-4 py-2 font-semibold shadow-sm transition hover:brightness-105"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

function App() {
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      applyTheme(stored);
    } else {
      applyTheme({});
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[color:var(--color-background)] text-[color:var(--color-text)]">
        <NavigationBar />
        <main className="flex flex-1 justify-center px-4 py-10">
          <div className="w-full max-w-5xl">
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
        <footer className="border-t border-[color:var(--color-muted)]/30 bg-[color:var(--color-surface)]">
          <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-[color:var(--color-muted)]">
            Built for the Nimbus challenge - Multi-tenant demo workspace
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
