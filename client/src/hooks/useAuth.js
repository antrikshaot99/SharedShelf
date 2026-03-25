import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LOGIN, REGISTER } from "../graphql/mutations";

/**
 * Custom hook for authentication operations
 * Handles login and registration with token management
 * Integrates with AuthContext for reactive state updates across the app
 */
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);

  const login = async (email, password) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password }
      });

      if (data?.login) {
        // Update AuthContext (which updates localStorage + reactive state)
        authContext.updateAuthState(data.login.token, data.login.user);

        return {
          success: true,
          user: data.login.user,
          token: data.login.token
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await registerMutation({
        variables: { name, email, password }
      });

      if (data?.register) {
        // Update AuthContext (which updates localStorage + reactive state)
        authContext.updateAuthState(data.register.token, data.register.user);

        return {
          success: true,
          user: data.register.user,
          token: data.register.token
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const logout = () => {
    authContext.logout();
  };

  const isAuthenticated = () => {
    return authContext.isLoggedIn;
  };

  const getAuthToken = () => {
    return authContext.token;
  };

  const getCurrentUser = () => {
    return authContext.user;
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    getAuthToken,
    getCurrentUser
  };
};
