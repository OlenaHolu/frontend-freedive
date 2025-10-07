import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDiveById } from "../../api/dive";
import DiveForm from "../../components/DiveForm";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function DiveEditPage() {
  const { t } = useTranslation();
  const { diveId } = useParams();
  const [dive, setDive] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDive = async () => {
      try {
        Swal.fire({
          title: t("loading"),
          text: t("dive.loading"),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const res = await getDiveById(diveId);
        setDive(res.dive);
        Swal.close();
      } catch (err) {
        console.error("Error loading dive:", err);
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: t("dive.errorLoading"),
        });
      }
    };

    fetchDive();
  }, [diveId, t]);

  const handleClose = () => {
    navigate("/dashboard/list");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">✏️ {t("dive.editDive")}</h2>
      {dive ? (
        <DiveForm
          editMode
          initialData={dive}
          onClose={handleClose}
        />
      ) : (
        <p className="text-gray-600">{t("loading")}</p>
      )}
    </div>
  );
}
