import { Router } from "express";
import { usersRoute } from "./users";
import { authRoute } from "./auth";
import { messageRoute } from "./message";

const router = Router();

router.use("/users", usersRoute);
router.use("/auth", authRoute);
router.use("/messages", messageRoute);

export default router;
