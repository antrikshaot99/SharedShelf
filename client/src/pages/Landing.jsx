import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={styles.container}>
      
      <h1 style={styles.title}>📚 BookNest</h1>

      <p style={styles.subtitle}>
        Buy • Rent • Sell your favorite books in one cozy place
      </p>

      <p style={styles.desc}>
        A joyful community for book lovers. Discover stories,
        share knowledge, and give books a second life.
      </p>

      <div style={styles.buttons}>
        <Link to="/login">
          <button style={styles.btn}>Login</button>
        </Link>

        <Link to="/register">
          <button style={styles.btnSecondary}>Register</button>
        </Link>
      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(to right, #f6d365, #fda085)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: "60px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "22px",
    marginTop: "10px",
  },
  desc: {
    maxWidth: "500px",
    marginTop: "20px",
  },
  buttons: {
    marginTop: "40px",
    display: "flex",
    gap: "20px",
  },
  btn: {
    padding: "12px 24px",
    fontSize: "16px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "12px 24px",
    fontSize: "16px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};