import React from "react";
import i18n from "i18next";

const LanguageSwitcher = () => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-3 text-xl">
      <button onClick={() => changeLanguage("en")} title="English">🇬🇧</button>
      <button onClick={() => changeLanguage("es")} title="Español">🇪🇸</button>
      <button onClick={() => changeLanguage("uk")} title="Українська">🇺🇦</button>
      <button onClick={() => changeLanguage("ru")} title="Русский">🇷🇺</button>
    </div>
  );
};

export default LanguageSwitcher;
