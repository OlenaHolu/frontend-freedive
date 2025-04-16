import API from "../api/axiosInstance";
import { supabase } from "../lib/supabaseClient";

export const register = async (name, email, password, password_confirmation) => {
  try {
    const res = await API.post("/api/register", {
      name: name,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
    });

    const { user, token } = res.data;

    localStorage.setItem("token", token);

    return user;
  } catch (error) {
    throw {
      response: {
        data: {
          errorCode: error.response?.data?.errorCode || 1000,
          error: error.response?.data?.error || "Failed to register user",
        },
      },
    };
  }
};

export const login = async (email, password) => {
  try {
    const res = await API.post("/api/login", {
      email,
      password,
    });

    const { user, token } = res.data;

    localStorage.setItem("token", token);

    return user;
  } catch (error) {
    throw {
      response: {
        data: {
          errorCode: error.response?.data?.errorCode || 1000,
          error: error.response?.data?.error || "Failed to login user",
        },
      },
    };
  }
};

export const loginWithGoogle = async (code) => {
  try {
    const res = await API.post("/api/auth/google/callback", { code });

    const { user, token } = res.data;

    localStorage.setItem("token", token);

    return user;
  } catch (error) {
    throw {
      response: {
        data: {
          errorCode: error.response?.data?.errorCode || 1000,
          error: error.response?.data?.error || "Google login failed",
        },
      },
    };
  }
};


export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await API.get("/api/user");
    console.log("User fetched:", res.data.user);
    return res.data.user;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.warn("❌ getUser request timed out");
    } else {
      console.error("Error getting user:", error);
    }
    return null;
  }
};


export async function updateUserPhoto(base64Image) {
  const res = await fetch(base64Image);
  const blob = await res.blob();

  const user = await getUser();
  const email = user?.email;
  if (!email) throw new Error("Email not found");

  // Convert email to a safe filename
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${safeEmail}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      upsert: true, // for overwriting the file if it exists
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  const res2 = await API.patch("/api/user/update", {
    photo: publicUrl,
  });

  return res2.data.user;
}

export const deleteProfile = async () => {
  try {
    await API.delete("/api/user/delete");
  } catch (error) {
    throw {
      response: {
        data: {
          errorCode: error.response?.data?.errorCode || 1000,
          error: error.response?.data?.error || "Failed to delete user",
        },
      },
    };
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await API.patch("/api/user/update", data);
    return res.data.user;
  } catch (error) {
    throw {
      response: {
        data: {
          errorCode: error.response?.data?.errorCode || 1000,
          error: error.response?.data?.error || "Failed to update user",
        },
      },
    };
  }
};