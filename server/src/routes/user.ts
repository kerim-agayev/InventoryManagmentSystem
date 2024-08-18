import { getUsers, getUserById, createUser } from "@/controllers/users";
import express from "express";
const userRouter = express.Router();

//? get all users
userRouter.get("/users", getUsers);

//? get by id
userRouter.get("/users/:id", getUserById);

//? create user
userRouter.post("/users/", createUser);

export default userRouter;
