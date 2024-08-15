import { Router } from "express";
import userProfileRoutes from "./userProfile";
import userMessage from "./userMessage";

const router: Router = Router();

// Mount the route handlers on the router
router.use("/api", userProfileRoutes);
router.use("/api", userMessage);

export default router;
