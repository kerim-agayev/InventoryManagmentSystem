import { db } from "@/db/db";
import { RequestHandler } from "express";
import { CustomerType, Gender } from "@prisma/client"; //

const getCustomers: RequestHandler = async (req, res) => {
  const customers = await db.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(customers);
};

//? getById
const getCustomerById: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await db.customer.findUnique({
      //? awaitsiz islemir
      where: {
        id: id,
      },
    });

    const oneCustomer = customer;
    if (oneCustomer) {
      return res.status(200).json(oneCustomer);
    } else {
      return res.status(401).json({ message: "axtardiginiz customer yoxdur" });
    }
  } catch (error) {
    console.log(error);
  }
};

const createCustomer: RequestHandler = async (req, res) => {
  const {
    customerType,
    firstName,
    lastName,
    phone,
    gender,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    dob,
    email,
    nationalID,
    country,
    location,
  } = req.body;
  
  
  try {
    //? upper case
    const normalizedCustomerType =
    customerType.toUpperCase() as keyof typeof CustomerType;
  const normalizedGender = gender.toUpperCase() as keyof typeof Gender;
  if (!Object.values(CustomerType).includes(normalizedCustomerType)) {
    return res.status(400).json({ message: "Invalid customer type." });
  }
  if (!Object.values(Gender).includes(normalizedGender)) {
    return res.status(400).json({ message: "Invalid gender." });
  }
    // Check if the phone, email, or nationalID is already taken
    const exisitingEmail = await db.customer.findUnique({
      where: {
        email,
      },
    });
    const exisitingPhone = await db.customer.findUnique({
      where: { phone },
    });
    const exisitingNationalID = await db.customer.findUnique({
      where: { nationalID },
    });
    if (exisitingEmail || exisitingPhone || exisitingNationalID) {
      res
        .status(409)
        .json({
          data: null,
          message: "email, national ve ya phone databasede qeydiyyatda var...",
        });
      return;
    }

    // Create a new customer
    const newCustomer = await db.customer.create({
      data: {
        customerType: normalizedCustomerType,
        firstName,
        lastName,
        phone,
        gender: normalizedGender,
        maxCreditLimit,
        maxCreditDays,
        taxPin,
        dob,
        email,
        nationalID,
        country,
        location,
      },
    });

    return res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//? update
const updateCustomer: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      customerType,
      firstName,
      lastName,
      phone,
      gender,
      maxCreditLimit,
      maxCreditDays,
      taxPin,
      dob,
      email,
      nationalID,
      country,
      location,
    } = req.body;

    // Check for unique fields
    const existingCustomer = await db.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if the phone, email, or nationalID is already taken by another customer

    // const updatedCustomer = await db.customer.update({
    //   where: { id },
    //   data: {
    //     customerType,
    //     firstName,
    //     lastName,
    //     phone,
    //     gender,
    //     maxCreditLimit,
    //     maxCreditDays,
    //     taxPin,
    //     dob,
    //     email,
    //     nationalID,
    //     country,
    //     location,
    //   },
    // });

    //return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//? delete
//? Delete Customer
const deleteCustomer: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const customer = await db.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await db.customer.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getCustomers,
  getCustomerById,
  createCustomer,
  deleteCustomer,
  updateCustomer,
};
