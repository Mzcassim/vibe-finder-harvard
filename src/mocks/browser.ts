import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * MSW browser worker for development
 * This creates a Service Worker that intercepts requests
 */
export const worker = setupWorker(...handlers);
