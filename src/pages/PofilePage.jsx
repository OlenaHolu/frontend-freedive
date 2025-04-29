import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { updateUserPhoto, deleteProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditProfileForm from "../components/profile/EditProfileForm";
import CreatePostModal from "../components/modals/CreatePostModal";
import { getMyPosts, deletePost } from "../api/post";
import ProfileHeader from "../components/profile/ProfileHeader";


const tabs = [
  { key: "posts", label: "Posts" },
  { key: "tagged", label: "Tagged" }
];

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(user?.photo || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchPosts = async () => {
    try {
      const posts = await getMyPosts();
      setUserPosts(posts);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);



  if (!user) {
    return <p className="text-white text-center mt-8">{t("loading")}</p>;
  }

  const resizeImage = (base64) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 300;
        const scale = Math.min(size / img.width, size / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = base64;
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const resized = await resizeImage(reader.result);
      setPreview(resized);
      setSelectedFile(resized);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      Swal.fire({
        title: t("profile.uploading"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const updatedUser = await updateUserPhoto(selectedFile);
      setUser(updatedUser);
      setSelectedFile(null);

      Swal.fire({
        icon: "success",
        title: t("profile.updated"),
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Error uploading avatar:", err);
      Swal.fire({
        icon: "error",
        title: t("profile.error"),
        text: t("profile.upload_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    const confirmed = await Swal.fire({
      title: t("profile.confirm_delete_title"),
      text: t("profile.confirm_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("profile.confirm_delete_button"),
      cancelButtonText: t("cancel"),
      confirmButtonColor: "#e3342f"
    });

    if (!confirmed.isConfirmed) return;

    try {
      Swal.fire({
        title: t("profile.deleting"),
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await deleteProfile();
      setUser(null);

      const result = await Swal.fire({
        icon: "success",
        title: t("profile.deleted"),
        text: t("profile.deleted_message"),
        showConfirmButton: true,
        confirmButtonText: t("ok"),
      });

      await signOut(auth);

      if (result.isConfirmed) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      Swal.fire({
        icon: "error",
        title: t("profile.error"),
        text: t("profile.delete_error"),
      });
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = await Swal.fire({
      title: t("post.confirm_delete_title"),
      text: t("post.confirm_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("post.confirm_delete_button"),
      cancelButtonText: t("cancel"),
      confirmButtonColor: "#e3342f"
    });

    if (!confirmed.isConfirmed) return;

    try {
      await deletePost(postId);
      setUserPosts((prev) => prev.filter((p) => p.id !== postId));
      Swal.fire({
        icon: "success",
        title: t("post.deleted"),
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Failed to delete post:", err);
      Swal.fire({
        icon: "error",
        title: t("post.error"),
        text: t("post.delete_error"),
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-black">
      {/* Header */}
      <ProfileHeader
  user={{ ...user, postCount: userPosts.length }}
  t={t}
  preview={preview}
  selectedFile={selectedFile}
  loading={loading}
  isEditing={isEditing}
  showSettings={showSettings}
  setIsEditing={setIsEditing}
  setShowSettings={setShowSettings}
  handleFileChange={handleFileChange}
  handleUpload={handleUpload}
  handleDeleteProfile={handleDeleteProfile}
/>

      {/* Highlights */}
      <div className="mt-10 flex justify-center gap-4">
        <div className="flex flex-col items-center text-sm">
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-16 h-16 rounded-full border flex items-center justify-center bg-white shadow-inner text-3xl text-gray-400 hover:bg-gray-100 transition"
          >
            +
          </button>
          <span className="mt-1">New</span>
        </div>

        {showCreatePost && (
          <CreatePostModal
            onClose={() => setShowCreatePost(false)}
            onPostCreated={() => {
              fetchPosts();
              setShowCreatePost(false);
            }}
          />
        )}
      </div>

      {/* Tabs */}
      < div className="mt-10 border-t border-gray-300" >
        <div className="flex justify-around text-sm font-medium text-gray-500">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 w-full ${activeTab === tab.key
                ? "border-t-2 border-black text-black"
                : "hover:text-black"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div >

      {/* Content */}
      <div className="flex flex-col gap-6">
        {loadingPosts ? (
          <p className="text-center text-gray-500">{t("loading")}</p>
        ) : userPosts.length === 0 ? (
          <p className="text-center italic text-gray-500">{t("post.no_posts")}</p>
        ) : (
          userPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border rounded-lg shadow-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
                <div className="font-semibold">{user.name}</div>
                {post.location && <div className="italic text-gray-500">{post.location}</div>}
              </div>

              {/* Image */}
              <img
                src={post.image_url}
                alt={`Post ${post.id}`}
                className="w-full max-h-[600px] object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />

              {/* Footer */}
              <div className="px-4 py-3 text-sm space-y-2">
                {post.description && (
                  <p className="text-gray-800">{post.description}</p>
                )}
                {post.hashtags?.length > 0 && (
                  <p className="text-blue-600">
                    {post.hashtags.map((tag) => `#${tag}`).join(" ")}
                  </p>
                )}
              </div>
              {/* Delete Post */}
              <div className="px-4 pb-3 text-right">
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  🗑️ {t("delete")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>


    </div >
  );
}  