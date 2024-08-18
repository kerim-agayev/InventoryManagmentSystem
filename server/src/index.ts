import express, { Request, Response } from "express";
import { getCustomers, getV2Customers } from "./controllers/customers";
import customerRouter from "./routes/customer";
import userRouter from "./routes/user";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.listen(PORT, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});

// Create an API
// GET, POST,PUT,PATCH,DELETE
// http:localhost:8000/customers
//? customer
app.use("/api/v1", customerRouter)
//? user
app.use("/api/v1", userRouter)
// app.get("/api/v1/customers", getCustomers);
// app.get("/api/v2/customers", getV2Customers);
