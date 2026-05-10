import { createContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

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

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  /**
   * HYDRATION: On mount, listen to Firebase auth state changes
   * This ensures the auth state is synced with Firebase Authentication
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        user.getIdToken().then((token) => {
          dispatch({
            type: 'LOGIN',
            payload: {
              token,
              user: {
                id: user.uid,
                name: user.displayName || user.email,
                email: user.email,
                role: 'user' // Default role, you can customize based on custom claims
              }
            }
          });
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
