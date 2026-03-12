const mysql = require("mysql2");

// Database configuration
const config = {
  host: "localhost",
  user: "root",
  password: "Ananya@26",
  database: "booknest",
};

// Legacy MySQL2 connection (kept for backward compatibility)
const db = mysql.createConnection(config);

db.connect(err => {
  if (err) {
    console.error("DB Connection Failed:", err);
    return;
  }
  console.log("MySQL Connected ✅");
});

// Export both connection and config
module.exports = {
  connection: db,
  config: config
};