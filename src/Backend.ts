import express, { Express, Request, Response } from "express";
import { whitelist, isOriginAllowed, setHeaders } from "./Utils";
import dotenv from "dotenv";
import backendRouter from "./routes/backendAPI";

dotenv.config(); // Load environment variables from a .env file

const port: number = Number(process.env.BACKENDPORT) || 3456; // Port the server will listen on

const app: Express = express(); // Create an Express application

// CORS middleware
app.use((req: Request, res: Response, next) => {
  const origin: string = req.headers.origin || "";
  if (isOriginAllowed(origin, whitelist)) {
    setHeaders(res, origin);
  }
  next();
});
app.use(express.json()); // Enable JSON body parsing
app.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing
app.use(express.static("public")); // Serve static files from the public directory
app.use("/api", backendRouter);

app.listen(port, () => console.log(`Backend server listening on port ${port}`));
