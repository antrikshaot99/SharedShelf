import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Cart() {
  const { cart, addToCart, removeFromCart, clearCart } =
    useContext(CartContext);
  const { placeOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
      {/* ===== NAVBAR ===== */}
      <div style={{
        background: "white",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
        }}>← Continue Shopping</button>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ 
          fontSize: 38, 
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          color: "var(--ink-950)", 
          marginBottom: 12,
          letterSpacing: "-0.02em"
        }}>Shopping Cart</h1>
        <p style={{ 
          fontSize: 15, 
          color: "var(--ink-500)", 
          marginBottom: 32 
        }}>Review your items before checkout</p>

        {cart.length === 0 ? (
          <div style={{
            textAlign: "center", padding: 80, background: "white",
            borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)",
            border: "1px solid var(--ink-100)",
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h3 style={{ 
              fontSize: 20, 
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "var(--ink-900)", 
              marginBottom: 8 
            }}>Your cart is empty</h3>
            <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 24 }}>Start adding books to get started</p>
            <button onClick={() => navigate("/dashboard")} style={{
              padding: "12px 32px", borderRadius: "var(--radius-md)", border: "none",
              background: "var(--gradient-primary)", color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(201, 116, 86, 0.25)",
            }}>Browse Books</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 14, color: "var(--ink-600)", fontWeight: 600 }}>
                {cart.length} {cart.length === 1 ? "item" : "items"} in cart
              </span>
              <button onClick={clearCart} style={{
                padding: "8px 18px", border: "none",
                background: "var(--accent-red)", 
                color: "white", 
                borderRadius: "var(--radius-md)",
                cursor: "pointer", fontWeight: 600, fontSize: 13,
                boxShadow: "var(--shadow-sm)",
              }}>Clear Cart</button>
            </div>

            {cart.map((item) => (
              <div key={item.id} style={{
                background: "white", padding: 24, borderRadius: "var(--radius-lg)",
                marginBottom: 16, display: "flex", justifyContent: "space-between",
                alignItems: "center", boxShadow: "var(--shadow-md)",
                border: "1px solid var(--ink-100)",
                transition: "all 0.2s ease",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: "var(--radius-md)",
                    background: "var(--primary-lighter)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    flexShrink: 0,
                  }}>📖</div>
                  <div>
                    <h3 style={{ 
                      fontSize: 17, 
                      fontWeight: 700,
                      fontFamily: "var(--font-display)",
                      color: "var(--ink-900)", 
                      marginBottom: 4 
                    }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: "var(--ink-500)", marginBottom: 8 }}>{item.author}</p>
                    <p style={{ 
                      fontSize: 16, 
                      fontWeight: 700, 
                      color: "var(--primary)" 
                    }}>
                      ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button onClick={() => removeFromCart(item.id)} style={{
                    width: 40, height: 40, borderRadius: "var(--radius-md)", border: "1.5px solid var(--ink-200)",
                    background: "white", cursor: "pointer", fontSize: 20, fontWeight: 700, color: "var(--ink-600)",
                  }}>−</button>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: 17, 
                    minWidth: 32, 
                    textAlign: "center",
                    color: "var(--ink-900)"
                  }}>{item.quantity}</span>
                  <button onClick={() => addToCart(item)} style={{
                    width: 40, height: 40, borderRadius: "var(--radius-md)", border: "none",
                    background: "var(--gradient-primary)", cursor: "pointer", fontSize: 20, fontWeight: 700, color: "white",
                    boxShadow: "var(--shadow-sm)",
                  }}>+</button>
                </div>
              </div>
            ))}

            <div style={{
              background: "white", padding: 32, borderRadius: "var(--radius-xl)",
              marginTop: 24, boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--ink-100)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 14, color: "var(--ink-500)", marginBottom: 4 }}>Total Amount</p>
                  <p style={{ 
                    fontSize: 36, 
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    color: "var(--ink-950)" 
                  }}>
                    ₹{cart.reduce((s, i) => s + i.price * i.quantity, 0)}
                  </p>
                </div>
                <button onClick={() => { placeOrder(cart); clearCart(); navigate("/orders"); }} style={{
                  padding: "16px 40px", borderRadius: "var(--radius-md)", border: "none",
                  background: "var(--gradient-primary)", color: "white", fontWeight: 700,
                  fontSize: 16, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(201, 116, 86, 0.3)",
                }}>Proceed to Checkout</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
