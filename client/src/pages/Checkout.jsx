import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { OrderContext } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { placeOrder, isPlacingOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Card form state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  
  // UPI state
  const [upiId, setUpiId] = useState("");
  
  // Validation errors
  const [errors, setErrors] = useState({});

  const total = parseFloat((cart.reduce((s, item) => s + item.price * item.quantity, 0)).toFixed(2));
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Validation functions
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleaned)) {
      return "Card number must be 16 digits";
    }
    return "";
  };

  const validateExpiryDate = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return "Expiry must be in MM/YY format";
    }
    const [month, year] = expiry.split("/");
    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) {
      return "Invalid month (01-12)";
    }
    
    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = parseInt(year, 10);
    
    if (expiryYear < currentYear || (expiryYear === currentYear && monthNum < currentMonth)) {
      return "Card has expired";
    }
    return "";
  };

  const validateCVV = (cvv) => {
    if (!/^\d{3,4}$/.test(cvv)) {
      return "CVV must be 3 or 4 digits";
    }
    return "";
  };

  const validateCardholderName = (name) => {
    if (!name.trim()) {
      return "Cardholder name is required";
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return "Cardholder name can only contain letters";
    }
    return "";
  };

  const validateUPI = (upi) => {
    if (!upi.trim()) {
      return "UPI ID is required";
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upi)) {
      return "Invalid UPI format (e.g., username@bank)";
    }
    return "";
  };

  // Validate form based on payment method
  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      const cardNumberError = validateCardNumber(cardDetails.cardNumber);
      if (cardNumberError) newErrors.cardNumber = cardNumberError;

      const expiryError = validateExpiryDate(cardDetails.expiryDate);
      if (expiryError) newErrors.expiryDate = expiryError;

      const cvvError = validateCVV(cardDetails.cvv);
      if (cvvError) newErrors.cvv = cvvError;

      const nameError = validateCardholderName(cardDetails.cardholderName);
      if (nameError) newErrors.cardholderName = nameError;
    } else if (paymentMethod === "upi") {
      const upiError = validateUPI(upiId);
      if (upiError) newErrors.upi = upiError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      return; // Validation errors are already displayed inline
    }

    try {
      await placeOrder();
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order: " + error.message);
    }
  };

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (cart.length === 0)
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--ink-100)",
      }}>
        <div style={{ 
          textAlign: "center",
          background: "white",
          padding: 60,
          borderRadius: 24,
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
          }}>💳</div>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700,
            color: "var(--ink-900)",
            marginBottom: 12
          }}>Cart is empty</h2>
          <p style={{ fontSize: 14, color: "var(--ink-500)", marginBottom: 24 }}>
            Add some books to checkout
          </p>
          <button onClick={() => navigate("/dashboard")} style={{
            padding: "14px 32px", borderRadius: 12, border: "none",
            background: "var(--gradient-primary)", color: "white", fontWeight: 600, 
            fontSize: 15, cursor: "pointer",
            boxShadow: "var(--shadow-primary)",
          }}>Browse Books</button>
        </div>
      </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: "var(--primary-lighter)",
            color: "var(--primary)",
            fontSize: 13,
            fontWeight: 600,
          }}>
            Step 2 of 2
          </span>
          <button
            onClick={() => navigate("/cart")}
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
            ← Back to Cart
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: "white",
        padding: "20px 48px",
        borderBottom: "1px solid var(--ink-200)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--accent-green)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
            }}>✓</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-700)" }}>Cart</span>
          </div>
          <div style={{ flex: 1, height: 2, background: "var(--primary)" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--gradient-primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
            }}>2</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>Checkout</span>
          </div>
          <div style={{ flex: 1, height: 2, background: "var(--ink-200)" }}></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--ink-200)",
              color: "var(--ink-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
            }}>3</div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-500)" }}>Confirmation</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>
          {/* Left Column - Payment */}
          <div>
            <h1 style={{ 
              fontSize: 28, 
              fontWeight: 700,
              color: "var(--ink-900)", 
              marginBottom: 24,
            }}>Payment Details</h1>

            {/* Payment Methods */}
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--ink-200)",
              marginBottom: 24,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-700)", marginBottom: 16 }}>
                Select Payment Method
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  { id: "upi", label: "UPI", icon: "📱" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                ].map((method) => (
                  <label
                    key={method.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: 16,
                      borderRadius: 12,
                      border: paymentMethod === method.id 
                        ? "2px solid var(--primary)" 
                        : "1.5px solid var(--ink-200)",
                      background: paymentMethod === method.id 
                        ? "var(--primary-lighter)" 
                        : "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ display: "none" }}
                    />
                    <span style={{ fontSize: 24 }}>{method.icon}</span>
                    <span style={{ 
                      fontSize: 15, 
                      fontWeight: 600, 
                      color: paymentMethod === method.id ? "var(--primary)" : "var(--ink-700)" 
                    }}>
                      {method.label}
                    </span>
                    {paymentMethod === method.id && (
                      <span style={{
                        marginLeft: "auto",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "var(--primary)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                      }}>✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Card Details (shown when card selected) */}
            {paymentMethod === "card" && (
              <div style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                border: "1px solid var(--ink-200)",
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-700)", marginBottom: 20 }}>
                  Card Information
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-600)", marginBottom: 6, display: "block" }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardInputChange("cardNumber", e.target.value)}
                      maxLength="19"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: 10,
                        border: errors.cardNumber ? "1.5px solid var(--accent-red)" : "1.5px solid var(--ink-200)",
                        fontSize: 15,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.cardNumber && (
                      <span style={{ fontSize: 12, color: "var(--accent-red)", marginTop: 4, display: "block" }}>
                        ⚠️ {errors.cardNumber}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-600)", marginBottom: 6, display: "block" }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange("expiryDate", e.target.value)}
                        maxLength="5"
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: 10,
                          border: errors.expiryDate ? "1.5px solid var(--accent-red)" : "1.5px solid var(--ink-200)",
                          fontSize: 15,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      {errors.expiryDate && (
                        <span style={{ fontSize: 12, color: "var(--accent-red)", marginTop: 4, display: "block" }}>
                          ⚠️ {errors.expiryDate}
                        </span>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-600)", marginBottom: 6, display: "block" }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                        maxLength="4"
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: 10,
                          border: errors.cvv ? "1.5px solid var(--accent-red)" : "1.5px solid var(--ink-200)",
                          fontSize: 15,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      {errors.cvv && (
                        <span style={{ fontSize: 12, color: "var(--accent-red)", marginTop: 4, display: "block" }}>
                          ⚠️ {errors.cvv}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-600)", marginBottom: 6, display: "block" }}>
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.cardholderName}
                      onChange={(e) => handleCardInputChange("cardholderName", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: 10,
                        border: errors.cardholderName ? "1.5px solid var(--accent-red)" : "1.5px solid var(--ink-200)",
                        fontSize: 15,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.cardholderName && (
                      <span style={{ fontSize: 12, color: "var(--accent-red)", marginTop: 4, display: "block" }}>
                        ⚠️ {errors.cardholderName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Details (shown when UPI selected) */}
            {paymentMethod === "upi" && (
              <div style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                border: "1px solid var(--ink-200)",
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-700)", marginBottom: 20 }}>
                  UPI Information
                </h3>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-600)", marginBottom: 6, display: "block" }}>
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="username@upi"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      if (errors.upi) {
                        setErrors(prev => ({
                          ...prev,
                          upi: ""
                        }));
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: errors.upi ? "1.5px solid var(--accent-red)" : "1.5px solid var(--ink-200)",
                      fontSize: 15,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.upi && (
                    <span style={{ fontSize: 12, color: "var(--accent-red)", marginTop: 4, display: "block" }}>
                      ⚠️ {errors.upi}
                    </span>
                  )}
                  <p style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 8 }}>
                    Format: username@upi (e.g., john@okhdfcbank)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div style={{
            background: "white",
            borderRadius: 20,
            padding: 28,
            border: "1px solid var(--ink-200)",
            height: "fit-content",
            position: "sticky",
            top: 24,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-900)", marginBottom: 20 }}>
              Order Summary
            </h2>

            {/* Items */}
            <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 20 }}>
              {cart.map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", 
                  padding: "12px 0",
                  borderBottom: i < cart.length - 1 ? "1px solid var(--ink-100)" : "none",
                }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--ink-900)", fontSize: 14 }}>
                      {item.title}
                    </span>
                    <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: "var(--ink-700)", fontSize: 14 }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: "1px solid var(--ink-200)", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "var(--ink-600)" }}>
                <span>Subtotal ({itemCount} items)</span>
                <span style={{ fontWeight: 600 }}>₹{total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "var(--ink-600)" }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: "var(--accent-green)" }}>Free</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "var(--ink-600)" }}>
                <span>Tax</span>
                <span style={{ fontWeight: 600 }}>₹0</span>
              </div>
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 16, paddingTop: 16, borderTop: "2px solid var(--ink-200)",
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)" }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: "var(--ink-900)" }}>₹{total}</span>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={isPlacingOrder}
              style={{
                width: "100%", 
                padding: "16px", 
                borderRadius: 14, 
                border: "none",
                background: isPlacingOrder ? "var(--ink-300)" : "var(--gradient-primary)", 
                color: "white", 
                fontWeight: 600,
                fontSize: 16, 
                cursor: isPlacingOrder ? "not-allowed" : "pointer", 
                marginTop: 24,
                boxShadow: isPlacingOrder ? "none" : "var(--shadow-primary)",
                opacity: isPlacingOrder ? 0.6 : 1,
              }}
            >
              {isPlacingOrder ? "Placing Order..." : `Complete Order • ₹${total}`}
            </button>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 16,
              padding: 12,
              background: "var(--ink-50)",
              borderRadius: 10,
            }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span style={{ fontSize: 12, color: "var(--ink-500)" }}>256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}