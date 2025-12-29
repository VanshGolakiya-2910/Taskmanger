import express from "express";
import { register, login, refreshAccessTokenController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/refresh', refreshAccessTokenController);


export default router;
 