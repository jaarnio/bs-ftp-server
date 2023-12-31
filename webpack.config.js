const path = require("path");

module.exports = {
  target: "node", // This ensures compatibility with Node.js
  entry: "./ftp-server.js", // Replace with your script's filename
  output: {
    filename: "bs-ftp-server.js",
    path: path.resolve(__dirname, "dist"), // Output directory
  },
};
