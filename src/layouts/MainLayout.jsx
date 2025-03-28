import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children, backgroundImage }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main
        className="flex-1 w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage || "/default-bg.png"})`,
          backgroundPosition: "top",
        }}
      >
        <div className="max-w-7xl mx-auto pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 text-white">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
