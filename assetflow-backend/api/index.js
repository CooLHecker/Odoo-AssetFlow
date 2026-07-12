// Vercel serverless entry point.
// Vercel treats every file in /api as a serverless function; exporting the
// Express app directly lets it handle all incoming requests without app.listen().
const app = require("../src/app");

module.exports = app;
