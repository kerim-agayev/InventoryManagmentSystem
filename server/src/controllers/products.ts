import { db } from "@/db/db";
import { RequestHandler } from "express";

//? Get all products
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        unit: true,
        brand: true,
        supplier: true,
      },
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Get product by ID
export const getProductById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        unit: true,
        brand: true,
        supplier: true,
      },
    });
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Create a new product
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      sku,
      productCode,
      slug,
      quantity,
      unitPrice,
      costPrice,
      reorderPoint,
      imageUrl,
      weight,
      dimensions,
      taxRate,
      notes,
      categoryId,
      unitId,
      brandId,
      supplierId,
      description,
      expiryDate,
      alertQty,
      stockQty,
      batchNumber,
      barCode,
    } = req.body;

    // Unique alanlar için kontroller
    const existingSku = await db.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      return res.status(409).json({ message: "Product with this SKU already exists" });
    }

    // Check for existing slug
    const existingSlug = await db.product.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return res.status(409).json({ message: "Product with this SLUG already exists" });
    }
    const existingProductCode = await db.product.findUnique({
      where: { productCode },
    });

    if (existingProductCode) {
      return res.status(409).json({ message: "Product with this productCode already exists" });
    }

    // Check for existing barCode
    const existingBarCode = await db.product.findUnique({
      where: { barCode },
    });

    if (existingBarCode) {
      return res.status(409).json({ message: "Product with this barCode already exists" });
    }

    const newProduct = await db.product.create({
      data: {
        name,
        sku,
        productCode,
        slug,
        quantity,
        unitPrice,
        costPrice,
        reorderPoint,
        imageUrl,
        weight,
        dimensions,
        taxRate,
        notes,
        categoryId,
        unitId,
        brandId,
        supplierId,
        description,
        expiryDate,
        alertQty,
        stockQty,
        batchNumber,
        barCode,
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



//? Update a product
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      sku,
      productCode,
      slug,
      quantity,
      unitPrice,
      costPrice,
      reorderPoint,
      imageUrl,
      weight,
      dimensions,
      taxRate,
      notes,
      categoryId,
      unitId,
      brandId,
      supplierId,
      description,
      expiryDate,
      alertQty,
      stockQty,
      batchNumber,
      barCode,
    } = req.body;

    // Ürün mevcut mu kontrol et
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // SKU kontrolü
    if (sku && sku !== existingProduct.sku) {
      const existingSku = await db.product.findUnique({
        where: { sku },
      });
      if (existingSku) {
        return res.status(409).json({ message: "Product with this SKU already exists" });
      }
    }

    // SLUG kontrolü
    if (slug && slug !== existingProduct.slug) {
      const existingSlug = await db.product.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        return res.status(409).json({ message: "Product with this SLUG already exists" });
      }
    }

    // ProductCode kontrolü
    if (productCode && productCode !== existingProduct.productCode) {
      const existingProductCode = await db.product.findUnique({
        where: { productCode },
      });
      if (existingProductCode) {
        return res.status(409).json({ message: "Product with this productCode already exists" });
      }
    }

    // BarCode kontrolü
    if (barCode && barCode !== existingProduct.barCode) {
      const existingBarCode = await db.product.findUnique({
        where: { barCode },
      });
      if (existingBarCode) {
        return res.status(409).json({ message: "Product with this barCode already exists" });
      }
    }

    // Ürünü güncelle
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        name: name ?? existingProduct.name,
        sku: sku ?? existingProduct.sku,
        productCode: productCode ?? existingProduct.productCode,
        slug: slug ?? existingProduct.slug,
        quantity: quantity ?? existingProduct.quantity,
        unitPrice: unitPrice ?? existingProduct.unitPrice,
        costPrice: costPrice ?? existingProduct.costPrice,
        reorderPoint: reorderPoint ?? existingProduct.reorderPoint,
        imageUrl: imageUrl ?? existingProduct.imageUrl,
        weight: weight ?? existingProduct.weight,
        dimensions: dimensions ?? existingProduct.dimensions,
        taxRate: taxRate ?? existingProduct.taxRate,
        notes: notes ?? existingProduct.notes,
        categoryId: categoryId ?? existingProduct.categoryId,
        unitId: unitId ?? existingProduct.unitId,
        brandId: brandId ?? existingProduct.brandId,
        supplierId: supplierId ?? existingProduct.supplierId,
        description: description ?? existingProduct.description,
        expiryDate: expiryDate ?? existingProduct.expiryDate,
        alertQty: alertQty ?? existingProduct.alertQty,
        stockQty: stockQty ?? existingProduct.stockQty,
        batchNumber: batchNumber ?? existingProduct.batchNumber,
        barCode: barCode ?? existingProduct.barCode,
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


  

//? Delete a product
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await db.product.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//? delete all product
export const deleteAllProduct: RequestHandler = async (req, res) => {
  try {
   

    await db.product.deleteMany();

    return res.status(200).json({ message: "All Products deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};