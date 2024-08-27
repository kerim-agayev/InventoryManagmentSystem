import express from "express";
import {
  getSaleItems,
  getSaleItemById,
  createSaleItem,
  updateSaleItem,
  deleteSaleItem,
} from "../controllers/saleItems";

const saleItemRouter = express.Router();

//? GET all sale items
saleItemRouter.get("/sale-items", getSaleItems);

//? GET sale item by ID
saleItemRouter.get("/sale-items/:id", getSaleItemById);

//? POST create a new sale item
saleItemRouter.post("/sale-items", createSaleItem);

//? PUT update a sale item ---
saleItemRouter.put("/sale-items/:id", updateSaleItem);

//? DELETE a sale item ---
saleItemRouter.delete("/sale-items/:id", deleteSaleItem);

export default saleItemRouter;
