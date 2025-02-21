import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/authContext"; // Ensure correct import

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider> {/* ✅ Wrap the entire app */}
        <App />
    </AuthProvider>
);
