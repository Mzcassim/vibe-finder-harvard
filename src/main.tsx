import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedSampleData } from "./lib/seed-data";

async function enableMocking() {
  // Enable MSW by default for demo purposes
  // Only disable if explicitly set to "false"
  const useMocks = import.meta.env.VITE_USE_MOCKS;
  const shouldMock = useMocks === undefined || useMocks === "true" || useMocks === true;
  
  console.log("🔧 Mock config:", { useMocks, shouldMock });
  
  if (shouldMock) {
    console.log("🎭 Starting MSW for API mocking...");
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    console.log("✅ MSW started successfully");
  } else {
    console.log("⏭️ MSW disabled, using real API");
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
