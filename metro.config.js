const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// Since this is a monorepo, we might need to watch other folders, 
// but for now, let's focus on making the root work as an app.

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [projectRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// 3. Force Metro to resolve (sub)dependencies only from the `node_modules` folders
// config.resolver.disableHierarchicalLookup = true;

module.exports = config;
