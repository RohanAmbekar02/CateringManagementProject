import React, { useState } from "react";
import "./Login.css";
import Swal from "sweetalert2";
import { Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    const logged = localStorage.getItem("isAuthenticated") === "true";
    if (logged) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const staticUser = {
    contact: "9922342763",
    password: "Sachin@123",
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (contact.trim() === "" || password.trim() === "") {
      Swal.fire({
        title: "Fields Missing!",
        text: "Please fill all the fields.",
        icon: "warning",
        confirmButtonColor: "#b8860b",
      });
      return;
    }

    if (contact === staticUser.contact && password === staticUser.password) {
      localStorage.setItem("isAuthenticated", "true");

      Swal.fire({
        title: "Success!",
        text: "You are successfully logged in!",
        icon: "success",
        confirmButtonColor: "#b8860b",
      }).then(() => {
        navigate("/dashboard");
      });
    } else {
      Swal.fire({
        title: "Invalid!",
        text: "Username or Password is incorrect.",
        icon: "error",
        confirmButtonColor: "#b8860b",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div
          className="profile-icon-container"
          style={{
            backgroundColor: "#b8860b",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            margin: "0 auto 15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <User size={40} color="white" />
        </div>

        <h2 className="title">Welcome!</h2>
        <p style={{ color: "#666", marginBottom: "25px" }}>
          Log in to your account
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <div
            className="input-group"
            style={{ position: "relative", marginBottom: "15px" }}
          >
            <User
              size={20}
              color="#b8860b"
              style={{ position: "absolute", left: "15px", top: "15px" }}
            />
            <input
              type="text"
              placeholder="Username"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="login-input"
            />
          </div>

          <div
            className="input-group"
            style={{ position: "relative", marginBottom: "15px" }}
          >
            <Lock
              size={20}
              color="#b8860b"
              style={{ position: "absolute", left: "15px", top: "15px" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />

            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "15px",
                cursor: "pointer",
                color: "#888",
              }}
              title={showPassword ? "Hide Password" : "Show Password"}
            ></i>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
