import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeButton from "./DarkModeButton";

export default function Navbar() {
  const [activeTheme, setActiveTheme] = useState<string>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      setActiveTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = systemPrefersDark ? "dark" : "light";
      setActiveTheme(systemTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const setThemeHandler = () => {
      const storedTheme = localStorage.getItem("theme");
      if (!storedTheme) {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", setThemeHandler);

    return () => {
      mediaQuery.removeEventListener("change", setThemeHandler);
    };
  }, []);

  const setTheme = (theme: string) => {
    if (theme !== "dark") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const applyTheme = () => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (systemPrefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    let defaultTheme = "light";

    if (activeTheme !== "light") {
      defaultTheme = "light";
    } else {
      defaultTheme = "dark";
    }

    localStorage.setItem("theme", defaultTheme);
    setTheme(defaultTheme);
    setActiveTheme(defaultTheme);
  };

  return (
    <nav className="navbar dark:bg-soft-black fixed start-0 top-0 z-20 w-full border-b border-gray-900 bg-black transition-all duration-300 ease-in-out dark:border-gray-800">
      <div className="container mx-auto">
        <div className="flex h-full flex-row items-center justify-between px-3 py-2">
          <div className="flex flex-row space-x-4 items-center justify-normal">
            <DarkModeButton theme={activeTheme} handler={toggleTheme} />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
