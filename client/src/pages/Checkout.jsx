import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { placeOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    placeOrder(cart);
    clearCart();
    alert("🎉 Order placed successfully!");
    navigate("/orders");
  };

  if (cart.length === 0)
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--gradient-warm)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💳</div>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color: "var(--ink-900)",
            marginBottom: 12
          }}>Cart is empty</h2>
          <button onClick={() => navigate("/dashboard")} style={{
            padding: "12px 28px", borderRadius: "var(--radius-md)", border: "none",
            background: "var(--gradient-primary)", color: "white", fontWeight: 600, 
            fontSize: 14, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(201, 116, 86, 0.25)",
          }}>Browse Books</button>
        </div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "var(--gradient-warm)" }}>
      <div style={{
        background: "white", padding: "16px 32px",
        boxShadow: "var(--shadow-sm)",
        borderBottom: "1px solid var(--ink-100)",
      }}>
        <Logo size="md" variant="full" />
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ 
          fontSize: 38, 
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          color: "var(--ink-950)", 
          marginBottom: 12,
          letterSpacing: "-0.02em"
        }}>Checkout</h1>
        <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 32 }}>Review your order details</p>

        <div style={{
          background: "white", borderRadius: "var(--radius-xl)", padding: 32,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--ink-100)",
        }}>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--ink-700)",
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: 0.8
          }}>Order Summary</h3>

          {cart.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", padding: "14px 0",
              borderBottom: i < cart.length - 1 ? "1px solid var(--ink-100)" : "none",
            }}>
              <div>
                <span style={{ fontWeight: 600, color: "var(--ink-900)", fontSize: 15 }}>{item.title}</span>
                <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>by {item.author}</div>
              </div>
              <span style={{ fontWeight: 700, color: "var(--ink-700)", fontSize: 15 }}>₹{item.price} × {item.quantity}</span>
            </div>
          ))}

          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 24, paddingTop: 20, borderTop: "2px solid var(--ink-200)",
          }}>
            <span style={{ 
              fontSize: 20, 
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "var(--ink-950)" 
            }}>Total</span>
            <span style={{ 
              fontSize: 24, 
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "var(--primary)" 
            }}>₹{total}</span>
          </div>
        </div>

        <button onClick={handleCheckout} style={{
          width: "100%", padding: "18px", borderRadius: "var(--radius-lg)", border: "none",
          background: "var(--gradient-primary)", color: "white", fontWeight: 700,
          fontSize: 17, cursor: "pointer", marginTop: 24,
          boxShadow: "0 6px 20px rgba(201, 116, 86, 0.35)",
        }}>Place Order</button>
      </div>
    </div>
  );
}