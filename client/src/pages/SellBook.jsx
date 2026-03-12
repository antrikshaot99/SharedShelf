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

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert("🎉 Book added successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to add book: " + err.message);
    }
  };

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

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{
          background: "white", padding: "48px 42px", borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--ink-100)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📚</div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "var(--ink-950)",
              marginBottom: 8,
              letterSpacing: "-0.02em"
            }}>List Your Book</h1>
            <p style={{ fontSize: 15, color: "var(--ink-500)" }}>Share your books with our community</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-700)",
              }}>Book Title</label>
              <input
                placeholder="The Great Gatsby"
                required
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--ink-200)",
                  fontSize: 15,
                  outline: "none",
                  background: "var(--ink-50)",
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-700)",
              }}>Author</label>
              <input
                placeholder="F. Scott Fitzgerald"
                required
                onChange={e => setForm({ ...form, author: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--ink-200)",
                  fontSize: 15,
                  outline: "none",
                  background: "var(--ink-50)",
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-700)",
              }}>Genre</label>
              <select
                value={form.genre}
                required
                onChange={e => setForm({ ...form, genre: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--ink-200)",
                  fontSize: 15,
                  outline: "none",
                  background: "var(--ink-50)",
                  color: form.genre ? "var(--ink-900)" : "var(--ink-500)",
                }}
              >
                <option value="">Select a genre</option>
                {["Fiction", "Non-fiction", "Sci-Fi", "Romance", "Mystery", "Fantasy", "Biography"].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink-700)",
              }}>Price (₹)</label>
              <input
                placeholder="299"
                required
                type="number"
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--ink-200)",
                  fontSize: 15,
                  outline: "none",
                  background: "var(--ink-50)",
                }}
              />
            </div>

            <button type="submit" style={{
              padding: "14px", fontSize: 15, fontWeight: 600,
              background: "var(--gradient-primary)", color: "white", border: "none",
              borderRadius: "var(--radius-md)", cursor: "pointer", marginTop: 8,
              boxShadow: "0 4px 12px rgba(201, 116, 86, 0.25)",
            }}>List Book for Sale</button>
          </form>
        </div>
      </div>
    </div>
  );
}
