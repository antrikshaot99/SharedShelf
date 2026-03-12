import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Cart() {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const { placeOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

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
        position: "sticky",
        top: 0,
        zIndex: 50,
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
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ← Continue Shopping
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--ink-900)",
            marginBottom: 8,
          }}>
            Shopping Cart
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-500)" }}>
            {itemCount > 0 
              ? `You have ${itemCount} item${itemCount > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"
            }
          </p>
        </div>

        {cart.length === 0 ? (
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
              🛒
            </div>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink-900)",
              marginBottom: 8,
            }}>
              Your cart is empty
            </h2>
            <p style={{
              fontSize: 15,
              color: "var(--ink-500)",
              marginBottom: 32,
              maxWidth: 300,
              margin: "0 auto 32px",
            }}>
              Looks like you haven't added any books to your cart yet.
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Clear Cart Button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={clearCart}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: "#fef2f2",
                    color: "var(--accent-red)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Clear Cart
                </button>
              </div>

              {/* Items */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: 16,
                    padding: 20,
                    border: "1px solid var(--ink-200)",
                    display: "flex",
                    gap: 20,
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Book Icon */}
                  <div style={{
                    width: 80,
                    height: 100,
                    borderRadius: 12,
                    background: "var(--primary-lighter)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    flexShrink: 0,
                  }}>
                    📖
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "var(--ink-900)",
                      marginBottom: 4,
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: "var(--ink-500)",
                      marginBottom: 12,
                    }}>
                      by {item.author}
                    </p>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}>
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "var(--ink-100)",
                      borderRadius: 12,
                      padding: 4,
                    }}>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          border: "none",
                          background: "white",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "var(--ink-600)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        fontWeight: 700,
                        fontSize: 16,
                        minWidth: 24,
                        textAlign: "center",
                        color: "var(--ink-900)",
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          border: "none",
                          background: "var(--gradient-primary)",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink-900)",
                    }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: 28,
              border: "1px solid var(--ink-200)",
              height: "fit-content",
              position: "sticky",
              top: 88,
            }}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink-900)",
                marginBottom: 24,
              }}>
                Order Summary
              </h2>

              <div style={{ marginBottom: 24 }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontSize: 14,
                  color: "var(--ink-600)",
                }}>
                  <span>Subtotal ({itemCount} items)</span>
                  <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>₹{total}</span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontSize: 14,
                  color: "var(--ink-600)",
                }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 600, color: "var(--accent-green)" }}>Free</span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "var(--ink-600)",
                }}>
                  <span>Tax</span>
                  <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>₹0</span>
                </div>
              </div>

              <div style={{
                borderTop: "1px solid var(--ink-200)",
                paddingTop: 20,
                marginBottom: 24,
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)" }}>Total</span>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "var(--ink-900)" }}>₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  placeOrder(cart);
                  clearCart();
                  navigate("/orders");
                }}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 14,
                  border: "none",
                  background: "var(--gradient-primary)",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-primary)",
                  marginBottom: 12,
                }}
              >
                Checkout Now
              </button>

              <button
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  border: "1.5px solid var(--ink-200)",
                  background: "white",
                  color: "var(--ink-700)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Proceed to Checkout Page
              </button>

              {/* Secure Badge */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 20,
                padding: 12,
                background: "var(--ink-50)",
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 16 }}>🔒</span>
                <span style={{ fontSize: 13, color: "var(--ink-500)" }}>Secure checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
