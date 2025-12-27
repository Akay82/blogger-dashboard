import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./LoginModal.css";
import api from "../../api/axios";
export default function LoginModal() {
  const { login,guestLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    // Call real API endpoint
    const response = await api.post("/auth/login", {
      email: email.trim(),
      password: password
    });

    // Check if response has token
    if (response.data && response.data.token) {
      login(response.data.token);
      // You might also want to store user data if API returns it
      // Example: login(response.data.token, response.data.user);
    } else {
      setError("Invalid response from server");
    }
  } catch (err) {
    // Handle different types of errors
    if (err.response) {
      // Server responded with error status
      switch (err.response.status) {
        case 401:
          setError("Invalid email or password");
          break;
        case 400:
          setError("Bad request. Please check your inputs");
          break;
        case 404:
          setError("Service not found");
          break;
        case 500:
          setError("Server error. Please try again later");
          break;
        default:
          setError(err.response.data?.message || "Login failed");
      }
    } else if (err.request) {
      // Request was made but no response
      setError("No response from server. Check your connection");
    } else {
      // Something else happened
      setError("An unexpected error occurred");
    }
  } finally {
    setIsLoading(false);
  }
};

const handleGuestLogin = async () => {
  setIsLoading(true);
  setError("");
  
  try {
    // Call the guestLogin function from AuthContext
    guestLogin();
    
    // Optionally: You can still make an API call to register a guest session
    // await api.post("/auth/guest-session");
    // guestLogin("guest-session-token");
    
  } catch (err) {
    setError("Unable to continue as guest. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <div className="login-modal-header">
          <h2 className="login-modal-title">Welcome Back</h2>
          <p className="login-modal-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loading">
                <span className="loading-spinner"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="guest-section">
          <div className="separator">
            <span className="separator-text">OR</span>
          </div>
          
          <button
          type="button"
            onClick={handleGuestLogin}
            className="guest-button"
            disabled={isLoading}
          >
            Continue as Guest
          </button>
          
          <p className="guest-note">
            You'll have limited access as a guest user
          </p>
        </div>

        {/* <div className="login-modal-footer">
          <a href="#forgot" className="footer-link">Forgot password?</a>
          <span className="footer-text">
            Don't have an account? <a href="#signup" className="footer-link">Sign up</a>
          </span>
        </div> */}
      </div>
    </div>
  );
}