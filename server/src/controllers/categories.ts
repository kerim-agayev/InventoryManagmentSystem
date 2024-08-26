import { db } from "@/db/db";
import { RequestHandler } from "express";

//? Get all categories
export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Get category by ID
export const getCategoryById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await db.category.findUnique({
      where: { id },
    });
    if (category) {
      return res.status(200).json(category);
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Create a new category
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const existingCategory = await db.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(409).json({ message: "Category with this slug already exists" });
    }

    const newCategory = await db.category.create({
      data: {
        name,
        slug,
      },
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Update a category
export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, slug } = req.body;

    const existingCategory = await db.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const existingSlug= await db.category.findUnique({
        where:{
            slug
        }
    })
    if (existingSlug) {
        return res.status(400).json({
            data:null,
            error:"bu slug qeydiyyatda var"
        })
    }
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name :name ?? existingCategory.name,
        slug:slug ?? existingCategory.slug,
      },
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Delete a category
export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existingCategory = await db.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    await db.category.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
