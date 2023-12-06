import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (values) => {
    try {
      const { data } = await registerRequest(values);
      console.log(data);
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const signin = async (values) => {
    try {
      const { data } = await loginRequest(values);
      setUser(data);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const { data } = await verifyTokenRequest(cookies.token);
        if (!data) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        errors,
        signin,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
