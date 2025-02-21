import { useState, useContext } from "react";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Send, Upload, Stethoscope } from "lucide-react";
import "./MedicalChatbot.css";
import axios from "axios";
import AuthContext from "../context/AuthContext";  // Import the AuthContext

const MedicalChatbot = () => {
  const { authToken } = useContext(AuthContext);  // Get token from context
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPainCauses = async (msg) => {
    try {
      if (!authToken) {
        throw new Error("❌ Authentication token is missing.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/pain/diagnosis",
        { symptoms: msg },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,  // Use token from context
          },
        }
      );

      console.log("Diagnosis Response:", response.data);
      return response.data.causes;
    } catch (error) {
      console.error("❌ Error fetching pain causes:", error);
      return "Error retrieving pain causes.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    const newMessage = {
      id: Date.now(),
      text: input.trim(),
      image: image,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setImage(null);

    // Indicate bot is typing
    setLoading(true);

    // Fetch the pain causes response
    const responseMessage = await fetchPainCauses(input.trim());

    // Add bot response with the fetched diagnosis
    const botResponse = {
      id: Date.now() + 1,
      text: responseMessage,
      sender: "bot",
    };

    setLoading(false);
    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chatbot-container">
      <Card className="chatbot-card">
        <CardHeader className="chatbot-header">
          <CardTitle className="chatbot-title">
            <Stethoscope className="icon" />
            Medical Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender === "user" ? "user" : "bot"}`}>
                <div className="message-content">
                  {message.text && <p>{message.text}</p>}
                  {message.image && <img src={message.image} alt="Uploaded" className="message-image" />}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content">
                  <p>Bot is processing...</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="chatbot-form">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your symptoms..."
              className="chatbot-input"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
            <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById("image-upload").click()}>
              <Upload className="icon-small" />
            </Button>
            <Button type="submit">
              <Send className="icon-small" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MedicalChatbot;
