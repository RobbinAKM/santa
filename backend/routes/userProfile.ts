import axios, { AxiosResponse } from "axios";
import express, { Request, Response } from "express";
import {
  combineUserProfileData,
  CombinedData as CombineDataFromUtils,
} from "../utils/combineUserData";
import { isLessThanTenYearsOld } from "../utils/checkAge";

const router = express.Router();

interface User {
  uid: string;
  username: string;
}

interface Profile {
  userUid: string;
  address: string;
  birthdate: string;
}

interface CombinedData {
  users: User[];
  profiles: Profile[];
}

// Function to fetch and combine user data and profiles
const fetchUserProfiles = async (): Promise<CombinedData> => {
  try {
    const userResponse: AxiosResponse<User[]> = await axios.get(
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json"
    );
    const profileResponse: AxiosResponse<Profile[]> = await axios.get(
      "https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json"
    );

    // Combine data from both responses
    return {
      users: userResponse.data,
      profiles: profileResponse.data,
    };
  } catch (error: any) {
    console.error("Error fetching user data:", error.message);
    throw error; // Rethrow the error for handling in route
  }
};

const fetchUser = async (userId: string, res: Response): Promise<void> => {
  try {
    // Fetch combined user and profile data
    const combinedData = await fetchUserProfiles();

    // Combine user and profile data
    const userData = combineUserProfileData(combinedData);

    // Find the user with the specified ID
    const user = userData.find((user: any) => user.id === userId);

    const isUnderTen = user && isLessThanTenYearsOld(user.birthdate);

    if (user) {
      // Send the user data as JSON response
      res.json({ isUnderTen, user });
    } else {
      // User not found, send a 404 response
      res.status(404).send("User not found");
    }
  } catch (error: any) {
    console.error("Error in route handler:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Define routes
router.get("/", async (req: Request, res: Response) => {
  try {
    const combinedData = await fetchUserProfiles();
    res.json(combineUserProfileData(combinedData)); // Send combined data as JSON response
  } catch (error: any) {
    console.error("Error in route handler:", error); // Detailed error logging
    res.status(500).send("Internal Server Error"); // Send a generic error message
  }
});

router.get("/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params; // Get userId from request parameters
  await fetchUser(id, res); // Fetch user and respond
});

// Export the router
export default router;
