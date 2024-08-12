const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
require("./cronJob");

// Load environment variables
require("dotenv").config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Import and use the routes from the "routes" folder
app.use("/", routes); // Ensure routes are mounted at a specific path

const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
