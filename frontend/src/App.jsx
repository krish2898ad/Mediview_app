import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ServiceCard from "./pages/ServiceCard";
import "./styles.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MedicalChatbot from "./pages/ChatBot";
import SkinDiseaseDetection from "./pages/SkinDeceaseDetection";
// import SpecialistFinder from "./pages/Locate";
import Diagnostics from "./pages/Diagnostics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/services" element={<ServiceCard />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        {/* <Route path="/painmapper" element={<PainMapper />} /> */}
        <Route path="/ai-chatbot" element={<MedicalChatbot />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/skin-detection" element={<SkinDiseaseDetection/>} />
        {/* <Route path="/specialistfinder" element={<SpecialistFinder />} /> */}
      </Routes>
    </Router>
  );
}

export default App;