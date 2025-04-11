import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
  
    try {
      const user = await getUser();
  
      if (user) {
        setUser(user);
      } else {
        console.warn("No se pudo obtener el usuario, pero hay token");
      }
    } catch (err) {
      console.error("Error getting user:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, email, setEmail, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
