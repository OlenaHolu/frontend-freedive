import axios from "axios";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Registrar usuario en Firebase y Laravel
export const register = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  console.log("Enviando token a backend:", token);

  return axios.post(`${BACKEND_URL}/api/register`, {
    firebase_token: token,
    name: name,
  });
};

// Iniciar sesión en Firebase
export const login = async (email, password) => {
  try {
    // 🔹 Iniciar sesión con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) throw new Error("Usuario no autenticado en Firebase");

    // 🔹 Obtener el token de Firebase
    const token = await user.getIdToken();

    console.log("Enviando token a backend:", token);

    // 🔹 Enviar el token al backend
    const res = await axios.post(`${BACKEND_URL}/api/login`, { firebase_token: token });

    return res.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // 🔹 Obtener usuario autenticado
    const user = result.user;
    if (!user) throw new Error("No se pudo autenticar con Google");

    // 🔹 Obtener token de Firebase
    const token = await user.getIdToken();

    console.log("Token obtenido de Google:", token);

    // 🔹 Enviar el token al backend
    const res = await axios.post(`${BACKEND_URL}/api/login`, { firebase_token: token });

    return res.data;
  } catch (error) {
    console.error("Error en login con Google:", error);
    throw error;
  }
};

// Obtener usuario autenticado desde Laravel
export const getUser = async (token) => {
  if (!token) return null; // 🔹 Evita llamadas innecesarias si no hay token

  try {
    const res = await axios.get(`${BACKEND_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
};

