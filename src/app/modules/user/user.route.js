import express from "express";
import { UserControllers } from "./user.controllers.js";

const router = express.Router();

router.post("/", UserControllers.createUser);

export const UserRoute = router;
