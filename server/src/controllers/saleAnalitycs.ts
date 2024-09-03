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



//? shop sale analitycs
const  getShopSalesAnalitcs :RequestHandler=async (req, res) =>  {
    const { shopId } = req.params;
const existingShop = await db.shop.findUnique({
    where:{
        id:shopId
    }
})
if (!existingShop) {
    return res.status(400).json({
        data:null,
        error:"shop does not exist"
    })
}
    // Define time periods
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
   
    try {
      // Fetch sales for different periods
      const categorizeSales = async (sales: any[]) => {
        return {
          total:sales,
          salesPaidInCash: sales.filter(
            (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
          ),
          salesPaidInCredit: sales.filter(
            (sale) =>  sale.balanceAmount > 0
          ),
          salesByMobileMoney: sales.filter(
            (sale) => sale.paymentMethod === "MOBILEMONEY"
          ),
          salesByHandCash: sales.filter(
            (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
          ),
        };
      };
   
      const salesToday = await db.sale.findMany({
        where: {
          shopId,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });
   
      const salesThisWeek = await db.sale.findMany({
        where: {
          shopId,
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      });
   
      const salesThisMonth = await db.sale.findMany({
        where: {
          shopId,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });
   
      const salesAllTime = await db.sale.findMany({
        where: {
          shopId,
        },
      });
   
      res.status(200).json({
        today: await categorizeSales(salesToday),
        thisWeek: await categorizeSales(salesThisWeek),
        thisMonth: await categorizeSales(salesThisMonth),
        allTime: await categorizeSales(salesAllTime),
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong",
        data: null,
      });
    }
  } 
  //? shop sales analitycs
 const  getShopsSales: RequestHandler = async(req, res)  => {
    // Define time periods
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
   
    try {
        //fetch
        const fetchSalesData = async(startDate:Date,endDate:Date) => {
return await db.sale.findMany({
    where:{
        createdAt:{
            gte:startDate,
            lte:endDate
        }
    },
    select:{
        shopId:true,
        saleAmount:true,
        paidAmount:true,
        balanceAmount:true,
        paymentMethod:true,
        saleType:true

    }
})
        }
      // Fetch all sales and group by shopId for different periods
      const categorizeSales = (sales: any[]) => {
        return {
            totalSales:sales,
          salesPaidInCash: sales.filter(
            (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
          ),
          salesPaidInCredit: sales.filter(
            (sale) => sale.balanceAmount > 0
          ),
          salesByMobileMoney: sales.filter(
            (sale) => sale.paymentMethod === "MOBILEMONEY"
          ),
          salesByHandCash: sales.filter(
            (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
          ),
        };
      };
   
    const salesToday = await fetchSalesData(todayStart, todayEnd)

   
    const salesThisWeek = await fetchSalesData(weekStart, weekEnd)
   const salesThisMonth =  await fetchSalesData(monthStart, monthEnd)
   
     const salesAllTime = await db.sale.findMany({
        select:{
            shopId:true,
            saleAmount:true,
            paidAmount:true,
            balanceAmount:true,
            paymentMethod:true,
            saleType:true
        }
     })
   
      res.status(200).json({
        today: categorizeSales(salesToday),
        thisWeek: categorizeSales(salesThisWeek),
        thisMonth: categorizeSales(salesThisMonth),
        allTime: categorizeSales(salesAllTime),
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong",
        data: null,
      });
    }
  }
  export {
    getShopSalesAnalitcs,
  getShopsSales
  
  };
  