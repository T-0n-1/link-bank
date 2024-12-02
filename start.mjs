/* eslint-disable no-undef */
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";

const command = isDevelopment
  ? "node ./dist/Proxy.js"
  : "concurrently \"node ./dist/Backend.js\" \"node ./dist/Proxy.js\"";

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  console.log(`Stdout: ${stdout}`);
});
