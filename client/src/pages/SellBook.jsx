import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_BOOK } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import Logo from "../components/Logo";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      genre
      price
      rent_price
    }
  }
`;

export default function SellBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addBook({
        variables: {
          title: form.title,
          author: form.author,
          genre: form.genre,
          price: parseFloat(form.price) || 0,
          rent_price: parseFloat(form.price) * 0.1 || 0,
          owner_id: localStorage.getItem("userId") || "1",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to add book: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genres = [
    { value: "Fiction", icon: "📖", color: "#6366f1" },
    { value: "Non-fiction", icon: "📚", color: "#06b6d4" },
    { value: "Sci-Fi", icon: "🚀", color: "#8b5cf6" },
    { value: "Romance", icon: "💕", color: "#ec4899" },
    { value: "Mystery", icon: "🔍", color: "#f59e0b" },
    { value: "Fantasy", icon: "🧙", color: "#10b981" },
    { value: "Biography", icon: "👤", color: "#6366f1" },
  ];

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
          ← Back to Shop
        </button>
      </div>

      {/* Content */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 480px", 
        minHeight: "calc(100vh - 64px)",
      }}>
        {/* Left Side - Info */}
        <div style={{
          background: "var(--gradient-primary)",
          padding: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              marginBottom: 32,
            }}>
              📚
            </div>
            <h1 style={{ 
              fontSize: 42, 
              fontWeight: 800,
              color: "white",
              marginBottom: 16,
              lineHeight: 1.2,
            }}>Share Your Books with the World</h1>
            <p style={{ 
              fontSize: 18, 
              color: "rgba(255,255,255,0.85)",
              marginBottom: 40,
              lineHeight: 1.7,
            }}>
              List your books for sale and connect with readers who'll treasure them just as you did.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "✓", title: "Quick Listing", desc: "Add your book in under 2 minutes" },
                { icon: "✓", title: "Set Your Price", desc: "You decide the selling price" },
                { icon: "✓", title: "Reach Readers", desc: "Connect with book lovers instantly" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "white", fontSize: 15, marginBottom: 2 }}>
                      {item.title}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          background: "white",
          padding: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <div style={{ maxWidth: 360 }}>
            <h2 style={{ 
              fontSize: 28, 
              fontWeight: 700,
              color: "var(--ink-900)",
              marginBottom: 8,
            }}>List Your Book</h2>
            <p style={{ 
              fontSize: 15, 
              color: "var(--ink-500)",
              marginBottom: 32,
            }}>Fill in the details to add your book</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-600)",
                }}>Book Title</label>
                <input
                  placeholder="The Great Gatsby"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1.5px solid var(--ink-200)",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-600)",
                }}>Author</label>
                <input
                  placeholder="F. Scott Fitzgerald"
                  required
                  value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1.5px solid var(--ink-200)",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-600)",
                }}>Genre</label>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: 8,
                }}>
                  {genres.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setForm({ ...form, genre: g.value })}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 10,
                        border: form.genre === g.value ? `2px solid ${g.color}` : "1.5px solid var(--ink-200)",
                        background: form.genre === g.value ? `${g.color}10` : "white",
                        color: form.genre === g.value ? g.color : "var(--ink-600)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>{g.icon}</span>
                      {g.value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-600)",
                }}>Price (₹)</label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ink-400)",
                    fontWeight: 600,
                    fontSize: 15,
                  }}>₹</span>
                  <input
                    placeholder="299"
                    required
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "14px 16px 14px 36px",
                      borderRadius: 12,
                      border: "1.5px solid var(--ink-200)",
                      fontSize: 15,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                {form.price && (
                  <p style={{ 
                    fontSize: 12, 
                    color: "var(--ink-500)", 
                    marginTop: 8,
                  }}>
                    Rent price will be ₹{Math.round(parseFloat(form.price) * 0.1 || 0)}/month
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !form.genre}
                style={{
                  padding: "16px",
                  fontSize: 15,
                  fontWeight: 600,
                  background: isSubmitting ? "var(--ink-300)" : "var(--gradient-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  marginTop: 8,
                  boxShadow: isSubmitting ? "none" : "var(--shadow-primary)",
                }}
              >
                {isSubmitting ? "Listing..." : "List Book for Sale"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
