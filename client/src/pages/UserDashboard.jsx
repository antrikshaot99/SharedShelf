import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

/* =========================
   GraphQL Query
========================= */
const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      genre
      price
      rent_price
      owner_id
    }
  }
`;

export default function UserDashboard() {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const { cart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [mode, setMode] = useState("buy");
  const currentUserId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  if (loading) return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--ink-50)" 
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-600)" }}>Loading books...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--ink-50)" 
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--accent-red)" }}>Error loading books</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink-50)" }}>
      {/* ===== NAVBAR ===== */}
      <div style={{
        background: "white",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "var(--shadow-sm)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: "1px solid var(--ink-100)",
      }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          <Logo size="md" variant="full" />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Mode Toggle */}
          <div style={{
            display: "flex",
            gap: 4,
            padding: 4,
            background: "var(--ink-100)",
            borderRadius: "var(--radius-md)",
          }}>
            <button onClick={() => setMode("buy")} style={{
              padding: "8px 20px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background: mode === "buy" ? "var(--gradient-primary)" : "transparent",
              color: mode === "buy" ? "white" : "var(--ink-600)",
              boxShadow: mode === "buy" ? "var(--shadow-sm)" : "none",
            }}>Buy</button>
            <button onClick={() => setMode("rent")} style={{
              padding: "8px 20px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background: mode === "rent" ? "var(--gradient-primary)" : "transparent",
              color: mode === "rent" ? "white" : "var(--ink-600)",
              boxShadow: mode === "rent" ? "var(--shadow-sm)" : "none",
            }}>Rent</button>
          </div>

          <div style={{ width: 1, height: 28, background: "var(--ink-200)", margin: "0 4px" }} />

          <button onClick={() => navigate("/sell")} style={{
            padding: "9px 18px",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--ink-200)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            background: "white",
            color: "var(--ink-700)",
          }}>+ Sell Book</button>

          <button onClick={() => navigate("/orders")} style={{
            padding: "9px 18px",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--ink-200)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            background: "white",
            color: "var(--ink-700)",
          }}>📦 Orders</button>

          <button onClick={() => navigate("/cart")} style={{
            padding: "9px 18px",
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            background: "var(--accent-green)",
            color: "white",
            boxShadow: "0 2px 6px rgba(16, 185, 129, 0.25)",
          }}>🛒 Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</button>

          <button onClick={handleLogout} style={{
            padding: "9px 18px",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--ink-200)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            background: "white",
            color: "var(--ink-600)",
          }}>Logout</button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        {/* ===== SIDEBAR ===== */}
        <div style={{
          width: 260,
          background: "white",
          padding: "32px 20px",
          borderRight: "1px solid var(--ink-100)",
          boxShadow: "var(--shadow-sm)",
        }}>
          <h3 style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-500)",
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginBottom: 20,
          }}>Browse by Genre</h3>

          {["All","Fiction","Non-fiction","Sci-Fi","Romance","Mystery","Fantasy","Biography"].map((g) => (
            <button key={g} onClick={() => setSelectedGenre(g)} style={{
              display: "block",
              width: "100%",
              marginBottom: 6,
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: 600,
              fontSize: 14,
              background: selectedGenre === g ? "var(--primary-lighter)" : "transparent",
              color: selectedGenre === g ? "var(--primary-dark)" : "var(--ink-600)",
              transition: "all 0.15s ease",
            }} onMouseEnter={(e) => {
              if (selectedGenre !== g) {
                e.currentTarget.style.background = "var(--ink-50)";
              }
            }} onMouseLeave={(e) => {
              if (selectedGenre !== g) {
                e.currentTarget.style.background = "transparent";
              }
            }}>{g}</button>
          ))}
        </div>

        {/* ===== BOOK GRID ===== */}
        <div style={{ flex: 1, padding: "36px 40px", background: "var(--gradient-warm)" }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              fontFamily: "var(--font-display)",
              color: "var(--ink-950)",
              marginBottom: 8,
              letterSpacing: "-0.02em"
            }}>
              {selectedGenre === "All" ? "All Books" : selectedGenre}
            </h2>
            <p style={{ 
              fontSize: 15, 
              color: "var(--ink-500)" 
            }}>
              {mode === "buy" ? "Purchase your favorite books" : "Rent books for a limited time"}
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {(selectedGenre === "All"
              ? data.books
              : data.books.filter((b) => b.genre === selectedGenre)
            ).map((book) => (
              <div key={book.id} style={{
                background: "white",
                padding: 24,
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid var(--ink-100)",
                transition: "all 0.2s ease",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <div>
                  <div style={{
                    background: "var(--primary-lighter)",
                    borderRadius: "var(--radius-md)",
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                    marginBottom: 18,
                    border: "1px solid var(--ink-100)",
                  }}>📖</div>
                  <h3 style={{ 
                    fontSize: 17, 
                    fontWeight: 700, 
                    fontFamily: "var(--font-display)",
                    marginBottom: 6, 
                    color: "var(--ink-900)",
                    lineHeight: 1.3
                  }}>{book.title}</h3>
                  <p style={{ 
                    fontSize: 14, 
                    color: "var(--ink-500)", 
                    marginBottom: 12 
                  }}>{book.author}</p>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-xl)",
                    background: "var(--ink-100)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ink-600)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 14,
                  }}>{book.genre}</span>
                  <p style={{ 
                    fontWeight: 700, 
                    fontSize: 22,
                    fontFamily: "var(--font-display)",
                    color: "var(--primary)" 
                  }}>
                    {mode === "buy" ? `₹${book.price}` : `₹${book.rent_price}/mo`}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  {String(book.owner_id) !== String(currentUserId) ? (
                    <button onClick={() => addToCart(book)} style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                      background: "var(--gradient-primary)",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(201, 116, 86, 0.25)",
                    }}>Add to Cart</button>
                  ) : (
                    <span style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--ink-100)",
                      color: "var(--ink-500)",
                      fontWeight: 600,
                      fontSize: 14,
                    }}>Your Book</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}