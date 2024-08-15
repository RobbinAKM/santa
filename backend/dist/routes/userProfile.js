"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const combineUserData_1 = require("../utils/combineUserData");
const checkAge_1 = require("../utils/checkAge");
const router = express_1.default.Router();
// Function to fetch and combine user data and profiles
const fetchUserProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userResponse = yield axios_1.default.get("https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json");
        const profileResponse = yield axios_1.default.get("https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json");
        // Combine data from both responses
        return {
            users: userResponse.data,
            profiles: profileResponse.data,
        };
    }
    catch (error) {
        console.error("Error fetching user data:", error.message);
        throw error; // Rethrow the error for handling in route
    }
});
const fetchUser = (userId, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch combined user and profile data
        const combinedData = yield fetchUserProfiles();
        // Combine user and profile data
        const userData = (0, combineUserData_1.combineUserProfileData)(combinedData);
        // Find the user with the specified ID
        const user = userData.find((user) => user.id === userId);
        const isUnderTen = user && (0, checkAge_1.isLessThanTenYearsOld)(user.birthdate);
        if (user) {
            // Send the user data as JSON response
            res.json({ isUnderTen, user });
        }
        else {
            // User not found, send a 404 response
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        console.error("Error in route handler:", error);
        res.status(500).send("Internal Server Error");
    }
});
// Define routes
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const combinedData = yield fetchUserProfiles();
        res.json((0, combineUserData_1.combineUserProfileData)(combinedData)); // Send combined data as JSON response
    }
    catch (error) {
        console.error("Error in route handler:", error); // Detailed error logging
        res.status(500).send("Internal Server Error"); // Send a generic error message
    }
}));
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get userId from request parameters
    yield fetchUser(id, res); // Fetch user and respond
}));
// Export the router
exports.default = router;
