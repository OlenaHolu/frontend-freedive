import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

// initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const logout = () => signOut(auth);
export default app;

// Devuelve el token JWT del usuario actual
export async function getFirebaseToken() {
  const user = auth.currentUser;

  if (!user) throw new Error("No user logged in");
  return await user.getIdToken();
}

