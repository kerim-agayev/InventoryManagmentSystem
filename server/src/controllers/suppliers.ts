import { db } from "@/db/db";
import { Request, Response } from "express";

// Get all suppliers
export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await db.supplier.findMany();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

// Get supplier by ID
export const getSupplierById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const supplier = await db.supplier.findUnique({ where: { id } });
    if (supplier) {
      res.status(200).json(supplier);
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
};

// Create a new supplier
export const createSupplier = async (req: Request, res: Response) => {
  const { supplierType, name, contactPerson, location, rating, country, phone, email, website, taxPin, registrationNumber, bankAccountNumber, paymentTerms, logo, creditScore } = req.body;
  try {

    //? check unique registrationNumber, phone, email
    const exisitingEmail = await db.supplier.findUnique({
      where:{email}
  })
  const exisitingPhone = await db.supplier.findUnique({
      where:{phone}
  })
  const exisitingRegistrationNumber = await db.supplier.findUnique({
      where:{registrationNumber}
  })
  if (exisitingEmail || exisitingPhone || exisitingRegistrationNumber) {
     res.status(409).json({data:null,message:'email, registrationNumber ve ya phone databasede qeydiyyatda var...'})
     return ;
  }



    //? create supplier
    const newSupplier = await db.supplier.create({
      data: {
        supplierType,
        name,
        contactPerson,
        location,
        rating,
        country,
        phone,
        email,
        website,
        taxPin,
        registrationNumber,
        bankAccountNumber,
        paymentTerms,
        logo,
        creditScore,
      },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: "Failed to create supplier" });
  }
};

//? Update a supplier
export const updateSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { supplierType, name, contactPerson, location, rating, country, phone, email, website, taxPin, registrationNumber, bankAccountNumber, paymentTerms, logo, creditScore } = req.body;
  try {
  //? check existing supplier
  const existingSupplier = await db.supplier.findUnique({
    where: { id: id },
  });

  if (!existingSupplier) {
    return res.status(404).json({ error: "Supplier not found.", data: null });
  }
 //? check unique registrationNumber, phone, email 

 if (email && email !== existingSupplier?.email) {
  const exisitingSupplierEmail = await db.supplier.findUnique({
    where: { email },
  });
  if (exisitingSupplierEmail) {
    res
      .status(409)
      .json({ data: null, message: "email databasede qeydiyyatda var..." });
    return;
  }
}
if (phone && phone !== existingSupplier?.phone) {
  const exisitingSupplierPhone = await db.supplier.findUnique({
    where: { phone },
  });
  if (exisitingSupplierPhone) {
    res
      .status(409)
      .json({ data: null, message: "phone databasede qeydiyyatda var..." });
    return;
  }
}
if (registrationNumber && registrationNumber !== existingSupplier?.registrationNumber) {
  const exisitingRegNumber = await db.supplier.findUnique({
    where: { registrationNumber },
  });
  if (exisitingRegNumber) {
    res
      .status(409)
      .json({
        data: null,
        message: "registrationNumber databasede qeydiyyatda var...",
      });
    return;
  }
}





    const updatedSupplier = await db.supplier.update({
      where: { id },
      data: {
        supplierType:supplierType ?? existingSupplier.supplierType,
        name:name ?? existingSupplier.name,
        contactPerson:contactPerson ?? existingSupplier.contactPerson,
        location:location ?? existingSupplier.location,
        rating:rating ?? existingSupplier.rating,
        country:country ?? existingSupplier.country,
        phone:phone ?? existingSupplier.phone,
        email:email ?? existingSupplier.email,
        website:website ?? existingSupplier.website,
        taxPin:taxPin ?? existingSupplier.taxPin,
        registrationNumber:registrationNumber ?? existingSupplier.registrationNumber,
        bankAccountNumber:bankAccountNumber ?? existingSupplier.bankAccountNumber,
        paymentTerms:paymentTerms ?? existingSupplier.paymentTerms,
        logo:logo ?? existingSupplier.logo,
        creditScore:creditScore ?? existingSupplier.creditScore,
      },
    });
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ error: "Failed to update supplier" });
  }
};

// Delete a supplier
export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.supplier.delete({ where: { id } });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete supplier" });
  }
};
