import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: "🏠", label: "Home", path: "/dashboard" },
  { icon: "📚", label: "Browse Books", path: "/dashboard", badge: null },
  { icon: "📁", label: "My Orders", path: "/orders" },
  { icon: "🛒", label: "Cart", path: "/cart" },
];

const secondaryItems = [
  { icon: "💰", label: "Sell a Book", path: "/sell" },
  { icon: "📖", label: "My Rentals", path: "/orders" },
];

const bottomItems = [
  { icon: "⚙️", label: "Settings", path: "#" },
  { icon: "📚", label: "Resources", path: "#" },
];

export default function Sidebar({ userName, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

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
          background: "var(--primary)",
          color: "white",
          fontSize: 11,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 10,
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
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-900)" }}>BookNest</div>
          <div style={{ fontSize: 11, color: "var(--ink-500)" }}>Book Marketplace</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          background: "var(--ink-100)",
          borderRadius: 10,
          color: "var(--ink-500)",
          fontSize: 14,
        }}>
          <span>🔍</span>
          <span>Search...</span>
        </div>
      </div>

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

        {/* Section Divider */}
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "var(--ink-500)",
          padding: "20px 16px 10px",
        }}>
          More
        </div>

        {bottomItems.map((item) => (
          <NavItem 
            key={item.label} 
            {...item}
            isActive={false}
          />
        ))}
      </div>

      {/* User Section */}
      <div style={{
        padding: 16,
        borderTop: "1px solid var(--ink-100)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "var(--gradient-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontSize: 14,
        }}>
          {userName?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>
            {userName || "User"}
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 8px",
            background: "var(--primary)",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 10,
            marginTop: 2,
          }}>
            Pro
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--ink-200)",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
          title="Logout"
        >
          ↗
        </button>
      </div>
    </div>
  );
}
