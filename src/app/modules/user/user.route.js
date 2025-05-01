import express from "express";
import { UserControllers } from "./user.controllers.js";

const router = express.Router();

router.post("/", UserControllers.createUser);
router.post("/login", UserControllers.loginUser);

export const UserRoute = router;
