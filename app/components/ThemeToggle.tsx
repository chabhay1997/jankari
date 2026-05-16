"use client";

import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  document.body.classList.toggle("theme-dark", theme === "dark");
  document.body.classList.toggle("theme-light", theme === "light");
  try {
    window.localStorage.setItem("bj_theme", theme);
  } catch {
    // Ignore storage failures.
  }
  window.dispatchEvent(new CustomEvent("bj:theme-updated", { detail: { theme } }));
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const syncTheme = () => {
      const storedTheme = document.documentElement.getAttribute("data-theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      }
    };

    syncTheme();
    window.addEventListener("bj:theme-updated", syncTheme);
    return () => window.removeEventListener("bj:theme-updated", syncTheme);
  }, []);

  const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
    >
      {theme === "dark" ? <HiSun size={15} /> : <HiMoon size={15} />}
    </button>
  );
}
