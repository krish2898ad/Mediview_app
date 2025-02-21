import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/authContext";
import './Login.css';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Form states
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
        setLoginError("");
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        setLoginError("");

        try {
            await login(formData.email, formData.password);
            const token = localStorage.getItem("token");

            if (token) {
                console.log("Stored token:", token);
                navigate("/");
            } else {
                setLoginError("Login failed: Authentication token not received");
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError(error.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Please sign in to your account</p>

                    {loginError && (
                        <div className="error-message">
                            {loginError}
                        </div>
                    )}

                    <div className="loginblock">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && (
                                <span className="field-error">{errors.email}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && (
                                <span className="field-error">{errors.password}</span>
                            )}
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="/forgot-password" className="forgot-password">
                                Forgot Password?
                            </a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="login-button"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>

                    <p className="signup-prompt">
                        Don't have an account? 
                        <a href="/signup" className="signup-link">
                            Sign up
                        </a>
                    </p>
                </form>

                <div className="sidebox">
                    <img 
                        src="login-image.jpg" 
                        alt="Login" 
                        className="login-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;