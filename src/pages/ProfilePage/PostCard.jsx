export default function PostCard({ post, user, onDelete, t }) {
    return (
      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
          <div className="font-semibold">{user.name}</div>
          {post.location && <div className="italic text-gray-500">{post.location}</div>}
        </div>
        <img
          src={post.image_path}
          alt={`Post ${post.id}`}
          className="w-full max-h-[600px] object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="px-4 py-3 text-sm space-y-2">
          {post.description && <p className="text-gray-800">{post.description}</p>}
          {post.hashtags?.length > 0 && (
            <p className="text-blue-600">
              {post.hashtags.map(tag => `#${tag}`).join(" ")}
            </p>
          )}
        </div>
        <div className="px-4 pb-3 text-right">
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-600 text-sm hover:underline"
          >
            🗑️ {t("delete")}
          </button>
        </div>
      </div>
    );
  }
  