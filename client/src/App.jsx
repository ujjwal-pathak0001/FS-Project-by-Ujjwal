import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Register from "./register/Register";
import Login from "./register/Login";
import Dashboard from "./register/Dashboard";
import { applyTheme, clearStoredTheme, getStoredTheme } from "./utils/theme.js";

const NavigationBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const evaluateAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };

    evaluateAuthState();
    window.addEventListener("storage", evaluateAuthState);
    return () => window.removeEventListener("storage", evaluateAuthState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearStoredTheme();
    window.location.href = "/login";
  };

  return (
    <header className="border-b border-slate-200/70 bg-[color:var(--color-surface)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span />
        <nav className="flex items-center gap-3 text-sm font-medium text-[color:var(--color-muted)]">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-[color:var(--color-text)]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-[color:var(--color-text)] shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-[color:var(--color-text)]"
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
        <footer className="border-t border-slate-200/70 bg-[color:var(--color-surface)]">
          <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-[color:var(--color-muted)]">
            Built for the Nimbus challenge - Multi-tenant demo workspace
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
