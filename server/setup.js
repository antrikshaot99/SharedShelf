const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  try {
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
    });

    console.log('✅ Connected to MySQL server');

    const dbName = process.env.DB_NAME || 'sharedshelf';

    // Check if database exists
    const [databases] = await connection.query(`SHOW DATABASES LIKE '${dbName}'`);

    if (databases.length === 0) {
      // Create database if it doesn't exist
      await connection.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`✅ Database '${dbName}' already exists`);
    }

    // Close connection
    await connection.end();
    console.log('✨ Database setup complete!\n');
    console.log('🚀 You can now run: npm start');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\n⚠️  Make sure:');
    console.error('1. MySQL is running');
    console.error('2. Root password is correct (currently set to: ' + (process.env.DB_PASSWORD || 'root') + ')');
    console.error('3. Check your .env file in the server directory');
    process.exit(1);
  }
}

setupDatabase();
