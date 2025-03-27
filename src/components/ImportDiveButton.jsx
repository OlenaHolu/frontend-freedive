import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud } from "lucide-react";

export default function ImportDiveButton({ onFileSelected }) {
    const fileInput = useRef();
    const { t } = useTranslation();

    const handleClick = () => {
        fileInput.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        onFileSelected(file);
    };

    return (
        <div className="mt-6 flex items-center justify-center">
            <button
                onClick={handleClick}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-2xl font-medium shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <UploadCloud className="w-5 h-5" />
                {t("dive.importDivesButton")}
            </button>
            <input
                ref={fileInput}
                type="file"
                accept=".xml, .sml"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
