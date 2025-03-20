import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUser } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const userData = await getUser(token);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user from API:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("firebaseToken"); // 🔹 Remove token on logout
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth); // 🔹 Firebase sign out
      setUser(null); // 🔹 Reset user state
      localStorage.removeItem("firebaseToken"); // 🔹 Clear stored token
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
