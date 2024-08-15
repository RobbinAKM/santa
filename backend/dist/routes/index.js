"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userProfile_1 = __importDefault(require("./userProfile"));
const userMessage_1 = __importDefault(require("./userMessage"));
const router = (0, express_1.Router)();
// Mount the route handlers on the router
router.use("/api", userProfile_1.default);
router.use("/api", userMessage_1.default);
exports.default = router;
