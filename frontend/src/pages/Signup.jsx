import React, { useState } from 'react';
import axios from "axios";
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gender: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [signupError, setSignupError] = useState("");

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.dob) {
            newErrors.dob = "Date of Birth is required";
        } else {
            const age = calculateAge(formData.dob);
            if (age < 13) {
                newErrors.dob = "You must be at least 13 years old";
            }
        }

        if (!formData.gender) {
            newErrors.gender = "Gender is required";
        }

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

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

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
        setSignupError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        setSignupError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                formData,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            
            console.log("Response:", response.data);
            window.location.href = '/login'; // Redirect to login page
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setSignupError(error.response?.data?.msg || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="form-wrapper">
                <form onSubmit={handleSubmit} className="signup-form">
                    <h2>Create Account</h2>
                    <p className="subtitle">Please fill in the details to get started</p>

                    {signupError && (
                        <div className="error-message">
                            {signupError}
                        </div>
                    )}

                    <div className="signupblock">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className={errors.dob ? 'error' : ''}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.dob && <span className="field-error">{errors.dob}</span>}
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={errors.gender ? 'error' : ''}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <span className="field-error">{errors.gender}</span>}
                        </div>

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
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="submit-button"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>

                    <p className="login-prompt">
                        Already have an account? 
                        <a href="/login" className="login-link">
                            Login
                        </a>
                    </p>
                </form>

                <div className="sidebox">
                    <img 
                        src="signup-image.jpg" 
                        alt="Signup" 
                        className="signup-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default Signup;