import { db } from "@/db/db";
import { SaleRequestBody } from "@/types/types";
import { generateOrderNumber } from "@/utils/generateSaleNumber";
import { RequestHandler } from "express";
import { updateCustomer } from "./customers";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from "date-fns";
//? Get all sales
const getSales: RequestHandler = async (req, res) => {
  try {
    const sales = await db.sale.findMany({
      include: {
        SaleItems: true,
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//? transaction
const createSaleWithItems: RequestHandler = async (req, res) => {
  const {
    customerId,
    saleAmount,
    balanceAmount,
    paidAmount,
    saleType,
    paymentMethod,
    shopId,
    transactionCode,
    customerName,
    customerEmail,
    saleItems,
  }: SaleRequestBody = req.body;

  try {
    const saleId = await db.$transaction(async (transaction) => {

      if (balanceAmount>0) {
        //? if the customer  is allowed to take credit
        const existingCustomer = await transaction.customer.findUnique({
           where:{
            id:customerId
           }
        })
        if (!existingCustomer) {
          return res.status(404).json({
            error:"Customer not found", data:null
          })
        }
        if (balanceAmount > existingCustomer?.maxCreditLimit) {
          return res.status(400).json({
            error:`This Customer is not elligible for this credit: ${balanceAmount}`, data:null
          })
        }
        //? update the customer unpaid amount
        //? update the customer maxCreditAmount
        const updatedCustomer = await transaction.customer.update({
          where:{
            id:customerId
          },
          data:{
            unpaidCreditAmount:existingCustomer.unpaidCreditAmount +  balanceAmount
            ,
            maxCreditLimit:{
              decrement:balanceAmount
            }
          }
        })
        if (!updatedCustomer) {
          return res.status(500).json({ error: "Failed to update Customer credit details", data: null });
        }
      }
      // Create the Sale
      const sale = await transaction.sale.create({
        data: {
          customerId,
          saleNumber: generateOrderNumber(),
          saleAmount,
          balanceAmount,
          paidAmount,
          saleType,
          shopId,
          paymentMethod,
          transactionCode,
          customerName,
          customerEmail,
         
        },
      });

      if (saleItems && saleItems.length > 0) {
        for (const item of saleItems) {
          // Update Product stock quantity
          const updatedProduct = await transaction.product.update({
            where: { id: item.productId },
            data: {
              stockQty: {
                decrement: item.qty,
              },
            },
          });

          if (!updatedProduct) {
            // throw new Error(`Failed to update stock for product ID: ${item.productId}`);
            return res
              .status(500)
              .json({ error: "FAAILED TO UPDATE PRODUCT", data: null });
          }

          // Create Sale Item
          const saleItem = await transaction.saleItem.create({
            data: {
              qty: item.qty,
              salePrice: item.salePrice,
              productName: item.productName,
              productImage: item.productImage,
              saleId: sale.id,
              productId: item.productId,
            },
          });

          if (!saleItem) {
            return res
              .status(500)
              .json({ error: "FAAILED TO CREATE SALE ITEM", data: null });
          }
        }
      }

      return sale.id;
    });

    const sale = await db.sale.findUnique({
      where: {
        id: saleId as string,
      },
      include: {
        SaleItems: true,
      },
    });
    // console.log(savedLineOrder);
    return res.status(201).json({ error: null, data: sale });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ error: "something went wrong", data: null });
  }
};
//? Get sale by ID
const getSaleById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const sale = await db.sale.findUnique({
      where: { id },
      include: {
        SaleItems: true,
        customer: true,
      },
    });
    if (sale) {
      return res.status(200).json(sale);
    } else {
      return res.status(404).json({ message: "Sale not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Create a new sale
const createSale: RequestHandler = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      saleAmount,
      balanceAmount,
      paidAmount,
      saleType,
      paymentMethod,
      transactionCode,
      customerId,
      shopId
    } = req.body;

    const newSale = await db.sale.create({
      data: {
        customerName,
        customerEmail,
        saleAmount,
        balanceAmount,
        paidAmount,
        saleType,
        paymentMethod,
        transactionCode,
        customerId,
        shopId,
        saleNumber: generateOrderNumber(),
      },
      include: {
        SaleItems: true,
      },
    });

    return res.status(201).json(newSale);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Update a sale ---
const updateSale: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      customerName,
      customerEmail,
      saleAmount,
      balanceAmount,
      paidAmount,
      saleType,
      paymentMethod,
      transactionCode,
      customerId,
    } = req.body;

    const existingSale = await db.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const updatedSale = await db.sale.update({
      where: { id },
      data: {
        customerId: customerId ?? existingSale?.customerId,
        balanceAmount: balanceAmount ?? existingSale?.balanceAmount,
        paidAmount: paidAmount ?? existingSale?.paidAmount,
        saleType: saleType ?? existingSale?.saleType,
        paymentMethod: paymentMethod ?? existingSale?.paymentMethod,
        transactionCode: transactionCode ?? existingSale?.transactionCode,
        customerName: customerName ?? existingSale.customerName,
        customerEmail: customerEmail ?? existingSale.customerEmail,
        saleAmount: saleAmount ?? existingSale.saleAmount,
      },
      include: {
        SaleItems: true,
      },
    });

    return res.status(200).json(updatedSale);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? Delete a sale ---
const deleteSale: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existingSale = await db.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    await db.sale.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export {
  createSaleWithItems,
  deleteSale,
  updateSale,
  getSaleById,
  createSale,
  getSales,

};
