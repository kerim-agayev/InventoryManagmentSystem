import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer  } from "@/controllers/customers";
import express from "express";
const customerRouter = express.Router();
// Define a route for getting all products
//? get
customerRouter.get("/customers", getCustomers);
//? getById
customerRouter.get("/customers/:id", getCustomerById);
//? create customer
customerRouter.post("/customers/", createCustomer);
//? update customer
customerRouter.put("/customers/:id", updateCustomer);
//? delete customer
customerRouter.delete("/customers/:id", deleteCustomer);

export default customerRouter;