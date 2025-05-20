// Footer.jsx
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black bg-opacity-90 text-white pt-8 pb-12 px-4 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:justify-between md:items-center text-center md:text-left">
        
        {/* Left: Copyright */}
        <div>
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Freedive Analyzer. {t("footer.rights", "All rights reserved.")}.
          </p>
        </div>

        {/* Center: Social media */}
        <div className="flex justify-center md:justify-start gap-6">
          <a
            href="https://www.instagram.com/freedive_analyzer/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-400 transition"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61574604633661"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-400 transition"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/FreediveA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-400 transition"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        {/* Right: Legal links */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-4 text-base text-gray-300">
          <a href="/privacy" className="hover:underline">
            {t("privacy.title")}
          </a>
          <a href="/terms" className="hover:underline">
            {t("terms.title")}
          </a>
          <a href="/contact" className="hover:underline font-semibold text-white">
            {t("contact.title")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
