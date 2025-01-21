import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./LoginSignup.module.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleForms = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const msg = await response.text();
      if (response.ok) {
        alert("Login successful!");
        // Passing email as state during navigation to /Chat
        navigate("/Chat", { state: { email } });
      } else {
        alert(msg);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const dob = e.target.dob.value.trim();
    const phone = e.target.phone.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, phone, email, password }),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/Chat", { state: { email } }); // Redirect to Chat with email state
      } else {
        throw new Error("Failed to register user");
      }
    } catch (error) {
      console.error("Sign-up failed:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className={styles.marginauto}>
      <div className={styles.container}>
        {isLogin ? (
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Login</h2>
            <form onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="submit" className={styles.button}>
                Login
              </button>
              <div className={styles.toggleLink}>
                Don&apos;t have an account?{" "}
                <a href="#" onClick={toggleForms}>
                  Sign up
                </a>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="submit" className={styles.button}>
                Sign Up
              </button>
              <div className={styles.toggleLink}>
                Already have an account?{" "}
                <a href="#" onClick={toggleForms}>
                  Login
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
