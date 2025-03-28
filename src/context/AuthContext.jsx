import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUser } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("firebaseToken", token);
          const userData = await getUser(token);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("firebaseToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("firebaseToken");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
