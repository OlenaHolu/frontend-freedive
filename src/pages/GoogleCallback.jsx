import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser } from "../api/auth";
import Swal from "sweetalert2";

export default function GoogleCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
  
      if (!token) {
        return navigate("/login");
      }
  
      localStorage.setItem("token", token);
  
      try {
        const user = await getUser();
        if (user) {
          setUser(user);
          navigate("/dashboard");
        } else {
          localStorage.removeItem("token");
          Swal.fire("Error", "Failed to retrieve user information.", "error");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        Swal.fire("Error", "Unexpected error retrieving user.", "error");
        navigate("/login");
      }
    };
  
    fetchUser();
  }, [navigate, setUser]);
  
  
  return <p className="text-center mt-8 text-white">Loading...</p>;
}
