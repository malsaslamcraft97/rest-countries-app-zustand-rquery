import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:5173", // your Vite dev server
    setupNodeEvents(on) {
      on("task", {
        logA11y(violations) {
          console.log("A11Y Violations:", violations);
          return null;
        },
      });
    },
  },
});
