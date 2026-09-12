import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./clients";
import { BootstrapProvider } from "./components";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BootstrapProvider>
      <App />
    </BootstrapProvider>
  </QueryClientProvider>,
);
