import { useEffect, useState } from "react";
import axios from "axios";
import { type IUser } from "../@types/interface";
import { AuthContext } from "../hooks/useAuth";
import { BACKEND_DOMAIN } from "../configs/config";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/users/my-account`,
          {
            withCredentials: true, // IMPORTANT if using cookies
          },
        );

        setCurrentUser(res.data.data);
      } catch {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
