/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
dotenv.config();

const serverPort = process.env.PROXYPORT || 3000;
const host = process.env.SERVERNAME || 'localhost';

module.exports = {
  proxy: `http://${host}:${serverPort}`, // Proxy your Express server
  host: host, // Set the host option
  port: 4000, // BrowserSync’s port
  files: ['src/**/*'], // Watch files for changes
  injectChanges: true, // Enable injecting changes
  reloadOnRestart: true, // Reload the browser when BS restarts
  reloadDebounce: 700,
};
