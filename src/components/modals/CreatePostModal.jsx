import React, { useState } from "react";
import { uploadPostImage, createPost } from "../../api/post";
import { resizeImage } from "../../utils/resizeImage";
import Swal from "sweetalert2";

export default function CreatePostModal({ onClose, onPostCreated }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setLoading(true);
    try {
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // 1. Convert File to base64
      const reader = new FileReader();
      reader.onload = async () => {
        // 2. Resize image (max 800px)
        const resizedBase64 = await resizeImage(reader.result, 800);

        // 3. Convert resized base64 back to File
        const blob = await (await fetch(resizedBase64)).blob();
        const fileExt = imageFile.name.split(".").pop();
        const resizedFile = new File([blob], `resized.${fileExt}`, {
          type: blob.type,
        });

        // 4. Upload to Supabase
        const imageUrl = await uploadPostImage(resizedFile);

        // 5. Post to backend
        const newPost = await createPost({
          image_url: imageUrl,
          description,
          location,
          hashtags: hashtags
            .split(" ")
            .filter((tag) => tag.startsWith("#"))
            .map((tag) => tag.replace("#", "")),
        });

        Swal.fire({
          icon: "success",
          title: "Post created",
          showConfirmButton: false,
          timer: 1500,
        });

        onPostCreated?.(newPost);
        onClose?.();
      };

      reader.readAsDataURL(imageFile);
    } catch (err) {
      console.error("Post creation failed:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to create post",
        text: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-60 object-cover rounded"
            />
          )}

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="#hashtags #likeThis"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
