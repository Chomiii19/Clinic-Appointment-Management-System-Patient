import { useEffect, useState } from "react";
import axios from "axios";
import { type IUser } from "../@types/interface";
import { AuthContext } from "../hooks/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/api/v1/users/my-account", {
          withCredentials: true, // IMPORTANT if using cookies
        });

        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
