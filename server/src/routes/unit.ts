import express from "express";
import {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/units";

const unitRouter = express.Router();

//? GET all units
unitRouter.get("/units", getUnits);

//? GET unit by ID
unitRouter.get("/units/:id", getUnitById);

//? POST create a new unit
unitRouter.post("/units", createUnit);

//? PUT update a unit
unitRouter.put("/units/:id", updateUnit);

//? DELETE a unit
unitRouter.delete("/units/:id", deleteUnit);

export default unitRouter;
