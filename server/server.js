const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const admin = require("firebase-admin");

require("dotenv").config();
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { EmailService, UserService } = require("./services");
require("./config/db");

// Initialize Sequelize models and jwt and start server
const { sequelize } = require("./models");

// Initialize Firebase Admin
// For production, use service account key: admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'sharedshelf-34ac9' // Replace with your Firebase project ID
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
      console.log('🔍 GRAPHQL REQUEST RECEIVED');
      console.log('📋 Request headers:', Object.keys(req.headers));
      
      // Extract token from Authorization header
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '').trim();
      
      let user = null;
      
      // Debug logging
      if (!authHeader) {
        console.log('ℹ️ No authorization header provided');
      } else if (!token) {
        console.log('⚠️ Authorization header present but no token extracted:', authHeader);
      } else {
        console.log('🔐 Token received, attempting Firebase verification...');
      }
      
      if (token) {
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          console.log('✅ Firebase token verified for user:', decodedToken.email);
          
          // Find or create user in database
          const dbUser = await UserService.findOrCreateByFirebaseUid(
            decodedToken.uid,
            decodedToken.email,
            decodedToken.name
          );
          
          user = {
            id: dbUser.id,          // Integer ID from database (for foreign keys)
            uid: decodedToken.uid,   // Firebase UID (for reference)
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email,
            role: dbUser.role || 'user'
          };
          console.log('✅ Database user resolved:', user.email, '(id:', user.id + ')');
        } catch (err) {
          console.log('❌ Firebase token verification failed:', err.message);
        }
      }
      
      console.log('👤 Context user set to:', user ? user.email : 'null');
      return { user };
    }
  }));

  app.listen(5000, async () => {
    console.log("🚀 Server running on http://localhost:5000/graphql");
    console.log("📚 Shared Self GraphQL API ready");
    
    // Verify email service configuration
    try {
      await EmailService.verifyConnection();
      console.log("📧 Email service ready for sending notifications");
    } catch (error) {
      console.warn("⚠️ Email service verification failed - check .env configuration");
    }
  });
}

startServer();
