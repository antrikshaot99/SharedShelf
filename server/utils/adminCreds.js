require('dotenv').config();

module.exports = {
  email: process.env.ADMIN_EMAIL || "admin@gmail.com",
  password: process.env.ADMIN_PASSWORD || "admin123"
};