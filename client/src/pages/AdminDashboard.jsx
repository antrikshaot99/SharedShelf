import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_STATS, GET_BOOKS, GET_USERS } from "../graphql/queries";
import { DELETE_BOOK, UPDATE_BOOK, UPDATE_USER_ROLE, DELETE_USER } from "../graphql/mutations";
import Logo from "../components/Logo";

/* ─── Design Tokens ─── */
const C = {
  primary: "var(--primary)", primaryLight: "var(--primary-lighter)", primaryDark: "var(--primary-dark)",
  purple: "#8b5cf6", purpleLight: "#f3e8ff",
  green: "var(--accent-green)", greenLight: "#ecfdf5",
  orange: "var(--accent-amber)", orangeLight: "#fffbeb",
  red: "var(--accent-red)", redLight: "#fef2f2",
  blue: "var(--accent-blue)", blueLight: "#eff6ff",
  cyan: "#06b6d4", cyanLight: "#ecfeff",
  dark: "var(--ink-950)", dark2: "var(--ink-900)", muted: "var(--ink-500)", muted2: "var(--ink-400)",
  cream: "var(--ink-100)", white: "white",
  border: "var(--ink-200)", borderLight: "var(--ink-100)",
};

const TABS = [
  { key: "Overview", icon: "📊", label: "Overview" },
  { key: "Books", icon: "📚", label: "Books" },
  { key: "Users", icon: "👥", label: "Users" },
  { key: "Orders", icon: "📦", label: "Orders" },
  { key: "Settings", icon: "⚙️", label: "Settings" },
];

/* ─── Shared Styles ─── */
const cardBase = {
  background: "white", borderRadius: "var(--radius-lg)", padding: 28,
  border: `1px solid ${C.borderLight}`,
  boxShadow: "var(--shadow-md)",
};

const inputBase = {
  padding: "10px 14px", borderRadius: "var(--radius-md)", border: `1.5px solid ${C.border}`,
  fontSize: 13, outline: "none", fontFamily: "var(--font-body)", transition: "border 0.2s",
  background: "white",
};

const Pill = ({ color, children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 20,
    fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
    background: color + "15", color,
  }}>{children}</span>
);

const Avatar = ({ name, color }) => (
  <div style={{
    width: 36, height: 36, borderRadius: 10, background: color + "18",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 800, color, flexShrink: 0,
  }}>
    {name?.charAt(0)?.toUpperCase() || "?"}
  </div>
);

const Loader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 80, gap: 8 }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, animation: "pulse 1s ease infinite" }} />
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, animation: "pulse 1s ease 0.2s infinite" }} />
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, animation: "pulse 1s ease 0.4s infinite" }} />
  </div>
);

const EmptyState = ({ icon, title, sub }) => (
  <div style={{ textAlign: "center", padding: "60px 20px" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 700, color: C.dark2, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, color: C.muted }}>{sub}</div>
  </div>
);

/* ─── ProgressBar ─── */
const ProgressBar = ({ value, max, color }) => (
  <div style={{ height: 6, borderRadius: 3, background: C.borderLight, overflow: "hidden", width: "100%" }}>
    <div style={{
      height: "100%", borderRadius: 3, background: color,
      width: max > 0 ? `${Math.min((value / max) * 100, 100)}%` : "0%",
      transition: "width 0.6s ease",
    }} />
  </div>
);

/* ════════════════════════════════════════════════
   OVERVIEW TAB
   ════════════════════════════════════════════════ */
function OverviewTab() {
  const { data, loading } = useQuery(GET_STATS);
  const { data: booksData } = useQuery(GET_BOOKS);
  const { data: usersData } = useQuery(GET_USERS);

  const stats = data?.stats || {};
  const allBooks = booksData?.books || [];
  const allUsers = usersData?.users || [];
  const recentBooks = allBooks.slice(-5).reverse();
  const recentUsers = allUsers.slice(-5).reverse();
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  // Genre breakdown
  const genreMap = {};
  allBooks.forEach((b) => { genreMap[b.genre] = (genreMap[b.genre] || 0) + 1; });
  const genreEntries = Object.entries(genreMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const genreColors = [C.primary, C.purple, C.green, C.orange, C.blue, C.red];

  const statCards = [
    { label: "Total Users", value: stats.totalUsers ?? 0, icon: "👥", color: C.purple, bg: C.purpleLight, sub: "Registered accounts" },
    { label: "Total Books", value: stats.totalBooks ?? 0, icon: "📚", color: C.primary, bg: C.primaryLight, sub: "Listed on platform" },
    { label: "Genres", value: stats.totalGenres ?? 0, icon: "🏷️", color: C.green, bg: C.greenLight, sub: "Unique categories" },
    { label: "Orders", value: orders.length, icon: "📦", color: C.orange, bg: C.orangeLight, sub: "Total placed" },
  ];

  if (loading) return <Loader />;

  // Revenue estimate
  const totalRevenue = orders.reduce((sum, o) => {
    const items = Array.isArray(o.items || o) ? (o.items || o) : [o.items || o];
    return sum + items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  }, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome Banner */}
      <div style={{
        ...cardBase, padding: "32px 36px",
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
        border: "none", color: C.white, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.1 }}>📚</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>Welcome back, Admin</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>BookNest Dashboard</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            {allBooks.length} books listed &bull; {allUsers.length} users registered &bull; ₹{totalRevenue.toFixed(0)} revenue
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ ...cardBase, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.dark2, lineHeight: 1 }}>{s.value}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: C.muted2, marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Genre Breakdown */}
        <div style={cardBase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>Genre Breakdown</h3>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{genreEntries.length} genres</span>
          </div>
          {genreEntries.length === 0
            ? <div style={{ color: C.muted, fontSize: 13, padding: 20, textAlign: "center" }}>No books yet</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {genreEntries.map(([genre, count], i) => (
                  <div key={genre}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.dark2 }}>{genre}</span>
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{count} books</span>
                    </div>
                    <ProgressBar value={count} max={allBooks.length} color={genreColors[i % genreColors.length]} />
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Quick Stats */}
        <div style={cardBase}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.dark2, marginBottom: 20 }}>Quick Stats</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Available Books", value: allBooks.filter(b => !b.status || b.status === "available").length, icon: "✅", color: C.green },
              { label: "Rented Books", value: allBooks.filter(b => b.status === "rented").length, icon: "🔄", color: C.orange },
              { label: "Sold Books", value: allBooks.filter(b => b.status === "sold").length, icon: "💰", color: C.red },
              { label: "Admin Users", value: allUsers.filter(u => u.role === "admin").length, icon: "👑", color: C.purple },
              { label: "Est. Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: "💵", color: C.green },
            ].map((s) => (
              <div key={s.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", borderRadius: 10, background: C.cream,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.dark2 }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Books */}
        <div style={cardBase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>Recent Books</h3>
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: C.primaryLight, color: C.primary, fontWeight: 700 }}>
              Latest {recentBooks.length}
            </span>
          </div>
          {recentBooks.length === 0
            ? <EmptyState icon="📚" title="No books yet" sub="Books will appear here" />
            : <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentBooks.map((b) => (
                  <div key={b.id} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "10px 12px",
                    borderRadius: 10, transition: "background 0.15s", cursor: "default",
                  }} onMouseEnter={e => e.currentTarget.style.background = C.cream}
                     onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: C.primaryLight,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                    }}>📖</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.dark2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{b.author}</div>
                    </div>
                    <Pill color={C.primary}>{b.genre}</Pill>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Recent Users */}
        <div style={cardBase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>Recent Users</h3>
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: C.purpleLight, color: C.purple, fontWeight: 700 }}>
              Latest {recentUsers.length}
            </span>
          </div>
          {recentUsers.length === 0
            ? <EmptyState icon="👥" title="No users yet" sub="Users will appear here" />
            : <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentUsers.map((u) => (
                  <div key={u.id} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "10px 12px",
                    borderRadius: 10, transition: "background 0.15s",
                  }} onMouseEnter={e => e.currentTarget.style.background = C.cream}
                     onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <Avatar name={u.name} color={u.role === "admin" ? C.purple : C.blue} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.dark2 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{u.email}</div>
                    </div>
                    <Pill color={u.role === "admin" ? C.purple : C.green}>{u.role}</Pill>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   BOOKS TAB
   ════════════════════════════════════════════════ */
function BooksTab() {
  const { data, loading, refetch } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [updateBook] = useMutation(UPDATE_BOOK);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const books = (data?.books || []).filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book permanently?")) return;
    await deleteBook({ variables: { id } });
    refetch();
  };

  const startEdit = (b) => {
    setEditId(b.id);
    setEditFields({ title: b.title, author: b.author, genre: b.genre, price: b.price || "", rent_price: b.rent_price || "", status: b.status || "available" });
  };

  const saveEdit = async () => {
    await updateBook({
      variables: {
        id: editId, ...editFields,
        price: editFields.price ? parseFloat(editFields.price) : null,
        rent_price: editFields.rent_price ? parseFloat(editFields.rent_price) : null,
      },
    });
    setEditId(null);
    refetch();
  };

  const statusColor = (s) => s === "available" ? C.green : s === "rented" ? C.orange : C.red;

  if (loading) return <Loader />;

  const editInput = (field, type = "text", w = "100%") => (
    <input type={type} value={editFields[field]}
      onChange={(e) => setEditFields({ ...editFields, [field]: e.target.value })}
      style={{ ...inputBase, width: w, padding: "6px 10px", fontSize: 13 }} />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header bar */}
      <div style={{ ...cardBase, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>📚</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>Book Management</div>
            <div style={{ fontSize: 12, color: C.muted }}>{books.length} books found</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted2 }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..."
            style={{ ...inputBase, width: 260, paddingLeft: 36 }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
        {books.length === 0
          ? <EmptyState icon="📚" title="No books found" sub="Try a different search term" />
          : <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.cream }}>
                    {["Book", "Genre", "Price", "Rent", "Status", "Actions"].map((h) => (
                      <th key={h} style={{
                        textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 800,
                        color: C.muted, textTransform: "uppercase", letterSpacing: 0.8,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) =>
                    editId === b.id ? (
                      <tr key={b.id} style={{ background: C.primaryLight + "60" }}>
                        <td style={{ padding: "12px 18px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {editInput("title")}
                            {editInput("author")}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>{editInput("genre", "text", 100)}</td>
                        <td style={{ padding: "12px 14px" }}>{editInput("price", "number", 80)}</td>
                        <td style={{ padding: "12px 14px" }}>{editInput("rent_price", "number", 80)}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <select value={editFields.status}
                            onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                            style={{ ...inputBase, padding: "6px 10px", fontSize: 13 }}>
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="sold">Sold</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={saveEdit} style={{
                              padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                              fontSize: 12, fontWeight: 700, background: C.green, color: C.white,
                            }}>Save</button>
                            <button onClick={() => setEditId(null)} style={{
                              padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`,
                              cursor: "pointer", fontSize: 12, fontWeight: 700, background: C.white, color: C.dark2,
                            }}>Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${C.borderLight}`, transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = C.cream}
                        onMouseLeave={(e) => e.currentTarget.style.background = C.white}>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 10, background: C.primaryLight,
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
                            }}>📖</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark2 }}>{b.title}</div>
                              <div style={{ fontSize: 11, color: C.muted }}>{b.author}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px" }}><Pill color={C.primary}>{b.genre}</Pill></td>
                        <td style={{ padding: "14px", fontSize: 13, fontWeight: 700, color: C.dark2 }}>{b.price ? `₹${b.price}` : "—"}</td>
                        <td style={{ padding: "14px", fontSize: 13, fontWeight: 600, color: C.muted }}>{b.rent_price ? `₹${b.rent_price}` : "—"}</td>
                        <td style={{ padding: "14px" }}><Pill color={statusColor(b.status || "available")}>{b.status || "available"}</Pill></td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => startEdit(b)} style={{
                              padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                              fontSize: 12, fontWeight: 700, background: C.primaryLight, color: C.primary,
                              transition: "all 0.15s",
                            }}>Edit</button>
                            <button onClick={() => handleDelete(b.id)} style={{
                              padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                              fontSize: 12, fontWeight: 700, background: C.redLight, color: C.red,
                              transition: "all 0.15s",
                            }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   USERS TAB
   ════════════════════════════════════════════════ */
function UsersTab() {
  const { data, loading, refetch } = useQuery(GET_USERS);
  const [updateRole] = useMutation(UPDATE_USER_ROLE);
  const [deleteUser] = useMutation(DELETE_USER);
  const [search, setSearch] = useState("");

  const users = (data?.users || []).filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleToggle = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Change ${u.name}'s role to ${newRole}?`)) return;
    await updateRole({ variables: { id: u.id, role: newRole } });
    refetch();
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user ${u.name}? This cannot be undone.`)) return;
    await deleteUser({ variables: { id: u.id } });
    refetch();
  };

  if (loading) return <Loader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ ...cardBase, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>👥</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>User Management</div>
            <div style={{ fontSize: 12, color: C.muted }}>{users.length} users found</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: C.muted2 }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            style={{ ...inputBase, width: 260, paddingLeft: 36 }} />
        </div>
      </div>

      {/* User Cards Grid */}
      {users.length === 0
        ? <div style={cardBase}><EmptyState icon="👥" title="No users found" sub="Try a different search" /></div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {users.map((u) => (
              <div key={u.id} style={{
                ...cardBase, padding: "20px 22px",
                display: "flex", flexDirection: "column", gap: 16,
                transition: "box-shadow 0.2s, transform 0.2s",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = cardBase.boxShadow;
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar name={u.name} color={u.role === "admin" ? C.purple : C.blue} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.dark2 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{u.email}</div>
                  </div>
                  <Pill color={u.role === "admin" ? C.purple : C.green}>{u.role}</Pill>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleRoleToggle(u)} style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 700,
                    background: u.role === "admin" ? C.greenLight : C.purpleLight,
                    color: u.role === "admin" ? C.green : C.purple,
                    transition: "opacity 0.15s",
                  }}>{u.role === "admin" ? "↓ Make User" : "↑ Make Admin"}</button>
                  <button onClick={() => handleDelete(u)} style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, background: C.redLight, color: C.red,
                    transition: "opacity 0.15s",
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

/* ════════════════════════════════════════════════
   ORDERS TAB
   ════════════════════════════════════════════════ */
function OrdersTab() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  const totalRevenue = orders.reduce((sum, o) => {
    const items = Array.isArray(o.items || o) ? (o.items || o) : [o.items || o];
    return sum + items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  }, 0);
  const totalItems = orders.reduce((sum, o) => {
    const items = Array.isArray(o.items || o) ? (o.items || o) : [o.items || o];
    return sum + items.reduce((s, i) => s + (i.quantity || 1), 0);
  }, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total Orders", value: orders.length, icon: "📦", color: C.primary, bg: C.primaryLight },
          { label: "Items Sold", value: totalItems, icon: "📚", color: C.purple, bg: C.purpleLight },
          { label: "Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: "💰", color: C.green, bg: C.greenLight },
        ].map((s) => (
          <div key={s.label} style={{ ...cardBase, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.dark2 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Order List */}
      <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>Order History</div>
        </div>
        {orders.length === 0
          ? <EmptyState icon="📦" title="No orders yet" sub="Orders will appear here when placed" />
          : <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.cream }}>
                    {["#", "Items", "Qty", "Total", "Status"].map((h) => (
                      <th key={h} style={{
                        textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 800,
                        color: C.muted, textTransform: "uppercase", letterSpacing: 0.8,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => {
                    const items = Array.isArray(order.items || order) ? (order.items || order) : [order.items || order];
                    const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
                    const qty = items.reduce((s, it) => s + (it.quantity || 1), 0);
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}`, transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = C.cream}
                        onMouseLeave={(e) => e.currentTarget.style.background = C.white}>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: C.muted, background: C.cream, padding: "4px 10px", borderRadius: 6 }}>#{i + 1}</span>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          {items.map((it, j) => (
                            <div key={j} style={{ fontSize: 13, marginBottom: j < items.length - 1 ? 4 : 0 }}>
                              <span style={{ fontWeight: 700, color: C.dark2 }}>{it.title}</span>
                              <span style={{ color: C.muted }}> — {it.author}</span>
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: "14px", fontSize: 13, fontWeight: 700, color: C.dark2 }}>{qty}</td>
                        <td style={{ padding: "14px", fontSize: 14, fontWeight: 800, color: C.primary }}>₹{total.toFixed(2)}</td>
                        <td style={{ padding: "14px" }}><Pill color={C.green}>Completed</Pill></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SETTINGS TAB
   ════════════════════════════════════════════════ */
function SettingsTab() {
  const [siteName, setSiteName] = useState("BookNest");
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* General */}
      <div style={cardBase}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{ fontSize: 20 }}>⚙️</span>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>General Settings</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>Site Name</label>
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)} style={{ ...inputBase, width: "100%" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>Admin Email</label>
            <input value="admin@booknest.com" readOnly style={{ ...inputBase, width: "100%", background: C.cream, color: C.muted }} />
          </div>
          <button onClick={save} style={{
            padding: "11px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 700, alignSelf: "flex-start",
            background: saved ? C.green : C.primary, color: C.white,
            transition: "all 0.2s",
          }}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Platform Info */}
      <div style={cardBase}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.dark2 }}>Platform Info</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            ["Platform", "BookNest v1.0", "🏠"],
            ["Backend", "GraphQL + MySQL", "⚡"],
            ["Frontend", "React + Vite", "💜"],
            ["Auth", "Local credentials", "🔐"],
          ].map(([k, v, icon]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 14px", borderRadius: 10, transition: "background 0.15s",
            }} onMouseEnter={e => e.currentTarget.style.background = C.cream}
               onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{k}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.dark2 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ ...cardBase, border: `1.5px solid ${C.red}30`, gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: C.red }}>Danger Zone</h3>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 10, background: C.redLight }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark2 }}>Clear All Orders</div>
            <div style={{ fontSize: 12, color: C.muted }}>Remove all order history from localStorage</div>
          </div>
          <button onClick={() => {
            if (window.confirm("Clear all orders? This cannot be undone.")) {
              localStorage.removeItem("orders");
              window.location.reload();
            }
          }} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 700, background: C.red, color: C.white,
          }}>Clear Orders</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN DASHBOARD LAYOUT
   ════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const tabContent = {
    Overview: <OverviewTab />, Books: <BooksTab />, Users: <UsersTab />,
    Orders: <OrdersTab />, Settings: <SettingsTab />,
  };

  const tabDesc = {
    Overview: "Platform analytics and quick insights",
    Books: "Manage all books in the marketplace",
    Users: "Manage registered users and roles",
    Orders: "View all placed orders and revenue",
    Settings: "Configure platform settings",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.cream, fontFamily: "var(--font-body)" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, background: "white", borderRight: `1px solid ${C.borderLight}`,
        display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
        boxShadow: "var(--shadow-sm)",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 22px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
          <Logo size="md" variant="full" />
          <div style={{ 
            fontSize: 10, 
            fontWeight: 700, 
            color: C.muted, 
            textTransform: "uppercase", 
            letterSpacing: 1,
            marginTop: 8,
            paddingLeft: 50
          }}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                borderRadius: "var(--radius-md)", border: "none", cursor: "pointer", width: "100%",
                fontSize: 13, fontWeight: active ? 700 : 600, textAlign: "left",
                background: active ? C.primaryLight : "transparent",
                color: active ? C.primary : C.muted,
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${C.borderLight}` }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            borderRadius: 10, background: C.cream,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${C.purple}, #8b83ff)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: C.white,
            }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.dark2 }}>Admin</div>
              <div style={{ fontSize: 10, color: C.muted }}>admin@booknest</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 8,
            border: `1.5px solid ${C.border}`, cursor: "pointer",
            fontSize: 12, fontWeight: 700, background: C.white, color: C.muted,
            transition: "all 0.15s",
          }}>Logout</button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, marginLeft: 240 }}>
        {/* Top Bar */}
        <header style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          padding: "18px 36px", borderBottom: `1px solid ${C.borderLight}`,
          position: "sticky", top: 0, zIndex: 30,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div>
            <h1 style={{ 
              fontSize: 24, 
              fontWeight: 800, 
              fontFamily: "var(--font-display)",
              color: C.dark2, 
              margin: 0,
              letterSpacing: "-0.02em"
            }}>{activeTab}</h1>
            <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>{tabDesc[activeTab]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              padding: "6px 14px", borderRadius: 20, background: C.purpleLight,
              fontSize: 11, fontWeight: 700, color: C.purple,
            }}>👑 Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "28px 36px", maxWidth: 1200 }}>
          {tabContent[activeTab]}
        </div>
      </main>

      {/* Keyframe for loader */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
