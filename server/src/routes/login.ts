import {authorizeUser, forgotPassword, verifyToken, changePassword   } from "@/controllers/loginController";
import express from "express";
const loginRouter = express.Router();

//? login
loginRouter.post("/auth/login", authorizeUser );
//? forgot password
loginRouter.put("/auth/forgot-password", forgotPassword);
//? verify token
loginRouter.get("/auth/verify-token", verifyToken);
//? change password
loginRouter.put("/auth/change-password", changePassword);

export default loginRouter;
