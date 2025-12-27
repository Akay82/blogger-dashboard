import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  userType: null,
  isGuest: false,
  login: () => {},
  guestLogin: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};