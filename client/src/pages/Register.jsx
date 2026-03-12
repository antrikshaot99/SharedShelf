import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { REGISTER } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register] = useMutation(REGISTER);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await register({ variables: form });
      
      // Save JWT token and user info
      localStorage.setItem("token", data.register.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.register.user.id);
      localStorage.setItem("userName", data.register.user.name);
      localStorage.setItem("userRole", data.register.user.role);
      
      alert("Registration successful! Welcome to BookNest!");
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--gradient-warm)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative blob */}
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124, 92, 255, 0.08) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        background: "white",
        padding: "56px 48px",
        borderRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-xl)",
        width: "90%",
        maxWidth: 460,
        border: "1px solid var(--ink-100)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Logo size="lg" variant="full" />
          </div>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            fontFamily: "var(--font-display)",
            color: "var(--ink-950)",
            marginBottom: 8,
            letterSpacing: "-0.02em"
          }}>Create Account</h1>
          <p style={{ color: "var(--ink-500)", fontSize: 15 }}>Join BookNest and start your reading journey</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink-700)",
            }}>Full Name</label>
            <input
              placeholder="John Doe"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--ink-200)",
                fontSize: 15,
                outline: "none",
                background: "var(--ink-50)",
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
            }}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--ink-200)",
                fontSize: 15,
                outline: "none",
                background: "var(--ink-50)",
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
              placeholder="Create a strong password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--ink-200)",
                fontSize: 15,
                outline: "none",
                background: "var(--ink-50)",
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
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            marginTop: 8,
            boxShadow: "0 4px 12px rgba(201, 116, 86, 0.25)",
          }}>
            Create Account
          </button>
        </form>

        <div style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: "1px solid var(--ink-100)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 14, color: "var(--ink-500)" }}>
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/login")} 
              style={{ 
                color: "var(--primary)", 
                cursor: "pointer", 
                fontWeight: 600,
                textDecoration: "underline",
              }}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}