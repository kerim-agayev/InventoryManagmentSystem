import express from "express";
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from "../controllers/sales";

const router = express.Router();

//? Get all sales
router.get("/sales", getSales);

//? Get sale by ID
router.get("/sales/:id", getSaleById);

//? Create a new sale
router.post("/sales", createSale);

//? Update a sale
router.put("/sales/:id", updateSale);

//? Delete a sale
router.delete("/sales/:id", deleteSale);

export default router;
