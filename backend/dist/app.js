"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
require("./cronJob");
// Load environment variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)());
// Use body-parser middleware to parse JSON requests
app.use(body_parser_1.default.json());
// Import and use the routes from the "routes" folder
app.use("/", index_1.default); // Ensure routes are mounted at a specific path
const PORT = parseInt(process.env.PORT, 10) || 8080;
// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
