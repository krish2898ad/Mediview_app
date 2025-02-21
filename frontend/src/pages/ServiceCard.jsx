import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = () => {
  const navigate = useNavigate();

  const services = [
    { title: "3D Pain Mapping", description: "Get AI-powered diagnosis for muscle and joint pains by selecting pain areas on a 3D model.", path: "/diagnostics" },
    { title: "AI Diagnosis", description: "Get AI-powered diagnosis for muscle and joint pain.", path: "/ai-chatbot" },
    { title: "Skin Disease Detection", description: "AI-based skin disease identification.", path: "/skin-detection" },
    { title: "Find Specialists", description: "Locate the best doctors near you.", path: "/specialistfinder" },
  ];

  return (
    <div className="services-section">
      <h1 className="services-title">Our Services</h1>
      <p className="services-description">
        Explore our intelligent pain diagnosis and treatment suggestions powered by AI.
      </p>

      <div className="service-cards">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="service-card cursor-pointer" 
            onClick={() => navigate(service.path)} // Navigate on click
          >
            <h2 className="service-title">{service.title}</h2>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;
