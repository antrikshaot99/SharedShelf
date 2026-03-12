export default function Logo({ size = "md", variant = "default" }) {
  const sizes = {
    sm: { container: 32, icon: 18, text: 16 },
    md: { container: 40, icon: 22, text: 18 },
    lg: { container: 52, icon: 28, text: 24 },
    xl: { container: 64, icon: 34, text: 32 },
  };

  const s = sizes[size];
  const showText = variant === "full";

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: size === "sm" ? 8 : size === "md" ? 10 : 14 
    }}>
      {/* Logo Icon */}
      <div style={{
        width: s.container,
        height: s.container,
        borderRadius: size === "sm" ? 8 : size === "md" ? 10 : 14,
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative Circle */}
        <div style={{
          position: "absolute",
          top: "-30%",
          right: "-30%",
          width: "60%",
          height: "60%",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "50%",
        }} />
        
        {/* Book Icon */}
        <svg 
          width={s.icon} 
          height={s.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          style={{ position: "relative", zIndex: 1 }}
        >
          <path 
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <line 
            x1="9" 
            y1="7" 
            x2="15" 
            y2="7" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <line 
            x1="9" 
            y1="11" 
            x2="15" 
            y2="11" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {(showText || variant === "default") && (
        <span style={{
          fontFamily: "var(--font-body)",
          fontSize: s.text,
          fontWeight: 700,
          color: "var(--ink-900)",
          letterSpacing: "-0.02em",
        }}>
          BookNest
        </span>
      )}
    </div>
  );
}
