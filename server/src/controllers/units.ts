import { db } from "@/db/db";
import { RequestHandler } from "express";

//? Get all units
export const getUnits: RequestHandler = async (req, res) => {
  try {
    const units = await db.unit.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(units);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Get unit by ID
export const getUnitById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const unit = await db.unit.findUnique({
      where: { id },
    });
    if (unit) {
      return res.status(200).json(unit);
    } else {
      return res.status(404).json({ message: "Unit not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Create a new unit
export const createUnit: RequestHandler = async (req, res) => {
  try {
    const { name, abbreviation, slug } = req.body;

    const existingUnit = await db.unit.findUnique({
      where: { slug },
    });

    if (existingUnit) {
      return res.status(409).json({ message: "Unit with this slug already exists" });
    }

    const newUnit = await db.unit.create({
      data: {
        name,
        abbreviation,
        slug,
      },
    });

    return res.status(201).json(newUnit);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Update a unit
export const updateUnit: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, abbreviation, slug } = req.body;

    const existingUnit = await db.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    const existingSlug = await db.unit.findUnique({
      where: { slug },
    });

    if (existingSlug && existingSlug.id !== id) {
      return res.status(409).json({ message: "Unit with this slug already exists" });
    }

    const updatedUnit = await db.unit.update({
      where: { id },
      data: {
        name: name ?? existingUnit.name,
        abbreviation: abbreviation ?? existingUnit.abbreviation,
        slug: slug ?? existingUnit.slug,
      },
    });

    return res.status(200).json(updatedUnit);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Delete a unit
export const deleteUnit: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existingUnit = await db.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    await db.unit.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
