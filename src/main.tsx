import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/auth.css";

import App from "./app.tsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
