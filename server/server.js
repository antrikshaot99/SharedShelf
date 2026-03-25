const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

require("dotenv").config();
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
require("./config/db");

// Initialize Sequelize models
const { sequelize } = require("./models");

const JWT_SECRET = process.env.JWT_SECRET || 'sharedshelf_secret_key_2026';

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Test database connection
  try {
    await sequelize.authenticate();
    console.log('✅ Database authenticated with Sequelize');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // GraphQL endpoint with authentication context
  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token, JWT_SECRET);
        } catch (err) {
          console.log('Invalid token');
        }
      }
      
      return { user };
    }
  }));

  app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000/graphql");
    console.log("📚 Shared Self GraphQL API ready");
  });
}

startServer();