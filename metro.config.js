const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');
// config.resolver.sourceExts.push('wasm'); // Do not add to sourceExts if it's not a source file to be transpiled

module.exports = config;
