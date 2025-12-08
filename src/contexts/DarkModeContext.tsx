import { useEffect, useState } from "react";
import { DarkModeContext } from "../hooks/useDarkMode";

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");

    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
