import { db } from "@/db/db";
import { RequestHandler } from "express";

//? Get all brands
export const getBrands: RequestHandler = async (req, res) => {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Get brand by ID
export const getBrandById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await db.brand.findUnique({
      where: { id },
    });
    if (brand) {
      return res.status(200).json(brand);
    } else {
      return res.status(404).json({ message: "Brand not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Create a new brand
export const createBrand: RequestHandler = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existingBrand = await db.brand.findUnique({
      where: { slug },
    });

    if (existingBrand) {
      return res.status(409).json({ message: "Brand with this slug already exists" });
    }

    const newBrand = await db.brand.create({
      data: {
        name,
        slug,
      },
    });

    return res.status(201).json(newBrand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Update a brand
export const updateBrand: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, slug } = req.body;

    const existingBrand = await db.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const existingSlug = await db.brand.findUnique({
      where: { slug },
    });

    if (existingSlug && existingSlug.id !== id) {
      return res.status(409).json({ message: "Brand with this slug already exists" });
    }

    const updatedBrand = await db.brand.update({
      where: { id },
      data: {
        name: name ?? existingBrand.name,
        slug: slug ?? existingBrand.slug,
      },
    });

    return res.status(200).json(updatedBrand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Delete a brand
export const deleteBrand: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existingBrand = await db.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await db.brand.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
