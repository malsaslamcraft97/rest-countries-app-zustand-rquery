import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles/global.scss";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useAppStore } from "./store/useAppStore";

import "./index.scss";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return children;
}

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>

      {/* DevTools panel */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
