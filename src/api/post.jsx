import API from "../api/axiosInstance";
import { supabase } from "../lib/supabaseClient";

// Crear un nuevo post en Laravel API
export const createPost = async (postData) => {
  const response = await API.post("/api/posts", postData);
  return response.data.post;
};

// Subir imagen a Supabase (bucket privado) y devolver URL firmada
export const uploadPostImage = async (file) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("posts")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("posts")
    .createSignedUrl(filePath, 60 * 60); // válido 1h

  if (signedUrlError) throw signedUrlError;

  return signedUrlData.signedUrl;
};

// (opcional) Obtener mis posts
export const getMyPosts = async () => {
  const response = await API.get("/api/posts");
  return response.data.posts;
};
