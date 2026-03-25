/**
 * Route Configuration
 * Centralized route definitions with metadata
 */

export const ROUTES = {
  PUBLIC: {
    LANDING: "/",
    LOGIN: "/login",
    REGISTER: "/register"
  },
  
  USER: {
    DASHBOARD: "/dashboard",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    RENTALS: "/rentals",
    SELL_BOOK: "/sell-book"
  },
  
  ADMIN: {
    DASHBOARD: "/admin",
    BOOKS: "/admin/books",
    USERS: "/admin/users",
    ORDERS: "/admin/orders",
    RENTALS: "/admin/rentals",
    SETTINGS: "/admin/settings"
  }
};

/**
 * Check if route requires authentication
 */
export const isProtectedRoute = (pathname) => {
  const publicRoutes = [
    ROUTES.PUBLIC.LANDING,
    ROUTES.PUBLIC.LOGIN,
    ROUTES.PUBLIC.REGISTER
  ];
  
  return !publicRoutes.includes(pathname);
};

/**
 * Check if route is admin-only
 */
export const isAdminRoute = (pathname) => {
  return pathname.startsWith("/admin");
};
