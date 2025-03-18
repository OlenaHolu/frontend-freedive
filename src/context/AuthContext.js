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
          console.error("Error al obtener usuario:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth); // 🔹 Cerrar sesión en Firebase
      setUser(null); // 🔹 Resetear el estado del usuario
      console.log("Sesión cerrada con éxito");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
