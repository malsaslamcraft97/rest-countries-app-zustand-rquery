console.log("PA11Y CONFIG LOADED");

module.exports = {
  urls: ["http://localhost:5173"],
  standard: "WCAG2AA",
  timeout: 30000,
  chromeLaunchConfig: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
};
