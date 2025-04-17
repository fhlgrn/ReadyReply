import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add viewport meta tag for responsive design
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1';
document.getElementsByTagName('head')[0].appendChild(meta);

// Add title
const title = document.createElement('title');
title.textContent = 'Gmail-Claude Integration';
document.getElementsByTagName('head')[0].appendChild(title);

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
