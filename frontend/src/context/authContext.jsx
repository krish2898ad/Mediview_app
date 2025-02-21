import { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);  // New state for the token

    useEffect(() => {
        const token = localStorage.getItem("authToken");  // Token from localStorage
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const isTokenExpired = decoded.exp * 1000 < Date.now();

                if (isTokenExpired) {
                    logout(); // Token expired, log out user
                } else {
                    setUser(decoded);  // Set user if token is valid
                    setAuthToken(token);  // Save token to state
                }
            } catch (error) {
                console.error("❌ Invalid token:", error);
                logout();
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            if (res.data.token) {
                localStorage.setItem("authToken", res.data.token);  // Store the token correctly
                setAuthToken(res.data.token);  // Set token in state
                setUser(jwtDecode(res.data.token));  // Decode and set user
            } else {
                throw new Error("❌ Token not received in response");
            }
        } catch (error) {
            console.error("❌ Login failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = () => {
        console.log("🔓 Logging out, clearing token...");
        localStorage.removeItem("authToken");  // Remove token from storage
        setAuthToken(null);  // Clear token in state
        setUser(null);  // Clear user state
    };

    return (
        <AuthContext.Provider value={{ user, authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
