import express from "express";
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brands";

const brandRouter = express.Router();

//? GET all brands
brandRouter.get("/brands", getBrands);

//? GET brand by ID
brandRouter.get("/brands/:id", getBrandById);

//? POST create a new brand
brandRouter.post("/brands", createBrand);

//? PUT update a brand
brandRouter.put("/brands/:id", updateBrand);

//? DELETE a brand
brandRouter.delete("/brands/:id", deleteBrand);

export default brandRouter;
