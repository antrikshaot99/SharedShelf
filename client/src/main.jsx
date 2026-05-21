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
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Import Firebase auth
import { auth } from "./firebase";

// Apollo Provider to wrap the app
import { ApolloProvider } from "@apollo/client/react";

// Global CSS files
import "./index.css";
import "./App.css";

/* ─────────────────────────────────────────────
   AUTH LINK (Middleware for GraphQL requests)
   ───────────────────────────────────────────── */

// This link runs BEFORE every GraphQL request
// It injects the Firebase ID token into request headers
const authLink = setContext(async (operation, { headers }) => {

  // Get current user from Firebase
  const user = auth.currentUser;
  
  console.log('🔗 Apollo Link - Operation:', operation.operationName, 'User:', user?.email || 'No user');

  // If user is logged in, get ID token
  let token = null;
  if (user) {
    try {
      token = await user.getIdToken();
      console.log('✅ Apollo Link - Token obtained for:', user.email);
    } catch (error) {
      console.warn("❌ Apollo Link - Unable to fetch Firebase token:", error.message);
    }
  } else {
    console.warn('⚠️ Apollo Link - No user in Firebase auth');
  }

  // Attach token to request headers
  const authHeader = token ? `Bearer ${token}` : '';
  console.log('📤 Apollo Link - Sending with auth header:', authHeader ? 'YES (token present)' : 'NO (empty)');
  
  return {
    headers: {
      ...headers,
      authorization: authHeader,
    }
  };
});

/* ─────────────────────────────────────────────
   HTTP LINK (Backend connection)
   ───────────────────────────────────────────── */

// Defines the GraphQL server endpoint
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL || "http://localhost:5000/graphql", // Your backend URL
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