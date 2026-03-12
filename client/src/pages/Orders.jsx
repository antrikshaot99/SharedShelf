import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Orders() {
  const { orders } = useContext(OrderContext);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
      <div style={{
        background: "white", padding: "16px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "var(--shadow-sm)",
        borderBottom: "1px solid var(--ink-100)",
      }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          <Logo size="md" variant="full" />
        </div>
        <button onClick={() => navigate("/dashboard")} style={{
          padding: "9px 20px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--ink-200)",
          cursor: "pointer", fontWeight: 600, fontSize: 13,
          background: "white", color: "var(--ink-700)",
        }}>← Back to Shop</button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ 
          fontSize: 38, 
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          color: "var(--ink-950)", 
          marginBottom: 12,
          letterSpacing: "-0.02em"
        }}>Order History</h1>
        <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 32 }}>View all your past orders</p>

        {orders.length === 0 ? (
          <div style={{
            textAlign: "center", padding: 80, background: "white",
            borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)",
            border: "1px solid var(--ink-100)",
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h3 style={{ 
              fontSize: 20, 
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "var(--ink-900)", 
              marginBottom: 8 
            }}>No orders yet</h3>
            <p style={{ fontSize: 15, color: "var(--ink-500)" }}>Start shopping to see your orders here</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{
              background: "white", padding: 28, marginBottom: 20,
              borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)",
              border: "1px solid var(--ink-100)",
              transition: "all 0.2s ease",
            }} onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--ink-100)" }}>
                <div>
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: 700, 
                    color: "var(--ink-500)",
                    textTransform: "uppercase",
                    letterSpacing: 0.8
                  }}>Order ID</span>
                  <div style={{ 
                    fontWeight: 700, 
                    color: "var(--ink-900)",
                    fontSize: 16,
                    marginTop: 4
                  }}>#{order.id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: 700, 
                    color: "var(--ink-500)",
                    textTransform: "uppercase",
                    letterSpacing: 0.8
                  }}>Date</span>
                  <div style={{ fontSize: 14, color: "var(--ink-700)", marginTop: 4, fontWeight: 600 }}>{order.date}</div>
                </div>
              </div>
              {order.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0",
                  borderBottom: i < order.items.length - 1 ? "1px solid var(--ink-100)" : "none",
                }}>
                  <span style={{ color: "var(--ink-700)", fontWeight: 500, fontSize: 15 }}>{item.title}</span>
                  <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 15 }}>₹{item.price}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
