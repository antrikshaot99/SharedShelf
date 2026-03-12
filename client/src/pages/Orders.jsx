import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Orders() {
  const { orders } = useContext(OrderContext);
  const navigate = useNavigate();

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => 
    sum + order.items.reduce((s, item) => s + item.price, 0), 0
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink-100)" }}>
      {/* Header */}
      <div style={{
        background: "white",
        borderBottom: "1px solid var(--ink-200)",
        padding: "0 48px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          <Logo size="md" variant="full" />
        </div>
        <button 
          onClick={() => navigate("/dashboard")} 
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "1.5px solid var(--ink-200)",
            background: "white",
            color: "var(--ink-700)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Continue Shopping
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700,
            color: "var(--ink-900)", 
            marginBottom: 8,
          }}>Order History</h1>
          <p style={{ fontSize: 15, color: "var(--ink-500)" }}>
            Track and manage your purchases
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            border: "1px solid var(--ink-200)",
          }}>
            <div style={{ fontSize: 14, color: "var(--ink-500)", marginBottom: 8 }}>Total Orders</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink-900)" }}>{totalOrders}</div>
          </div>
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            border: "1px solid var(--ink-200)",
          }}>
            <div style={{ fontSize: 14, color: "var(--ink-500)", marginBottom: 8 }}>Total Spent</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>₹{totalSpent}</div>
          </div>
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: 24,
            border: "1px solid var(--ink-200)",
          }}>
            <div style={{ fontSize: 14, color: "var(--ink-500)", marginBottom: 8 }}>Books Purchased</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--ink-900)" }}>
              {orders.reduce((sum, order) => sum + order.items.length, 0)}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div style={{
            background: "white",
            borderRadius: 20,
            padding: 80,
            textAlign: "center",
            border: "1px solid var(--ink-200)",
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "var(--primary-lighter)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 24px",
            }}>
              📦
            </div>
            <h2 style={{ 
              fontSize: 24, 
              fontWeight: 700,
              color: "var(--ink-900)", 
              marginBottom: 8 
            }}>No orders yet</h2>
            <p style={{ 
              fontSize: 15, 
              color: "var(--ink-500)",
              marginBottom: 32,
              maxWidth: 300,
              margin: "0 auto 32px",
            }}>
              Start shopping to see your order history here
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "14px 32px",
                borderRadius: 12,
                border: "none",
                background: "var(--gradient-primary)",
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-primary)",
              }}
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {orders.map((order, orderIndex) => (
              <div
                key={order.id}
                style={{
                  background: "white",
                  borderRadius: 20,
                  border: "1px solid var(--ink-200)",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Order Header */}
                <div style={{
                  padding: "20px 28px",
                  background: orderIndex === 0 ? "var(--primary-lighter)" : "var(--ink-50)",
                  borderBottom: "1px solid var(--ink-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: orderIndex === 0 ? "var(--gradient-primary)" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      border: orderIndex === 0 ? "none" : "1px solid var(--ink-200)",
                    }}>
                      {orderIndex === 0 ? "📦" : "✓"}
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: 12, 
                        fontWeight: 600, 
                        color: "var(--ink-500)",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        marginBottom: 2,
                      }}>Order ID</div>
                      <div style={{ 
                        fontWeight: 700, 
                        color: "var(--ink-900)",
                        fontSize: 16,
                      }}>#{order.id}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ 
                        fontSize: 12, 
                        fontWeight: 600, 
                        color: "var(--ink-500)",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        marginBottom: 2,
                      }}>Date</div>
                      <div style={{ fontSize: 14, color: "var(--ink-700)", fontWeight: 600 }}>
                        {order.date}
                      </div>
                    </div>
                    <span style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: orderIndex === 0 ? "var(--accent-green)" : "#d1fae5",
                      color: orderIndex === 0 ? "white" : "var(--accent-green)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {orderIndex === 0 ? "Recent" : "Delivered"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: "16px 28px" }}>
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "14px 0",
                        borderBottom: i < order.items.length - 1 ? "1px solid var(--ink-100)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                          width: 44,
                          height: 56,
                          borderRadius: 8,
                          background: "var(--primary-lighter)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                        }}>
                          📖
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--ink-900)", fontSize: 15 }}>
                            {item.title}
                          </div>
                          {item.author && (
                            <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>
                              by {item.author}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: 16 }}>
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div style={{
                  padding: "16px 28px",
                  background: "var(--ink-50)",
                  borderTop: "1px solid var(--ink-100)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: 14, color: "var(--ink-500)" }}>
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </span>
                  <div>
                    <span style={{ fontSize: 14, color: "var(--ink-500)", marginRight: 8 }}>Total:</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--ink-900)" }}>
                      ₹{order.items.reduce((s, item) => s + item.price, 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
