import axios from "axios";
import { auth, getFirebaseToken } from "../lib/firebaseClient";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { supabase } from "../lib/supabaseClient";
import { mapFirebaseAuthError } from "../utils/firebaseErrorMapper";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const register = async (email, password, name) => {
  try{
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  const res = await axios.post(`${BACKEND_URL}/api/register`, {
    firebase_token: token,
    name: name,
  });

  return res.data;
  } catch (error) {
    if (error.code?.startsWith("auth/")) {
      const mappedError = mapFirebaseAuthError(error);
      throw { response: { data: mappedError } };
    }

    throw {
      response: {
        data: {
          errorCode: 1000,
          error: "Something went wrong. Please try again.",
        },
      },
    };
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user){
      throw {
        response: {
          data: {
            errorCode: 1402,
            error: "Google login failed. Please try again.",
          },
        },
      }
    }

    const token = await user.getIdToken();

    const res = await axios.post(`${BACKEND_URL}/api/login`, { firebase_token: token });

    return res.data;
  } catch (error) {
    if (error.code?.startsWith("auth/")) {
      const mappedError = mapFirebaseAuthError(error);
      throw { response: { data: mappedError } };
    }

    throw {
      response: {
        data: {
          errorCode: 1402,
          error: "Google login failed. Please try again.",
        },
      },
    };
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const res = await axios.post(`${BACKEND_URL}/api/login`, { 
      firebase_token: token,
     });

    return res.data;
  } catch (error) {
    if (error.code?.startsWith("auth/")) {
      const mappedError = mapFirebaseAuthError(error);
      throw { response: { data: mappedError } };
    }

    throw {
      response: {
        data: {
          errorCode: 1000,
          error: "Something went wrong. Please try again.",
        },
      },
    };
  }
};

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

export async function updateUserPhoto(base64Image) {
  const res = await fetch(base64Image);
  const blob = await res.blob();

  const firebaseToken = await getFirebaseToken();

  // Obtener info de usuario desde tu backend (Laravel)
  const userRes = await fetch(`${BACKEND_URL}/api/user`, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });

  const userJson = await userRes.json();
  const email = userJson.user?.email;
  if (!email) throw new Error("Email not found from backend");

  // Limpiar el email para usarlo como nombre de archivo
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${safeEmail}.jpg`; // Siempre el mismo → se reemplaza

  // Subir avatar a Supabase (sobrescribe si ya existe)
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      upsert: true, // 👈 importante para reemplazar
    });

  if (uploadError) throw uploadError;

  // Obtener URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // Enviar nueva URL al backend
  const response = await fetch(`${BACKEND_URL}/api/user/update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      avatar_url: publicUrl,
    }),
  });

  if (!response.ok) throw new Error("Backend update failed");

  const { user: updatedUser } = await response.json();
  return updatedUser;
}

export const deleteProfile = async () => {
  const token = await getFirebaseToken();

  await axios.delete(`${BACKEND_URL}/api/user/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

