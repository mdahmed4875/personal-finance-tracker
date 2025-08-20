import React from "react";
import { useFirebase } from "../context/Firebase"; // adjust path
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ import toast
import "./Navbar.css"; // import css

function Navbar() {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logout successfully");
      navigate("/login"); // ✅ proper navigation
    } else {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Financely</h2>
      <div>
        {user ? (
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn"> {/* ✅ use Link instead of <a> */}
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
