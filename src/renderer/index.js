import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for React 18
import Credentials from "./app-content/Credentials";

// Use createRoot for React 18
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Credentials />);
