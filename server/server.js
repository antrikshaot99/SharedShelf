const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const admin = require("firebase-admin");

require("dotenv").config();
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
require("./config/db");

// Initialize Sequelize models and jwt and start server
const { sequelize } = require("./models");

// Initialize Firebase Admin
// For production, use service account key: admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id' // Replace with your Firebase project ID
});

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
          const decodedToken = await admin.auth().verifyIdToken(token);
          user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email,
            role: 'user' // Default role, can be customized with custom claims
          };
        } catch (err) {
          console.log('Invalid Firebase token:', err.message);
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
