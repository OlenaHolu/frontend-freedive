const Footer = () => {
    return (
      <footer className="bg-black bg-opacity-90 text-white py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm">&copy; {new Date().getFullYear()} Freedive Analyzer. All rights reserved.</p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="/contact" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  