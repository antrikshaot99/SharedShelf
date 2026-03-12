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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--gradient-warm)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative Elements */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201, 116, 86, 0.08) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: 350,
        height: 350,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124, 92, 255, 0.06) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* Main Content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        padding: "80px 40px",
        background: "white",
        borderRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-xl)",
        maxWidth: 560,
        width: "90%",
        border: "1px solid var(--ink-100)",
      }}>
        {/* Logo */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: 32,
          animation: "fadeIn 0.6s ease-out"
        }}>
          <Logo size="xl" variant="full" />
        </div>

        {/* Headline */}
        <h1 style={{ 
          fontSize: 42, 
          fontWeight: 800, 
          fontFamily: "var(--font-display)",
          color: "var(--ink-950)", 
          marginBottom: 16,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          animation: "fadeIn 0.6s ease-out 0.1s both"
        }}>
          Your Literary Haven
        </h1>
        
        {/* Subtitle */}
        <p style={{ 
          fontSize: 18, 
          color: "var(--ink-500)", 
          marginBottom: 12,
          lineHeight: 1.6,
          animation: "fadeIn 0.6s ease-out 0.2s both"
        }}>
          Discover, buy, rent, and sell books
        </p>
        
        {/* Features */}
        <div style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          marginBottom: 40,
          flexWrap: "wrap",
          animation: "fadeIn 0.6s ease-out 0.3s both"
        }}>
          {[
            { icon: "📖", label: "Browse" },
            { icon: "🛒", label: "Buy" },
            { icon: "📅", label: "Rent" },
            { icon: "💰", label: "Sell" }
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "var(--ink-50)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--ink-200)",
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: "var(--ink-600)" 
              }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ 
          display: "flex", 
          gap: 12, 
          justifyContent: "center",
          animation: "fadeIn 0.6s ease-out 0.4s both"
        }}>
          <Link to="/login">
            <button style={{
              padding: "14px 36px",
              fontSize: 15,
              fontWeight: 600,
              background: "var(--gradient-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(201, 116, 86, 0.25)",
            }}>
              Sign In
            </button>
          </Link>

          <Link to="/register">
            <button style={{
              padding: "14px 36px",
              fontSize: 15,
              fontWeight: 600,
              background: "white",
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
            }}>
              Get Started
            </button>
          </Link>
        </div>

        {/* Footer Note */}
        <p style={{ 
          marginTop: 28, 
          fontSize: 13, 
          color: "var(--ink-400)",
          animation: "fadeIn 0.6s ease-out 0.5s both"
        }}>
          Join thousands of book lovers worldwide
        </p>
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