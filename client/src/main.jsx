import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { OrderProvider } from "./context/OrderContext";
import { CartProvider } from "./context/CartContext";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

import { ApolloProvider } from "@apollo/client/react";
import "./index.css";

// Authentication link to inject JWT token into requests
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    }
  });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: "http://localhost:5000/graphql",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </CartProvider>
    </ApolloProvider>
  </React.StrictMode>
);