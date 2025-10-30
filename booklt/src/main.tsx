import  { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { UserProvider } from "./Context/UserContext";
import { AdminProvider } from "./Context/AdminContext";

// Get the root element safely with correct typing
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <UserProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </UserProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
