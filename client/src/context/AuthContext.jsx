import { createContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

/**
 * AuthContext - Centralized authentication state management
 * Provides reactive auth state that updates when user logs in/out
 * Hydrates from localStorage on mount to persist auth across page refreshes
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  isLoading: true
};

/**
 * Reducer to handle auth state transitions
 * Using useReducer instead of useState to properly handle complex state updates in effects
 */
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        token: action.payload.token,
        isLoggedIn: true,
        user: action.payload.user,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        token: null,
        isLoggedIn: false,
        user: null,
        isLoading: false
      };
    case 'HYDRATE_COMPLETE':
      return {
        ...state,
        isLoading: false
      };
    default:
      return state;
  }
}

// Create a standalone Apollo Client for AuthContext (used before ApolloProvider)
const authLinkForContext = setContext(async (_, { headers }) => {
  const user = auth.currentUser;
  let token = null;
  if (user) {
    token = await user.getIdToken();
  }
  const authHeader = token ? `Bearer ${token}` : '';
  return {
    headers: {
      ...headers,
      authorization: authHeader,
    }
  };
});

const httpLinkForContext = new HttpLink({
  uri: import.meta.env.VITE_API_URL || "http://localhost:5000/graphql",
});

const contextApolloClient = new ApolloClient({
  link: authLinkForContext.concat(httpLinkForContext),
  cache: new InMemoryCache(),
});

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
    }
  }
`;

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  /**
   * HYDRATION: On mount, listen to Firebase auth state changes
   * This ensures the auth state is synced with Firebase Authentication
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        user.getIdToken().then(async (token) => {
          try {
            // Create a temporary Apollo client with the token in headers
            const tempClient = new ApolloClient({
              link: new HttpLink({
                uri: import.meta.env.VITE_API_URL || "http://localhost:5000/graphql",
                headers: {
                  authorization: `Bearer ${token}`
                }
              }),
              cache: new InMemoryCache(),
            });

            // Fetch database user info to get the database ID with auth token
            const response = await tempClient.query({ query: GET_ME });
            const dbUser = response.data.me;
            
            console.log('✅ AuthContext - Database user fetched:', dbUser);
            console.log('👤 AuthContext - User role:', dbUser.role);
            
            dispatch({
              type: 'LOGIN',
              payload: {
                token,
                user: {
                  id: dbUser.id,  // Use database ID, not Firebase UID
                  name: dbUser.name || user.displayName || user.email,
                  email: dbUser.email || user.email,
                  role: dbUser.role || 'user'
                }
              }
            });
          } catch (error) {
            console.warn('❌ Failed to fetch user from database:', error);
            // Fallback to Firebase data if query fails
            dispatch({
              type: 'LOGIN',
              payload: {
                token,
                user: {
                  id: user.uid,
                  name: user.displayName || user.email,
                  email: user.email,
                  role: 'user'
                }
              }
            });
          }
        });
      } else {
        // User is signed out
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  /**
   * Sync auth state with localStorage changes
   * Triggered when another tab logs in/out, or when mutations complete
   */
  const updateAuthState = (token, userData) => {
    if (token && userData) {
      // User logged in
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userRole', userData.role);

      dispatch({
        type: 'LOGIN',
        payload: { token, user: userData }
      });
    } else {
      // User logged out
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');

      dispatch({ type: 'LOGOUT' });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    isLoggedIn: authState.isLoggedIn,
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    updateAuthState,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
