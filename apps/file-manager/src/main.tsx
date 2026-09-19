import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./clients";

import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { RouterProvider } from "@tanstack/react-router";

export const router = createRouter({
  routeTree,
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {/* <App /> */}
    <RouterProvider router={router} />,
  </QueryClientProvider>,
);
