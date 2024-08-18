import { db } from "@/db/db";
import { Request, Response, RequestHandler } from "express";
const getCustomers: RequestHandler = async (req, res) => {
  const customers = await db.customer.findMany({
    orderBy:{
      createdAt:'desc'
    }
  })

  return res.status(200).json(customers);
};

//? getById
const getCustomerById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
  const customer = await db.customer.findUnique({//? awaitsiz islemir
    where:{
      id:id
    }
  })

  const oneCustomer = customer
  if (oneCustomer) {
    return res.status(200).json(oneCustomer);
  }else{
    return res.status(401).json({message:'axtardiginiz customer yoxdur'});
  }
  } catch (error) {
    console.log(error)
  }
 
};

const createCustomer: RequestHandler = async (req, res) => {
   const {name, email, phone} = req.body;
try {
    const newCustomer = await db.customer.create({
      data:{
        email:email,
        name:name,
        phone:phone
      }
    })

    return res.status(201).json(newCustomer);
} catch (error) {
  return res.status(400).json({message:error});
}
    
  
    
  };
  const getV2Customers: RequestHandler = async (req, res) => {
    const customers = [
      { name: "John Doe", email: "john.doe@example.com", phone: "+1234567890" },
      {
        name: "Joel Smith",
        email: "joel.smith@example.com",
        phone: "+0987654321",
      },
      {
        name: "Muke John",
        email: "john.muke@example.com",
        phone: "+0987654321",
      },
    ];
  
    return res.status(200).json(customers);
  };
export { getCustomers, getV2Customers, getCustomerById, createCustomer };
