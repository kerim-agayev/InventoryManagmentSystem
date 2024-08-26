import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories";

const categoryRouter = express.Router();

//? GET all categories
categoryRouter.get("/categories", getCategories);

//? GET category by ID
categoryRouter.get("/categories/:id", getCategoryById);

//? POST create a new category
categoryRouter.post("/categories", createCategory);

//? PUT update a category
categoryRouter.put("/categories/:id", updateCategory);

//? DELETE a category
categoryRouter.delete("/categories/:id", deleteCategory);

export default categoryRouter;
