import { useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  // Check if user is authenticated and if they're a guest
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userType, setUserType] = useState(
    localStorage.getItem("userType") || null
  );

  const login = (token, type = "user") => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", type);
    setIsAuthenticated(true);
    setUserType(type);
  };

  const guestLogin = () => {
    localStorage.setItem("token", "guest-token");
    localStorage.setItem("userType", "guest");
    setIsAuthenticated(true);
    setUserType("guest");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);
    setUserType(null);
  };

  // Determine if user is a guest
  const isGuest = userType === "guest";

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userType,
      isGuest,
      login, 
      guestLogin,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;