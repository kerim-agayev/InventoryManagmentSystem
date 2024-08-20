import { getUsers, getUserById, createUser, updateUser, deleteUser, updateUserPassword, getAttendants } from "@/controllers/users";
import express from "express";
const userRouter = express.Router();

//? get all users
userRouter.get("/users", getUsers);
//? get all attendants
userRouter.get("/users/attendants", getAttendants);

//? get by id
userRouter.get("/users/:id", getUserById);

//? create user
userRouter.post("/users", createUser);

//? update user
userRouter.put("/users/:id", updateUser);
//? update user password
userRouter.put("/users/update-password/:id", updateUserPassword);
//? delete user
userRouter.delete("/users/:id", deleteUser);


export default userRouter;
