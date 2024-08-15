import { Router, Request, Response } from "express";

const router: Router = Router();

// Interface for a user entry
interface UserEntry {
  message: string;
}

// Interface for user data
interface UserData {
  id: string;
  name: string;
  address: string;
  entries: UserEntry[];
}

// In-memory store for user data
let userDataStore: UserData[] = [];

// Route to handle saving user data
router.post("/saveUserData", (req: Request, res: Response) => {
  const { id, name, address, message } = req.body;

  if (!id || !name || !address || !message) {
    return res.status(400).send("Missing required fields");
  }

  // Find existing user entry
  const userIndex = userDataStore.findIndex((entry) => entry.id === id);

  if (userIndex !== -1) {
    // Check for duplicate messages
    const userEntry = userDataStore[userIndex];
    const isDuplicate = userEntry.entries.some(
      (entry) => entry.message === message
    );

    if (!isDuplicate) {
      // Append new message
      userDataStore[userIndex].entries.push({ message });
    }
  } else {
    // Create new entry if user does not exist
    userDataStore.push({
      id,
      name,
      address,
      entries: [{ message }],
    });
  }

  // Respond to the client
  res.status(200).send("User data saved successfully");
});

// Route to get user data (for testing purposes)
router.get("/getAllMessages", (req: Request, res: Response) => {
  if (userDataStore) {
    res.status(200).json(userDataStore);
  } else {
    res.status(404).send("Error getting messages");
  }
});

// Route to mark messages as sent
router.post("/markMessagesAsSent", (req: Request, res: Response) => {
  const { id } = req.body;

  // Find the user and mark their entries as sent
  const userIndex = userDataStore.findIndex((entry) => entry.id === id);

  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }

  // Remove the user entry from the data store
  userDataStore.splice(userIndex, 1);

  res.status(200).send("Messages marked as sent");
});

export default router;
