

import "./login.css";
import { useState } from "react";
import { motion } from "framer-motion";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (isSignup && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const student = {
      name: name.trim() || email.split("@")[0],
      email: email.trim(),
    };

    localStorage.setItem("studysync_student", JSON.stringify(student));

    if (onLogin) {
      onLogin(student);
    }
  };

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-container"
      >
        {/* LEFT PANEL */}
        <section className="login-left-panel">
          <div>
            <div className="login-brand">
              <div className="login-brand-icon">S</div>

              <div>
                <h1 className="login-brand-name">
                  StudySync<span> AI</span>
                </h1>

                <p className="login-brand-subtitle">
                  Your intelligent study companion
                </p>
              </div>
            </div>

            <p className="login-eyebrow">LEARN SMARTER</p>

            <h2 className="login-hero-title">
              Your next
              <br />
              breakthrough
              <br />
              <span className="login-gradient-text">
                starts here.
              </span>
            </h2>

            <p className="login-hero-description">
              Upload your study materials, ask questions, and get
              AI-powered answers grounded in your documents.
            </p>
          </div>

          <div className="login-info-card">
            <div className="login-info-label">
              <span className="login-status-dot" />
              AI LEARNING SPACE
            </div>

            <p className="login-info-text">
              "Understand concepts, explore your notes, and prepare
              for exams with your personal AI tutor."
            </p>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="login-right-panel">
          {/* Mobile brand */}
          <div className="login-mobile-brand">
            <div className="login-brand-icon">S</div>

            <h1 className="login-brand-name">
              StudySync<span> AI</span>
            </h1>
          </div>

          <div className="login-portal-badge">
            <span className="login-portal-dot" />
            STUDENT PORTAL
          </div>

          <div>
            <h2 className="login-form-heading">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>

            <p className="login-form-description">
              {isSignup
                ? "Join StudySync AI and make every study session count."
                : "Sign in to continue your learning journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <div className="login-field">
                <label htmlFor="student-name">Full name</label>

                <input
                  id="student-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="login-field">
              <label htmlFor="student-email">Student email</label>

              <input
                id="student-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="student-password">Password</label>

              <input
                id="student-password"
                type="password"
                autoComplete={
                  isSignup ? "new-password" : "current-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-submit-button">
              {isSignup ? "Create account" : "Sign in"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="login-divider">
            YOUR LEARNING JOURNEY
          </div>

          <p className="login-switch">
            {isSignup
              ? "Already have an account?"
              : "New to StudySync AI?"}

            <button
              type="button"
              onClick={() => {
                setIsSignup((previous) => !previous);
                setError("");
              }}
            >
              {isSignup ? "Sign in" : "Create account"}
            </button>
          </p>

          <p className="login-terms">
            By continuing, you agree to use StudySync AI responsibly.
          </p>
        </section>
      </motion.div>
    </div>
  );
}

export default Login;
