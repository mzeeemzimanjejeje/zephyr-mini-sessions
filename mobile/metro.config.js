const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Workspace root (one level above mobile/)
const workspaceRoot = path.resolve(__dirname, "..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Let Metro watch the shared src/ folder in the parent directory
config.watchFolders = [workspaceRoot];

// Make sure Metro can resolve modules from the parent workspace
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = config;
