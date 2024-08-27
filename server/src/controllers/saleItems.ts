import { db } from "@/db/db";
import { RequestHandler } from "express";

//? Get all sale items
export const getSaleItems: RequestHandler = async (req, res) => {
  try {
    const saleItems = await db.saleItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(saleItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Get sale item by ID
export const getSaleItemById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const saleItem = await db.saleItem.findUnique({
      where: { id },
    });
    if (saleItem) {
      return res.status(200).json(saleItem);
    } else {
      return res.status(404).json({ message: "Sale item not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Create a new sale and sale item
export const createSaleItem: RequestHandler = async (req, res) => {
  try {
    const {  qty,
      salePrice,
      productName,
      productImage,
      saleId,
      productId} = req.body;

    const newSaleItem = await db.saleItem.create({
      data: {
        qty,
        salePrice,
        productName,
        productImage,
        saleId,
        productId,
      },
    });

    return res.status(201).json(newSaleItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Update a sale item ---
export const updateSaleItem: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { qty, salePrice, productName, productImage,saleId, productId } = req.body;

    const existingSaleItem = await db.saleItem.findUnique({
      where: { id },
    });

    if (!existingSaleItem) {
      return res.status(404).json({ message: "Sale item not found" });
    }

    const updatedSaleItem = await db.saleItem.update({
      where: { id },
      data: {
        qty: qty ?? existingSaleItem.qty,
        salePrice: salePrice ?? existingSaleItem.salePrice,
        productName: productName ?? existingSaleItem.productName,
        productImage: productImage ?? existingSaleItem.productImage,
        saleId: saleId ?? existingSaleItem.saleId,
        productId: productId ?? existingSaleItem.productId,
      },
    });

    return res.status(200).json(updatedSaleItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Delete a sale item ---
export const deleteSaleItem: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existingSaleItem = await db.saleItem.findUnique({
      where: { id },
    });

    if (!existingSaleItem) {
      return res.status(404).json({ message: "Sale item not found" });
    }

    await db.saleItem.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Sale item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
