import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SellBook from "./pages/SellBook";
import Logo from "./components/Logo";

function Landing() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--ink-100)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Navigation Bar */}
      <nav style={{
        background: "white",
        borderBottom: "1px solid var(--ink-200)",
        padding: "16px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Logo size="md" variant="full" />
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login">
            <button style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              background: "transparent",
              color: "var(--ink-700)",
              border: "1.5px solid var(--ink-200)",
              borderRadius: 10,
              cursor: "pointer",
            }}>
              Sign In
            </button>
          </Link>
          <Link to="/register">
            <button style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              background: "var(--gradient-primary)",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "var(--shadow-primary)",
            }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background Decorations */}
        <div style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-15%",
          left: "-5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />

        {/* Hero Content */}
        <div style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 800,
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "var(--primary-lighter)",
            borderRadius: 50,
            marginBottom: 24,
            animation: "fadeIn 0.6s ease-out",
          }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--primary)",
            }}>Your Ultimate Book Marketplace</span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 56,
            fontWeight: 800,
            color: "var(--ink-950)",
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: "-0.02em",
            animation: "fadeIn 0.6s ease-out 0.1s both",
          }}>
            Discover, Buy & Sell<br />
            <span style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Books You Love
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18,
            color: "var(--ink-600)",
            marginBottom: 36,
            maxWidth: 500,
            margin: "0 auto 36px",
            lineHeight: 1.6,
            animation: "fadeIn 0.6s ease-out 0.2s both",
          }}>
            Join thousands of book lovers. Browse, buy, rent, or sell your books
            in our thriving community marketplace.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginBottom: 48,
            animation: "fadeIn 0.6s ease-out 0.3s both",
          }}>
            <Link to="/register">
              <button style={{
                padding: "16px 40px",
                fontSize: 16,
                fontWeight: 600,
                background: "var(--gradient-primary)",
                color: "white",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                boxShadow: "var(--shadow-primary)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                Start Exploring
                <span style={{ fontSize: 18 }}>→</span>
              </button>
            </Link>
            <Link to="/login">
              <button style={{
                padding: "16px 40px",
                fontSize: 16,
                fontWeight: 600,
                background: "white",
                color: "var(--ink-700)",
                border: "1.5px solid var(--ink-200)",
                borderRadius: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>▶</span>
                Take a Tour
              </button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            animation: "fadeIn 0.6s ease-out 0.4s both",
          }}>
            {[
              { icon: "📚", title: "Browse", desc: "Explore thousands of books", color: "#eef2ff" },
              { icon: "🛒", title: "Buy", desc: "Best prices guaranteed", color: "#ecfdf5" },
              { icon: "📅", title: "Rent", desc: "Flexible rental options", color: "#fef3c7" },
              { icon: "💰", title: "Sell", desc: "Sell your old books", color: "#fce7f3" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
                border: "1px solid var(--ink-200)",
                boxShadow: "var(--shadow-card)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  margin: "0 auto 16px",
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--ink-900)",
                  marginBottom: 6,
                }}>{item.title}</h3>
                <p style={{
                  fontSize: 13,
                  color: "var(--ink-500)",
                }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            marginTop: 48,
            paddingTop: 40,
            borderTop: "1px solid var(--ink-200)",
            animation: "fadeIn 0.6s ease-out 0.5s both",
          }}>
            {[
              { value: "10K+", label: "Active Users" },
              { value: "50K+", label: "Books Listed" },
              { value: "25K+", label: "Books Sold" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--ink-900)",
                  marginBottom: 4,
                }}>{stat.value}</div>
                <div style={{
                  fontSize: 13,
                  color: "var(--ink-500)",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
        <Route path="/" element={<Landing />} />
        <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>
<Route path="/orders" element={<Orders />} />
<Route path="/sell" element={<SellBook />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;