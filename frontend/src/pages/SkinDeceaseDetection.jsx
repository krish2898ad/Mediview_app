"use client";

import { useState, useRef } from "react";
import { FaUpload, FaCamera, FaUserMd, FaCalendarAlt, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import "./SkinDiagnosis.css";

const SkinDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatboxRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    addImageToChat(file);
  };

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        addImageToChat(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageToChat = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMessage = { type: "image", content: reader.result, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      simulateAIResponse("I've received your image. What would you like to know about it?");
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    const newMessage = { type: "text", content: userInput, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput("");
    simulateAIResponse();
  };

  const simulateAIResponse = (customResponse = null) => {
    setTimeout(() => {
      const aiResponse =
        customResponse ||
        "Thank you for your query. Based on the image and your description, it appears to be a common skin condition. However, for an accurate diagnosis, I recommend consulting with a dermatologist. Is there anything specific you'd like to know about skin health?";
      const newMessage = { type: "text", content: aiResponse, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    }, 1000);
  };

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  const handleSubmitImage = async () => {
    if (!selectedFile) {
      return alert("Please upload or capture an image first.");
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      const response = await axios.post("http://localhost:5000/api/pain/skin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Enter the dragon");
      const diagnosis = response.data.diagnosis || "Unable to provide a diagnosis.";
      simulateAIResponse(`Diagnosis: ${diagnosis}`);
    } catch (error) {
      console.error("Error diagnosing skin condition:", error);
      simulateAIResponse("Sorry, something went wrong while diagnosing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skin-diagnosis-container">
      <header className="page-title">
        <h1>Derma Diagnosis</h1>
      </header>

      <div className="main-content">
        <div className="left-section">
          <section className="card image-upload-card">
            <h2>Upload or Capture Skin Image</h2>
            <label className="upload-box">
              <FaUpload className="icon" />
              <input type="file" onChange={handleFileChange} />
              <p>Click to upload an image</p>
              {selectedFile && <p>{selectedFile.name}</p>}
            </label>
            <div>
              <label className="upload-box">
                <FaCamera className="icon" />
                <input type="file" accept="image/*" capture="camera" onChange={handleCapture} />
                <p>Take a Photo</p>
              </label>
              {capturedImage && (
                <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="captured-image" />
              )}
            </div>
          </section>

          <section className="card find-specialist-card">
            <h2>Find a Specialist</h2>
            <div className="info-box">
              <FaUserMd className="icon" />
            </div>
            <button className="primary-button">Search Doctors</button>
          </section>
        </div>

        <section className="card ai-diagnosis-card">
          <h2>AI Diagnosis Assistant</h2>
          <div className="chatbox" ref={chatboxRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.type === "text" ? (
                  <p>{msg.content}</p>
                ) : (
                  <img src={msg.content || "/placeholder.svg"} alt="Uploaded skin" className="chat-image" />
                )}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about your skin condition..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
          <button onClick={handleSubmitImage} disabled={loading}>
            {loading ? "Diagnosing..." : "Submit Image for Diagnosis"}
          </button>
        </section>

        <section className="card sessions-card">
          <h2>Your Sessions</h2>
          <div className="info-box">
            <FaCalendarAlt className="icon" />
            <p>Track your past diagnoses and doctor appointments.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SkinDiagnosis;
