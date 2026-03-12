import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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

/* =========================
   Header Component
========================= */
const Header = ({ activeTab, setActiveTab, mode, setMode }) => {
  const tabs = ["Home", "Browse", "Genres", "New Arrivals", "Popular"];
  
  return (
    <div style={{
      background: "white",
      borderBottom: "1px solid var(--ink-200)",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 4,
        background: "var(--ink-100)",
        padding: 4,
        borderRadius: 50,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px",
              borderRadius: 50,
              border: "none",
              background: activeTab === tab ? "white" : "transparent",
              color: activeTab === tab ? "var(--ink-900)" : "var(--ink-600)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: activeTab === tab ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Mode Toggle */}
        <div style={{
          display: "flex",
          gap: 4,
          padding: 4,
          background: "var(--ink-100)",
          borderRadius: 12,
        }}>
          <button
            onClick={() => setMode("buy")}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background: mode === "buy" ? "var(--gradient-primary)" : "transparent",
              color: mode === "buy" ? "white" : "var(--ink-600)",
              boxShadow: mode === "buy" ? "var(--shadow-primary)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("rent")}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background: mode === "rent" ? "var(--gradient-primary)" : "transparent",
              color: mode === "rent" ? "white" : "var(--ink-600)",
              boxShadow: mode === "rent" ? "var(--shadow-primary)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            Rent
          </button>
        </div>

        {/* Notifications */}
        <button style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          border: "1px solid var(--ink-200)",
          background: "white",
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          🔔
          <span style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--accent-red)",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>5</span>
        </button>
      </div>
    </div>
  );
};

/* =========================
   Hero Banner
========================= */
const HeroBanner = () => (
  <div style={{
    background: "var(--gradient-hero)",
    borderRadius: 20,
    padding: "32px 40px",
    position: "relative",
    overflow: "hidden",
    color: "white",
    marginBottom: 32,
  }}>
    <div style={{
      position: "absolute",
      top: "-50%",
      right: "-10%",
      width: 300,
      height: 300,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.1)",
    }} />
    <div style={{
      position: "absolute",
      bottom: "-30%",
      right: "20%",
      width: 150,
      height: 150,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
    }} />
    
    <div style={{ position: "relative", zIndex: 1 }}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        background: "rgba(255,255,255,0.2)",
        borderRadius: 50,
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 16,
      }}>
        ✨ Premium Member
      </span>
      <h1 style={{
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 8,
      }}>Welcome to BookNest</h1>
      <p style={{
        fontSize: 15,
        opacity: 0.9,
        marginBottom: 24,
        maxWidth: 400,
      }}>
        Discover your next favorite book from our vast collection.
        Buy, rent, or sell with ease.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button style={{
          padding: "12px 24px",
          borderRadius: 12,
          border: "none",
          background: "white",
          color: "var(--primary)",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          Explore Books
        </button>
        <button style={{
          padding: "12px 24px",
          borderRadius: 12,
          border: "2px solid rgba(255,255,255,0.3)",
          background: "transparent",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          Take a Tour
        </button>
      </div>
    </div>
  </div>
);

/* =========================
   Book Card
========================= */
const BookCard = ({ book, mode, onAddToCart, isOwner }) => {
  const genreColors = {
    Fiction: { bg: "#eef2ff", icon: "📖" },
    "Non-fiction": { bg: "#ecfdf5", icon: "📚" },
    "Sci-Fi": { bg: "#fef3c7", icon: "🚀" },
    Romance: { bg: "#fce7f3", icon: "💕" },
    Mystery: { bg: "#f3e8ff", icon: "🔍" },
    Fantasy: { bg: "#e0f2fe", icon: "🏰" },
    Biography: { bg: "#fef2f2", icon: "👤" },
    default: { bg: "#f1f5f9", icon: "📗" },
  };

  const { bg, icon } = genreColors[book.genre] || genreColors.default;

  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 24,
        border: "1px solid var(--ink-200)",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--ink-200)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
      }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
        }}>
          {icon}
        </div>
        <button style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 20,
          color: "var(--ink-400)",
        }}>
          ☆
        </button>
      </div>

      {/* Content */}
      <h3 style={{
        fontSize: 16,
        fontWeight: 700,
        color: "var(--ink-900)",
        marginBottom: 4,
        lineHeight: 1.3,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {book.title}
      </h3>
      <p style={{
        fontSize: 13,
        color: "var(--ink-500)",
        marginBottom: 12,
      }}>
        by {book.author}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <span style={{
          padding: "4px 10px",
          borderRadius: 50,
          background: "var(--ink-100)",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--ink-600)",
        }}>
          {book.genre}
        </span>
        {mode === "rent" && (
          <span style={{
            padding: "4px 10px",
            borderRadius: 50,
            background: "var(--primary-lighter)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--primary)",
          }}>
            Rental
          </span>
        )}
      </div>

      {/* Price & Action */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--ink-900)",
          }}>
            ₹{mode === "buy" ? book.price : book.rent_price}
          </div>
          <div style={{
            fontSize: 11,
            color: "var(--ink-500)",
          }}>
            {mode === "rent" ? "per month" : "one-time"}
          </div>
        </div>
        
        {isOwner ? (
          <span style={{
            padding: "10px 20px",
            borderRadius: 12,
            background: "var(--ink-100)",
            color: "var(--ink-500)",
            fontSize: 13,
            fontWeight: 600,
          }}>
            Your Book
          </span>
        ) : (
          <button
            onClick={() => onAddToCart(book)}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              background: "var(--gradient-primary)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-primary)",
              transition: "all 0.15s ease",
            }}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================
   Main Component
========================= */
export default function UserDashboard() {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [mode, setMode] = useState("buy");
  const [activeTab, setActiveTab] = useState("Home");
  const currentUserId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const genres = ["All", "Fiction", "Non-fiction", "Sci-Fi", "Romance", "Mystery", "Fantasy", "Biography"];

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink-100)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid var(--ink-200)",
            borderTopColor: "var(--primary)",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-600)" }}>Loading books...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink-100)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--accent-red)" }}>Error loading books</div>
        </div>
      </div>
    );
  }

  const filteredBooks = selectedGenre === "All"
    ? data.books
    : data.books.filter((b) => b.genre === selectedGenre);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--ink-100)" }}>
      {/* Sidebar */}
      <Sidebar userName={userName} onLogout={handleLogout} />

      {/* Main Content */}
      <div style={{ marginLeft: 260, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mode={mode}
          setMode={setMode}
        />

        {/* Content Area */}
        <div style={{ padding: 32, flex: 1 }}>
          {/* Hero Banner */}
          <HeroBanner />

          {/* Genre Filter */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--ink-900)",
              }}>
                {selectedGenre === "All" ? "All Books" : selectedGenre}
              </h2>
              <span style={{
                fontSize: 14,
                color: "var(--primary)",
                fontWeight: 600,
                cursor: "pointer",
              }}>
                View All
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 50,
                    border: "none",
                    background: selectedGenre === genre ? "var(--gradient-primary)" : "white",
                    color: selectedGenre === genre ? "white" : "var(--ink-700)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: selectedGenre === genre ? "var(--shadow-primary)" : "var(--shadow-card)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                mode={mode}
                onAddToCart={addToCart}
                isOwner={String(book.owner_id) === String(currentUserId)}
              />
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: 60,
              background: "white",
              borderRadius: 20,
              border: "1px solid var(--ink-200)",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-900)", marginBottom: 8 }}>
                No books found
              </h3>
              <p style={{ fontSize: 14, color: "var(--ink-500)" }}>
                Try selecting a different genre
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
