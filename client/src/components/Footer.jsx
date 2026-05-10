export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      background: "white",
      borderTop: "1px solid var(--ink-200)",
      padding: "32px 48px",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 32,
        marginBottom: 32,
      }}>
        {/* About */}
        <div>
          <h4 style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink-900)",
            marginBottom: 12,
          }}>About</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                About SharedShelf
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                How it works
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Browse */}
        <div>
          <h4 style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink-900)",
            marginBottom: 12,
          }}>Browse</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Browse Books
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Rent Books
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Sell Books
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink-900)",
            marginBottom: 12,
          }}>Support</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                FAQ
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Help Center
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink-900)",
            marginBottom: 12,
          }}>Legal</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: 8 }}>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" style={{
                fontSize: 13,
                color: "var(--ink-600)",
                textDecoration: "none",
                transition: "color 0.2s",
              }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-600)"}>
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        borderTop: "1px solid var(--ink-200)",
        paddingTop: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <p style={{
          fontSize: 13,
          color: "var(--ink-500)",
          margin: 0,
        }}>
          © {currentYear} SharedShelf. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="#" style={{
            fontSize: 13,
            color: "var(--ink-500)",
            textDecoration: "none",
            transition: "color 0.2s",
          }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-500)"}>
            Twitter
          </a>
          <a href="#" style={{
            fontSize: 13,
            color: "var(--ink-500)",
            textDecoration: "none",
            transition: "color 0.2s",
          }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-500)"}>
            Facebook
          </a>
          <a href="#" style={{
            fontSize: 13,
            color: "var(--ink-500)",
            textDecoration: "none",
            transition: "color 0.2s",
          }} onMouseEnter={(e) => e.target.style.color = "var(--ink-900)"} onMouseLeave={(e) => e.target.style.color = "var(--ink-500)"}>
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
