import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUser } from "../api/auth"; // API call to Laravel backend

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Check if token exists in local storage
    const storedToken = localStorage.getItem("firebaseToken");

    if (storedToken) {
      getUser(storedToken)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching user from API:", error);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // 🔹 Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();

          // 🔹 Store token for session persistence
          localStorage.setItem("firebaseToken", token);

          // 🔹 Fetch user data from Laravel backend
          const userData = await getUser(token);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user from API:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("firebaseToken"); // 🔹 Remove token when user logs out
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const logout = async () => {
    try {
      await signOut(auth); // 🔹 Firebase sign out
      setUser(null);
      localStorage.removeItem("firebaseToken"); // 🔹 Remove stored token
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
