const express = require("express");
const userProfileRoutes = require("./userProfile");
const userMessage = require("./userMessage");

const router = express.Router();

// Mount the route handlers on the router
router.use("/api", userProfileRoutes);
router.use("/api", userMessage);

module.exports = router;
