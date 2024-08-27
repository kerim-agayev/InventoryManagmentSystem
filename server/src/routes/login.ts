import {authorizeUser, forgotPassword   } from "@/controllers/loginController";
import express from "express";
const loginRouter = express.Router();

//? login
loginRouter.post("/auth/login", authorizeUser );
//? forgot password
loginRouter.put("/auth/forgot-password", forgotPassword);


export default loginRouter;
