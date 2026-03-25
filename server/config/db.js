const mysql = require("mysql2");
require("dotenv").config();

// Database configuration
const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "booknest",
};

// Legacy MySQL2 connection (kept for backward compatibility)
const db = mysql.createConnection(config);

db.connect(err => {
  if (err) {
    console.error("DB Connection Failed:", err);
    return;
  }
  console.log("MySQL Connected");
});

// Export both connection and config
module.exports = {
  connection: db,
  config: config
};