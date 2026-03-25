import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const staticNavItems = [
  { icon: "🏠", label: "Home", path: "/dashboard" },
  { icon: "📚", label: "Browse Books", path: "/dashboard" },
  { icon: "📁", label: "My Orders", path: "/orders" },
  { icon: "🛒", label: "Cart", path: "/cart", isCart: true },
];

const secondaryItems = [
  { icon: "💰", label: "Sell a Book", path: "/sell" },
  { icon: "📖", label: "My Rentals", path: "/rentals" },
];

const bottomItems = [];

export default function Sidebar({ userName, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const token = localStorage.getItem("token");

  let userEmail = "";
  try {
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
    userEmail = payload?.email || "";
  } catch {
    userEmail = "";
  }

  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  const navItems = staticNavItems.map((item) =>
    item.isCart ? { ...item, badge: cartCount > 0 ? cartCount : null } : item
  );

  const NavItem = ({ icon, label, path, badge, isActive }) => (
    <button
      onClick={() => navigate(path)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "12px 16px",
        marginBottom: 4,
        borderRadius: 12,
        border: "none",
        background: isActive ? "var(--primary-lighter)" : "transparent",
        color: isActive ? "var(--primary)" : "var(--ink-600)",
        fontSize: 14,
        fontWeight: isActive ? 600 : 500,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "var(--ink-100)";
          e.currentTarget.style.color = "var(--ink-900)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--ink-600)";
        }
      }}
    >
      <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          background: "#ef4444",
          color: "white",
          fontSize: 11,
          fontWeight: 700,
          minWidth: 20,
          height: 20,
          padding: "0 6px",
          borderRadius: 10,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}>{badge}</span>
      )}
    </button>
  );

  return (
    <div style={{
      width: 260,
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      background: "white",
      borderRight: "1px solid var(--ink-200)",
      display: "flex",
      flexDirection: "column",
      zIndex: 100,
    }}>
      {/* Logo Section */}
      <div style={{
        padding: "20px 20px",
        borderBottom: "1px solid var(--ink-100)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "var(--gradient-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-900)" }}>Shared Self</div>
          <div style={{ fontSize: 11, color: "var(--ink-500)" }}>Book Marketplace</div>
        </div>
      </div>

      {/* Search */}
      {/* Main Navigation */}
      <div style={{ padding: "8px 12px", flex: 1, overflow: "auto" }}>
        {navItems.map((item) => (
          <NavItem 
            key={item.label} 
            {...item} 
            isActive={location.pathname === item.path}
          />
        ))}

        {/* Section Divider */}
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "var(--ink-500)",
          padding: "20px 16px 10px",
        }}>
          Seller
        </div>

        {secondaryItems.map((item) => (
          <NavItem 
            key={item.label} 
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>

      {/* User Section */}
      <div style={{
        padding: 16,
        borderTop: "1px solid var(--ink-100)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        <div style={{
          width: "100%",
          background: "var(--ink-100)",
          borderRadius: 16,
          padding: "14px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: 22,
            lineHeight: 1,
            flexShrink: 0,
          }}>
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-900)", lineHeight: 1.1 }}>
              {userName || "User"}
            </div>
            <div style={{
              marginTop: 3,
              fontSize: 11,
              fontWeight: 500,
              color: "var(--ink-500)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {userEmail || "user@sharedshelf.com"}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 13,
            border: "2px solid var(--ink-200)",
            background: "white",
            color: "var(--ink-500)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--ink-100)";
            e.currentTarget.style.color = "var(--ink-700)";
            e.currentTarget.style.borderColor = "var(--ink-300)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "var(--ink-500)";
            e.currentTarget.style.borderColor = "var(--ink-200)";
          }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
