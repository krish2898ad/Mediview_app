import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll create this dedicated CSS file
import { FaStethoscope, FaBrain, FaSearch, FaUserMd, FaBars, FaTimes } from 'react-icons/fa';
import './Style.css';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Animation effect for elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to scroll to top when Home is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsMenuOpen(false); // Close menu if it's open
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={scrollToTop}>
            MedView
          </Link>
          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={scrollToTop}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-link">Services</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link login-btn">Login</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content fade-in">
          <h1>Know Your Pain,<br />Treat It Right</h1>
          <p>Our intelligent diagnosis system helps you identify discomfort by selecting the affected body part on a 3D model, providing instant insights and tailored treatment suggestions.</p>
          <div className="hero-buttons">
            <Link to="/diagnostics" className="btn btn-primary">Try Diagnosis Now</Link>
            <Link to="/services" className="btn btn-outline">Explore Services</Link>
          </div>
        </div>
        <div className="hero-image fade-in delay-200">
          <img src="/pain.webp" alt="3D Pain Mapping Visualization" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item fade-in">
          <h3>95%</h3>
          <p>Diagnostic Accuracy</p>
        </div>
        <div className="stat-item fade-in delay-100">
          <h3>24/7</h3>
          <p>Availability</p>
        </div>
        <div className="stat-item fade-in delay-200">
          <h3>10k+</h3>
          <p>Satisfied Users</p>
        </div>
        <div className="stat-item fade-in delay-300">
          <h3>500+</h3>
          <p>Medical Conditions</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="services-heading fade-in">
          <h2>Our Services</h2>
          <p>Explore our intelligent pain diagnosis and treatment suggestions powered by AI.</p>
        </div>
        
        <div className="services-grid">
          <div className="service-card fade-in">
            <div className="service-icon">
              <FaStethoscope />
            </div>
            <h3>3D Pain Mapping</h3>
            <p>Get AI-powered diagnosis for muscle and joint pains by selecting pain areas on a 3D model.</p>
            <Link to="/pain-mapper" className="service-link">Try Now</Link>
          </div>
          
          <div className="service-card fade-in delay-100">
            <div className="service-icon">
              <FaBrain />
            </div>
            <h3>AI Diagnosis</h3>
            <p>Get AI-powered diagnosis for muscle and joint pain with detailed treatment recommendations.</p>
            <Link to="/ai-diagnosis" className="service-link">Try Now</Link>
          </div>
          
          <div className="service-card fade-in delay-200">
            <div className="service-icon">
              <FaSearch />
            </div>
            <h3>Skin Disease Detection</h3>
            <p>AI-based skin disease identification with high accuracy and personalized care suggestions.</p>
            <Link to="/skin-detection" className="service-link">Try Now</Link>
          </div>
          
          <div className="service-card fade-in delay-300">
            <div className="service-icon">
              <FaUserMd />
            </div>
            <h3>Find Specialists</h3>
            <p>Locate the best doctors near you based on your specific condition and treatment needs.</p>
            <Link to="/locate" className="service-link">Find Doctors</Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="fade-in">How MedView Works</h2>
        <div className="steps-container">
          <div className="step fade-in">
            <div className="step-number">1</div>
            <h3>Select Body Part</h3>
            <p>Interact with our 3D body model to pinpoint your pain location accurately.</p>
          </div>
          <div className="step fade-in delay-100">
            <div className="step-number">2</div>
            <h3>Describe Symptoms</h3>
            <p>Answer a few simple questions about your pain type, duration, and triggers.</p>
          </div>
          <div className="step fade-in delay-200">
            <div className="step-number">3</div>
            <h3>Get Analysis</h3>
            <p>Receive AI-generated diagnostics and evidence-based treatment options.</p>
          </div>
          <div className="step fade-in delay-300">
            <div className="step-number">4</div>
            <h3>Connect with Doctors</h3>
            <p>Find specialists near you who excel in treating your specific condition.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial fade-in">
          <div className="quote">"MedView helped me identify the root cause of my shoulder pain when multiple doctor visits couldn't. The 3D mapping technology is revolutionary!"</div>
          <div className="author">— Sarah J., Physical Therapist</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section fade-in">
        <h2>Start Your Pain-Free Journey Today</h2>
        <p>Get accurate diagnostics and personalized treatment plans powered by cutting-edge AI technology.</p>
        <Link to="/signup" className="btn btn-primary btn-large">Sign Up For Free</Link>
      </section>
    </div>
  );
};

export default LandingPage;