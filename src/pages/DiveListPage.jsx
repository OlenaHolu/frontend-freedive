import { useEffect, useState } from "react";
import { getDives } from "../api/dive";
import DiveCard from "../components/DiveCard";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const DiveListPage = () => {
    const { user, loading } = useAuth();
    const [dives, setDives] = useState([]);
    const { t } = useTranslation();
    const [loadingDives, setLoadingDives] = useState(true);

    const fetchDives = async () => {
        try {
            setLoadingDives(true);
            const res = await getDives();
            setDives(res.dives);
        } catch (err) {
            console.error("Error fetching dives:", err);
        } finally {
            setLoadingDives(false);
        }
    };

    useEffect(() => {
        if (user) fetchDives();
    }, [user]);

    if (loading || loadingDives || !user) {
        return (
            <div className="flex text-gray-700 text-lg font-semibold">
                {t("loading")}
            </div>
        );
    }


    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">📋 {t("divesList.title")}</h2>
            <div className="grid gap-4">
                {dives.length === 0 ? (
                    <p>{t("diveslist.noDives")}</p>
                ) : (
                    dives.map((dive) => <DiveCard key={dive.id} dive={dive} onDiveUpdated={fetchDives} />)
                )}
            </div>
        </div>
    );
};

export default DiveListPage;
