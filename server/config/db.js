const mysql = require("mysql2");
require("dotenv").config();

// Database configuration
const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "sharedshelf",
  connectionTimeout: 30000,
  waitForConnections: true,
  queueLimit: 0,
};

// Legacy MySQL2 connection (kept for backward compatibility)
const db = mysql.createConnection(config);

// Enhanced connection handling with retry logic
let connectionAttempts = 0;
const maxConnectionAttempts = 3;

const connectToDB = () => {
  db.connect(err => {
    if (err) {
      connectionAttempts++;
      console.error(`❌ Database Connection Failed (Attempt ${connectionAttempts}/${maxConnectionAttempts}):`, err.message);
      
      if (connectionAttempts < maxConnectionAttempts) {
        console.log(`⏳ Retrying database connection in 5 seconds...`);
        setTimeout(connectToDB, 5000);
      } else {
        console.error("❌ Max connection attempts reached. Please check your database configuration.");
        process.exit(1);
      }
      return;
    }
    console.log("✅ MySQL Connected Successfully");
    connectionAttempts = 0;
  });
};

// Handle connection errors after successful connection
db.on('error', (err) => {
  console.error('❌ Database Error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    console.log('⏳ Attempting to reconnect to database...');
    connectToDB();
  }
});

connectToDB();

// Export both connection and config
module.exports = {
  connection: db,
  config: config
};