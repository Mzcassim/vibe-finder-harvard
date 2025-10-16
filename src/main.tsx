import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedSampleData } from "./lib/seed-data";

async function enableMocking() {
  // Enable MSW in both development and production for demo purposes
  // Set VITE_USE_MOCKS=false to disable mocking
  if (import.meta.env.VITE_USE_MOCKS !== "false") {
    const { worker } = await import("./mocks/browser");
    return worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

async function initialize() {
  // Seed sample data on first load
  seedSampleData();
  
  // Enable API mocking
  await enableMocking();
  
  // Render app
  createRoot(document.getElementById("root")!).render(<App />);
}

initialize();
