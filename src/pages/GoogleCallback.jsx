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
      console.log("Token from URL:", token);
  
      if (!token) {
        return navigate("/login");
      }
  
      localStorage.setItem("token", token);
  
      try {
        const user = await getUser();
        console.log("User from API:", user);
        if (user) {
          setUser(user);
          navigate("/dashboard");
        } else {
          throw new Error("User object is null");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        localStorage.removeItem("token");
        Swal.fire("Error", err?.response?.data?.error || "Unexpected error retrieving user.", "error");
        navigate("/login");
      }
    };
  
    fetchUser();
  }, [navigate, setUser]);
  
  return <p className="text-center mt-8 text-white">Loading...</p>;
}
