import React, { useEffect, useState } from "react";
import { uploadPostImage, createPost } from "../../api/post";
import { resizeImage } from "../../utils/resizeImage";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { getTranslatedError } from "../../utils/getTranslatedError";

export default function CreatePostModal({ onClose, onPostCreated }) {
  const { t } = useTranslation();

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      Swal.fire({
        icon: "warning",
        title: t("errors.image_required"),
        text: t("errors.select_image_first"),
      });
      return;
    }

    setLoading(true);

    try {
      Swal.fire({
        title: t("post.posting"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const resizedBase64 = await resizeImage(base64, 800);
      const blob = await (await fetch(resizedBase64)).blob();
      const fileExt = imageFile.name.split(".").pop();
      const resizedFile = new File([blob], `resized.${fileExt}`, {
        type: blob.type,
      });

      const imagePath = await uploadPostImage(resizedFile);

      const newPost = await createPost({
        image_path: imagePath,
        description,
        location,
        hashtags: hashtags
          .split(" ")
          .filter((tag) => tag.startsWith("#"))
          .map((tag) => tag.replace("#", "")),
      });

      Swal.fire({
        icon: "success",
        title: t("post.created"),
        showConfirmButton: false,
        timer: 1500,
      });

      onPostCreated?.(newPost);
      onClose?.();
    } catch (err) {
      console.error("Post creation failed:", err);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: getTranslatedError(t, err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg relative max-h-full overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4">{t("post.create")}</h2>

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
            placeholder={t("post.location_placeholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder={t("post.textarea_placeholder")}
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
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? t("post.posting") : t("post.button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
