// Import core React libraries
import React from "react";
import ReactDOM from "react-dom/client";

// Import main App component
import App from "./App.jsx";

// Import Context Providers (global state management)
import { AuthProvider } from "./context/AuthContext";   // Handles authentication (login/logout, user)
import { OrderProvider } from "./context/OrderContext"; // Handles order-related state
import { CartProvider } from "./context/CartContext";   // Handles cart functionality

// Apollo Client imports (GraphQL client setup)
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

// Apollo Provider to wrap the app
import { ApolloProvider } from "@apollo/client/react";

// Global CSS files
import "./index.css";
import "./App.css";

/* ─────────────────────────────────────────────
   AUTH LINK (Middleware for GraphQL requests)
   ───────────────────────────────────────────── */

// This link runs BEFORE every GraphQL request
// It injects the JWT token into request headers
const authLink = new ApolloLink((operation, forward) => {

  // Get token from browser localStorage
  const token = localStorage.getItem('token');

  // Attach token to request headers
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '', // If token exists → send it
    }
  });

  // Pass request to next link (httpLink)
  return forward(operation);
});

/* ─────────────────────────────────────────────
   HTTP LINK (Backend connection)
   ───────────────────────────────────────────── */

// Defines the GraphQL server endpoint
const httpLink = new HttpLink({
  uri: "http://localhost:5000/graphql", // Your backend URL
});

/* ─────────────────────────────────────────────
   APOLLO CLIENT SETUP
   ───────────────────────────────────────────── */

// Create Apollo Client instance
const client = new ApolloClient({

  // Combine authLink + httpLink
  // authLink runs first → adds token → then request goes to server
  link: authLink.concat(httpLink),

  // Cache to store GraphQL results (improves performance)
  cache: new InMemoryCache(),
});

/* ─────────────────────────────────────────────
   RENDER REACT APP
   ───────────────────────────────────────────── */

// Mount React app to <div id="root">
ReactDOM.createRoot(document.getElementById("root")).render(

  // StrictMode helps detect potential problems in development
  <React.StrictMode>

    {/* ApolloProvider makes GraphQL client available globally */}
    <ApolloProvider client={client}>

      {/* AuthProvider → provides authentication state */}
      <AuthProvider>

        {/* CartProvider → manages cart data globally */}
        <CartProvider>

          {/* OrderProvider → manages orders globally */}
          <OrderProvider>

            {/* Main App Component */}
            <App />

          </OrderProvider>
        </CartProvider>
      </AuthProvider>

    </ApolloProvider>
  </React.StrictMode>
);