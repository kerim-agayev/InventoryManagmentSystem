import { getCustomers, getCustomerById, createCustomer  } from "@/controllers/customers";
import express from "express";
const customerRouter = express.Router();
// Define a route for getting all products
//? get
customerRouter.get("/customers", getCustomers);
//? getById
customerRouter.get("/customers/:id", getCustomerById);
//? create customer
customerRouter.post("/customers/", createCustomer);

export default customerRouter;