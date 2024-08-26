import { db } from "@/db/db";
import { RequestHandler } from "express";

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
      customerId,
      orderNumber,
      orderAmount,
      balanceAmount,
      paidAmount,
      orderType,
      orderStatus,
      paymentStatus,
      paymentMethod,
      transactionCode,
      customerName,
      customerEmail,
    //   SaleItems,
    } = req.body;

    //? check unique
    const existingOrderNumber = await db.sale.findUnique({
        where:{
            orderNumber
        }
    })
    if (existingOrderNumber) {
        return res.status(400).json({
            data:null,
            error:"order number qeydiyyatda var."
        })
    }
    const newSale = await db.sale.create({
      data: {
        customerId,
        orderNumber,
        orderAmount,
        balanceAmount,
        paidAmount,
        orderType,
        orderStatus,
        paymentStatus,
        paymentMethod,
        customerName,
        customerEmail,
        transactionCode,
        // SaleItems: {
        //   create: SaleItems,
        // },
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

//? Update a sale
const updateSale: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      customerId,
      orderNumber,
      orderAmount,
      balanceAmount,
      paidAmount,
      orderType,
      orderStatus,
      paymentStatus,
      paymentMethod,
      transactionCode,
    } = req.body;

    const existingSale = await db.sale.findUnique({
      where: { id },
    });

    if (!existingSale) {
        return res.status(404).json({ message: "Sale not found" });
      }


      if (orderNumber && orderNumber != existingSale.orderNumber) {
        const existingOrder = await db.sale.findUnique({
            where: { orderNumber },
          });
          if (existingOrder) {
            return res.status(409).json({ message: "Sale with this ORDER NUMBER already exists" });
          }


      }
  
  
    

    const updatedSale = await db.sale.update({
      where: { id },
      data: {
        customerId:customerId ?? existingSale?.customerId,
        orderNumber:orderNumber ?? existingSale?.orderNumber,
        orderAmount:orderAmount ?? existingSale?.orderAmount,
        balanceAmount:balanceAmount ?? existingSale?.balanceAmount,
        paidAmount:paidAmount ?? existingSale?.paidAmount,
        orderType:orderType ?? existingSale?.orderType,
        orderStatus:orderStatus ?? existingSale?.orderStatus,
        paymentStatus:paymentStatus ?? existingSale?.paymentStatus,
        paymentMethod:paymentMethod ?? existingSale?.paymentMethod,
        transactionCode:transactionCode ?? existingSale?.transactionCode,
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

//? Delete a sale
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


export{createSale, deleteSale, updateSale, getSaleById, getSales}