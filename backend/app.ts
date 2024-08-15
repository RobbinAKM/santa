import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index";
import "./cronJob";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

// Enable CORS for all routes
app.use(cors());

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Import and use the routes from the "routes" folder
app.use("/", routes); // Ensure routes are mounted at a specific path

const PORT: number = parseInt(process.env.PORT as string, 10) || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
