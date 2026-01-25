import {
  ChevronDown,
  ClipboardClock,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";

function Sidebar({
  page,
  openSidebar,
  setOpenSidebar,
}: {
  page: string;
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { darkMode, setDarkMode } = useDarkMode();
  const [settingsDropdown, setSettingsDropdown] = useState(
    localStorage.getItem("settingsDropdown") === "true",
  );

  useEffect(() => {
    localStorage.setItem("settingsDropdown", String(settingsDropdown));
  }, [settingsDropdown]);

  return (
    <aside
      className={`h-screen w-54 flex flex-col justify-between fixed p-2 lg:p-5 lg:pr-0 bg-off-white dark:bg-off-black transform transition-transform duration-150 ease-linear z-50 lg:translate-x-0 border-r border-zinc-300 dark:border-zinc-700 lg:border-none ${
        openSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <img src="/assets/icons/logo.png" alt="logo" className="w-12" />
            <h2 className="font-bold text-lg">OMDL</h2>
          </div>
          <PanelLeftClose
            onClick={() => setOpenSidebar(false)}
            className="text-zinc-500 cursor-pointer w-5 visible lg:hidden"
          />
        </header>

        <nav>
          <ul className="text-zinc-500 flex flex-col gap-3.5 font-bold text-sm">
            <Link
              to="/dashboard"
              className={`w-full flex items-center gap-4 cursor-pointer rounded-lg p-2 hover:text-zinc-950 dark:hover:text-zinc-50 ${
                page === "dashboard"
                  ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                  : ""
              }`}
            >
              <LayoutDashboard />
              <p>Dashboard</p>
            </Link>
            <Link
              to="/appointments"
              className={`w-full flex items-center gap-4 cursor-pointer rounded-lg p-2 hover:text-zinc-950 dark:hover:text-zinc-50 ${
                page === "appointments"
                  ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                  : ""
              }`}
            >
              <ClipboardClock />
              <p>Appointments</p>
            </Link>
            <Link
              to="/patients"
              className={`w-full flex items-center justify-between cursor-pointer rounded-lg p-2 hover:text-zinc-950 dark:hover:text-zinc-50 ${
                page === "patients"
                  ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <User />
                <p>Patients</p>
              </div>
            </Link>
            <li className="w-full flex flex-col gap-2 cursor-pointer transition-all duration-150 ease-in-out rounded-lg p-2">
              <div
                onClick={() => setSettingsDropdown((prev) => !prev)}
                className="w-full flex items-center justify-between hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                <span className="flex items-center gap-4">
                  <Settings />
                  <p>Settings</p>
                </span>
                <ChevronDown
                  className={`w-5 transition-all duration-150 ease-linear ${
                    settingsDropdown ? "-rotate-180" : ""
                  }`}
                />
              </div>

              {settingsDropdown && (
                <nav className="ml-3">
                  <ul className="border-l border-zinc-400 flex flex-col gap-3.5 pl-2">
                    <Link
                      to="/admins"
                      className={`hover:text-zinc-950 dark:hover:text-zinc-50 p-2 rounded-lg ${
                        page === "manageAdmins"
                          ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                          : ""
                      }`}
                    >
                      Manage Admins
                    </Link>
                    <Link
                      to="/doctors"
                      className={`hover:text-zinc-950 dark:hover:text-zinc-50 p-2 rounded-lg ${
                        page === "manageDoctors"
                          ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                          : ""
                      }`}
                    >
                      Manage Doctors
                    </Link>
                    <Link
                      to="/schedules"
                      className={`hover:text-zinc-950 dark:hover:text-zinc-50 p-2 rounded-lg ${
                        page === "manageSchedules"
                          ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                          : ""
                      }`}
                    >
                      Manage Schedules
                    </Link>
                    <Link
                      to="/services"
                      className={`hover:text-zinc-950 dark:hover:text-zinc-50 p-2 rounded-lg ${
                        page === "manageServices"
                          ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                          : ""
                      }`}
                    >
                      Manage Services
                    </Link>
                    <Link
                      to="/policies-and-terms"
                      className={`hover:text-zinc-950 dark:hover:text-zinc-50 p-2 rounded-lg ${
                        page === "policyTerms"
                          ? "text-zinc-950 dark:text-zinc-50 bg-system-white dark:bg-system-black shadow-md"
                          : ""
                      }`}
                    >
                      Policies and Terms
                    </Link>
                  </ul>
                </nav>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <footer className="bg-system-white dark:bg-system-black w-fit p-2 flex flex-col gap-3 rounded-full text-zinc-500 shadow-md">
        <div
          onClick={() => setDarkMode(false)}
          className={`p-1 ${
            !darkMode &&
            "text-zinc-950 dark:text-zinc-50 bg-off-white dark:bg-off-black"
          } rounded-full`}
        >
          <Sun className="cursor-pointer transition-colors duration-150 ease-in-out hover:text-zinc-950 dark:hover:text-zinc-50" />
        </div>
        <div
          onClick={() => setDarkMode(true)}
          className={`p-1 ${
            darkMode &&
            "text-zinc-950 dark:text-zinc-50 bg-off-white dark:bg-off-black"
          } rounded-full`}
        >
          <Moon className="cursor-pointer transition-colors duration-150 ease-in-out hover:text-zinc-950 dark:hover:text-zinc-50" />
        </div>
      </footer>
    </aside>
  );
}

export default Sidebar;
