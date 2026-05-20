const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const admin = require("firebase-admin");

require("dotenv").config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { UserService } = require("./services");

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'sharedshelf-34ac9'
  });
}

async function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => {

      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '').trim();

      let user = null;

      if (token === 'admin-test-token') {
        user = {
          id: 1,
          email: 'admin@gmail.com',
          role: 'admin'
        };
      }

      else if (token === 'user-test-token') {
        user = {
          id: 2,
          email: 'user@gmail.com',
          role: 'user'
        };
      }

      return { user };
    }
  }));

  return app;
}

module.exports = createApp;