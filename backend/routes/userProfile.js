const axios = require("axios");
const express = require("express");
const router = express.Router();
const { combineUserProfileData } = require("../utils/combineUserData");
const { isLessThanTenYearsOld } = require("../utils/checkAge");

// Function to fetch and combine user data and profiles
const fetchUserProfiles = async () => {
  try {
    const userResponse = await axios.get(
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json"
    );
    const profileResponse = await axios.get(
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json"
    );

    // Combine data from both responses
    return {
      users: userResponse.data,
      profiles: profileResponse.data,
    };
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    throw error; // Rethrow the error for handling in route
  }
};

const fetchUser = async (userId, res) => {
  try {
    // Fetch combined user and profile data
    const combinedData = await fetchUserProfiles();

    // Combine user and profile data
    const userData = combineUserProfileData(combinedData);

    // Find the user with the specified ID
    const user = userData.find((user) => user.id === userId);

    const isUnderTen = user && isLessThanTenYearsOld(user.birthdate);

    if (user) {
      // Send the user data as JSON response
      res.json({ isUnderTen, user });
    } else {
      // User not found, send a 404 response
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Define routes
router.get("/", async (req, res) => {
  try {
    const combinedData = await fetchUserProfiles();
    console.log(combineUserProfileData(combinedData));
    res.json(combineUserProfileData(combinedData)); // Send combined data as JSON response
  } catch (error) {
    console.error("Error in route handler:", error); // Detailed error logging
    res.status(500).send("Internal Server Error"); // Send a generic error message
  }
});

router.get("/user/:id", async (req, res) => {
  const { id } = req.params; // Get userId from request parameters
  await fetchUser(id, res); // Fetch user and respond
});

// Export the router
module.exports = router;
