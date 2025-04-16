import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { loginWithGoogle } from "../api/auth";

export default function GoogleCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        Swal.fire("Error", "No authorization code received from Google.", "error");
        return navigate("/login");
      }

      try {
        const user = await loginWithGoogle(code);
        if (user) {
          setUser(user);
          navigate("/dashboard");
        } else {
          Swal.fire("Error", "Google login failed to return user.", "error");
          navigate("/login");
        }
      } catch (err) {
        console.error("Google login failed:", err);
        Swal.fire("Error", "Something went wrong during Google login.", "error");
        navigate("/login");
      }
    };

    fetchGoogleUser();
  }, [navigate, setUser]);

  return <p className="text-center mt-8 text-white">Loading...</p>;
}
