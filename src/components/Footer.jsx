import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black bg-opacity-90 text-white py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        
        {/* Copyright */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Freedive Analyzer. All rights reserved.
        </p>

        {/* Redes sociales */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/freedive_analyzer/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-400"
          >
            <Instagram className="w-5 h-5" />
          </a>

          <a
            href="https://www.facebook.com/freedive_analyzer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-400"
          >
            <Facebook className="w-5 h-5" />
          </a>

          <a
            href="https://twitter.com/freedive_analyzer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-400"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        {/* Links legales */}
        <div className="flex space-x-4 text-sm">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
