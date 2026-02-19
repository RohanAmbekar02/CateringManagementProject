import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // for redirect
import "./Navbar.css";
import logo from "../assets/CMP.jpeg";

const Navbar = ({ username = "Sachin " }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b8860b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('isAuthenticated');
        navigate("/", { replace: true });
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="CMP" className="navbar-logo" />
        <span className="navbar-title">Jogeshwari Caterers </span>
      </div>

      <div className="navbar-right">
       <h4><span className="welcome-text">Hi, {username}</span></h4>
   
        <i
          className="fas fa-sign-out-alt logout-icon"
          title="Logout"
          onClick={handleLogout}
        ></i>
      </div>
    </nav>
  );
};

export default Navbar;
