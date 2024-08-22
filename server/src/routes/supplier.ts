import {createSupplier, deleteSupplier, getAllSuppliers, getSupplierById, updateSupplier } from "@/controllers/suppliers";
import express from "express";

const supplierRouter = express.Router();

//? get all suppliers
supplierRouter.get("/suppliers", getAllSuppliers );

//? get by id
supplierRouter.get("/suppliers/:id", getSupplierById);

//? create supplier
supplierRouter.post("/suppliers", createSupplier);

//? update supplier
supplierRouter.put("/suppliers/:id", updateSupplier);

//? delete supplier
supplierRouter.delete("/suppliers/:id", deleteSupplier);


export default supplierRouter;
