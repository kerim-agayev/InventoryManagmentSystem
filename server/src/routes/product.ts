import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProduct
} from "../controllers/products";

const productRouter = express.Router();

//? GET all products
productRouter.get("/products", getProducts);

//? GET product by ID
productRouter.get("/products/:id", getProductById);

//? POST create a new product
productRouter.post("/products", createProduct);

//? PUT update a product
productRouter.put("/products/:id", updateProduct);

//? DELETE a product
productRouter.delete("/products/:id", deleteProduct);
//? DELETE All Products
productRouter.delete("/products", deleteAllProduct);


export default productRouter;
