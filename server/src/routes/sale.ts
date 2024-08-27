import express from "express";
import {
  getSales,
  getSaleById,
  createSaleWithItems,
  updateSale,
  deleteSale,
  createSale
} from "../controllers/sales";

const router = express.Router();

//? Get all sales
router.get("/sales", getSales);

//? Get sale by ID
router.get("/sales/:id", getSaleById);

//? Create a new sale with items
router.post("/sales-with-items", createSaleWithItems);

//? Create a new sale 
router.post("/sales", createSale);

//? Update a sale ---
router.put("/sales/:id", updateSale);

//? Delete a sale ---
router.delete("/sales/:id", deleteSale);

export default router;
