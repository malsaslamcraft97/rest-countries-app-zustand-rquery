module.exports = {
  ci: {
    collect: {
      startServerCommand: "yarn dev",
      startServerReadyPattern: "Local:",
      url: ["http://localhost:5173"],
      numberOfRuns: 3,
    },

    assert: {
      assertions: {
        // ONLY strict check
        "categories:accessibility": ["error", { minScore: 0.9 }],

        // Ignore for now
        "categories:performance": "off",

        // Informational only
        "categories:best-practices": "warn",
        "categories:seo": "warn",
      },
    },

    upload: {
      target: "temporary-public-storage",
    },
  },
};
