export default function ProfileSettings({ showSettings, setShowSettings, onDelete, t }) {
    return (
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={() => setShowSettings(prev => !prev)}
          className="flex items-center gap-2 text-sm text-left text-gray-500 hover:text-black transition font-medium"
        >
          <span>⚙️</span>
          <span>{t("settings")}</span>
        </button>
  
        {showSettings && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onDelete}
              className="bg-red-600 text-white py-2 px-5 rounded-md shadow hover:bg-red-700 transition"
            >
              🗑️ {t("profile.delete_button")}
            </button>
          </div>
        )}
      </div>
    );
  }
  