import express, { Request, Response } from "express";
import { getCustomers } from "./controllers/customers";
import customerRouter from "./routes/customer";
import userRouter from "./routes/user";
import shopRouter from "./routes/shop";
import supplierRouter from "./routes/supplier";
import loginRouter from "./routes/login";


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
//? shop
app.use("/api/v1", shopRouter)
//? supplier
app.use("/api/v1", supplierRouter)
//? auth
app.use("/api/v1", loginRouter)
// app.get("/api/v1/customers", getCustomers);
// app.get("/api/v2/customers", getV2Customers);
