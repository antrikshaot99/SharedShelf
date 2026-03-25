import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_MY_RENTALS } from "../graphql/queries";
import { RETURN_RENTAL } from "../graphql/mutations";
import Logo from "../components/Logo";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(status) {
  switch (status) {
    case "active":   return { bg: "#ecfdf5", color: "#16a34a" };
    case "returned": return { bg: "#f3f4f6", color: "#6b7280" };
    case "overdue":  return { bg: "#fef2f2", color: "#dc2626" };
    default:         return { bg: "#f3f4f6", color: "#6b7280" };
  }
}

export default function Rentals() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(GET_MY_RENTALS, {
    fetchPolicy: "network-only",
  });
  const [returnRentalMutation, { loading: isReturning }] = useMutation(RETURN_RENTAL);

  const rentals = data?.myRentals || [];
  const activeRentals = rentals.filter((r) => r.status === "active");
  const returnedRentals = rentals.filter((r) => r.status === "returned");
  const overdueRentals = rentals.filter((r) => r.status === "overdue");

  const handleReturn = async (id) => {
    if (!window.confirm("Mark this rental as returned?")) return;
    try {
      await returnRentalMutation({ variables: { id } });
      refetch();
    } catch (err) {
      alert("Failed to return: " + err.message);
    }
  };

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
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "var(--ink-900)", marginBottom: 8 }}>
            My Rentals
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-500)" }}>
            Books you have rented — active, overdue, and returned
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {[
            { label: "Active", value: activeRentals.length, color: "#16a34a", bg: "#ecfdf5" },
            { label: "Overdue", value: overdueRentals.length, color: "#dc2626", bg: "#fef2f2" },
            { label: "Returned", value: returnedRentals.length, color: "#6b7280", bg: "#f3f4f6" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--ink-200)",
            }}>
              <div style={{ fontSize: 14, color: "var(--ink-500)", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--ink-500)" }}>
            Loading your rentals…
          </div>
        )}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12,
            padding: 20, color: "#dc2626", marginBottom: 24,
          }}>
            Failed to load rentals: {error.message}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && rentals.length === 0 && (
          <div style={{
            background: "white", borderRadius: 20, padding: 80,
            textAlign: "center", border: "1px solid var(--ink-200)",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: "var(--primary-lighter)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 40, margin: "0 auto 24px",
            }}>📖</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-900)", marginBottom: 8 }}>
              No rentals yet
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-500)", marginBottom: 32 }}>
              Switch to Rent mode on the dashboard to rent books
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "14px 32px", borderRadius: 12, border: "none",
                background: "var(--gradient-primary)", color: "white",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                boxShadow: "var(--shadow-primary)",
              }}
            >
              Browse Books
            </button>
          </div>
        )}

        {/* Rental Cards */}
        {!loading && rentals.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rentals.map((rental) => {
              const { bg, color } = statusColor(rental.status);
              const isOverdue = rental.status === "overdue";
              return (
                <div key={rental.id} style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 24,
                  border: `1px solid ${isOverdue ? "#fecaca" : "var(--ink-200)"}`,
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}>
                  {/* Book Cover Placeholder */}
                  <div style={{
                    width: 56, height: 72, borderRadius: 8, flexShrink: 0,
                    background: rental.book?.coverImage
                      ? `url(${rental.book.coverImage}) center/cover`
                      : "var(--gradient-primary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24,
                  }}>
                    {!rental.book?.coverImage && "📚"}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)", margin: 0 }}>
                        {rental.book?.title || "Unknown Book"}
                      </h3>
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 11,
                        fontWeight: 700, background: bg, color,
                      }}>
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "0 0 12px" }}>
                      {rental.book?.author || ""}
                    </p>
                    <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--ink-600)" }}>
                      <div><span style={{ fontWeight: 600 }}>Rented: </span>{formatDate(rental.startDate)}</div>
                      <div><span style={{ fontWeight: 600 }}>Due: </span>
                        <span style={{ color: isOverdue ? "#dc2626" : "inherit" }}>
                          {formatDate(rental.dueDate)}
                        </span>
                      </div>
                      {rental.returnDate && (
                        <div><span style={{ fontWeight: 600 }}>Returned: </span>{formatDate(rental.returnDate)}</div>
                      )}
                    </div>
                  </div>

                  {/* Price + Action */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)", marginBottom: 8 }}>
                      ₹{Number(rental.rentalPrice).toFixed(2)}
                    </div>
                    {rental.status === "active" && (
                      <button
                        onClick={() => handleReturn(rental.id)}
                        disabled={isReturning}
                        style={{
                          padding: "8px 16px", borderRadius: 10, border: "1.5px solid var(--ink-200)",
                          background: "white", color: "var(--ink-700)", fontSize: 13,
                          fontWeight: 600, cursor: isReturning ? "not-allowed" : "pointer",
                          opacity: isReturning ? 0.6 : 1,
                        }}
                      >
                        Return Book
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
