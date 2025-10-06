import API from "./axiosInstance";
import { supabase } from "../lib/supabaseClient";

// Upload image to Supabase
export const uploadPostImage = async (file) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from("posts")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  return filePath;
};


export const createPost = async (postData) => {
  const response = await API.post("/api/posts", postData);
  return response.data.post;
};


export const getMyPosts = async () => {
  const response = await API.get("/api/posts");
  return response.data.posts;
};

export const deletePost = async (postId) => {
  const response = await API.delete(`/api/posts/${postId}`);
  return response.data;
};

