import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../graphql/mutations";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loginMutation] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const { data } = await loginMutation({
        variables: { email: form.email, password: form.password },
      });
      
      // Save JWT token and user info
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.login.user.id);
      localStorage.setItem("userName", data.login.user.name);
      localStorage.setItem("userRole", data.login.user.role);
      
      navigate(data.login.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--ink-100)",
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        background: "var(--gradient-hero)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background Circles */}
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
          }}>Welcome to BookNest</h1>
          <p style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.6,
          }}>
            Your one-stop marketplace for buying, selling, and renting books.
            Join our community of book lovers today.
          </p>

          {/* Stats */}
          <div style={{
            display: "flex",
            gap: 32,
            marginTop: 48,
            justifyContent: "center",
          }}>
            {[
              { value: "10K+", label: "Users" },
              { value: "50K+", label: "Books" },
              { value: "4.9★", label: "Rating" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "white" }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        background: "white",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Logo */}
          <div style={{ marginBottom: 40 }}>
            <Logo size="lg" variant="full" />
          </div>

          {/* Header */}
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--ink-900)",
            marginBottom: 8,
          }}>Sign in</h2>
          <p style={{
            fontSize: 15,
            color: "var(--ink-500)",
            marginBottom: 32,
          }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "var(--primary)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Create one
            </span>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-700)",
              }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1.5px solid var(--ink-200)",
                  fontSize: 15,
                  outline: "none",
                  background: "var(--ink-50)",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--primary-lighter)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--ink-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-700)",
              }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1.5px solid var(--ink-200)",
                  fontSize: 15,
                  outline: "none",
                  background: "var(--ink-50)",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--primary-lighter)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--ink-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button type="submit" style={{
              padding: "14px",
              fontSize: 15,
              fontWeight: 600,
              background: "var(--gradient-primary)",
              color: "white",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              marginTop: 8,
              boxShadow: "var(--shadow-primary)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "var(--shadow-primary)";
            }}>
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "32px 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--ink-200)" }} />
            <span style={{ fontSize: 13, color: "var(--ink-500)" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "var(--ink-200)" }} />
          </div>

          {/* Social Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            {["Google", "GitHub"].map((provider) => (
              <button key={provider} style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: "1.5px solid var(--ink-200)",
                background: "white",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-700)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}>
                {provider === "Google" ? "🌐" : "⚫"} {provider}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}