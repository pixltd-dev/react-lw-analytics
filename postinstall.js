const fs = require("fs");
const path = require("path");

// Detect the React project root (where npm/yarn is running)
const projectRoot = process.env.INIT_CWD;

// Ensure this script is not running inside node_modules/react-lw-analytics itself
if (!projectRoot || projectRoot.includes("node_modules/react-lw-analytics")) {
  console.log("Skipping postinstall inside node_modules.");
  process.exit(0);
}

// Define source and destination paths
const source = path.join(__dirname, "backend");
const destination = path.join(projectRoot, "public", "backend");

// Ensure the destination folder exists
if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

// Copy all backend files
fs.readdirSync(source).forEach(file => {
  fs.copyFileSync(path.join(source, file), path.join(destination, file));
});

console.log(`✅ Backend files copied to: ${destination}`);
