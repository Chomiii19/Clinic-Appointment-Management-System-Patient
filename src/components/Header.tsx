import axios from "axios";
import { CircleUser, LogOut, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { BACKEND_DOMAIN } from "../configs/config";
import { Link, useNavigate } from "react-router-dom";

function Header({ headline }: { headline: string }) {
  const [user, setUser] = useState<{
    _id: string;
    firstname: string;
    surname: string;
  } | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BACKEND_DOMAIN}/api/v1/users/my-account`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data.data))
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="flex items-center justify-between w-full">
      <h1 className="text-2xl lg:text-3xl font-bold">{headline}</h1>
      <div className="flex items-center lg:gap-5">
        {headline === "Dashboard" && (
          <span className="flex items-center gap-2 px-3 py-2 bg-system-white dark:bg-system-black text-sm rounded-full">
            <Search className="text-zinc-400 w-5" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none w-14 lg:w-52"
            />
          </span>
        )}

        <div className="relative">
          <div
            onClick={() => setOpenDropdown((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer hover:bg-system-white dark:hover:bg-system-black transition-all duration-150 ease-in-out px-2 py-1 rounded-lg hover:shadow-md"
          >
            <img
              src="/assets/images/profile.png"
              alt="profile"
              className="w-9 rounded-full border-3 border-system-white"
            />
            <p className="font-bold lg:flex hidden whitespace-nowrap">
              {user?.firstname} {user?.surname}
            </p>
          </div>

          {openDropdown && (
            <div className="bg-system-white p-2 rounded-lg dark:bg-system-black flex flex-col gap-3 absolute shadow-md w-44 lg:w-full -bottom-20 right-0 text-zinc-600 dark:text-zinc-400 z-40">
              <Link
                to={`/users/${user?._id}`}
                className="cursor-pointer flex items-center gap-2 transition-colors duration-150 ease-in hover:text-zinc-950 hover:dark:text-zinc-100"
              >
                <CircleUser className="w-5" /> My Account
              </Link>
              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 transition-colors duration-150 ease-in hover:text-zinc-950 hover:dark:text-zinc-100"
              >
                <LogOut className="w-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
