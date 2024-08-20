import { db } from "@/db/db";
import { Request, Response, RequestHandler } from "express";
import bcyrpt from 'bcrypt'
//? get all Shops
const getShops: RequestHandler = async (req, res) => {
    try {
      const shops = await db.shop.findMany();
      res.status(200).json({ data: shops, error: null });
    } catch (error) {
      res.status(500).json({ error: "Xeta bas verdi", data: null });
    }
  };
  //? get all Shop Attendants
  const getShopAttendants: RequestHandler = async (req, res) => {
    try {
      //?
      const shopId = req.params.id;//? shop id
      
      // Mağazayı tap
      const shop = await db.shop.findUnique({
        where: { id: shopId as string },
      });
      console.log(`existing shop:${JSON.stringify(shop)}`)
  
      // 
      if (!shop) {
        return res.status(404).json({ error: "Mağaza tapilmadi.", data: null });
      }

      const attendants = await db.user.findMany({
        where:{
          id:{
            in:shop.attendantIds
          }
        },
        // select: {
        //   id: true,
        //   email: true,
        //   username: true,
        //   firstName: true,
        //   lastName: true,
        //   phone: true,
        //   dob: true,
        //   gender: true,
        //   image: true,
        //   role: true,
        //   createdAt: true,
        //   updatedAt: true,
        // },
      })
      console.log(`existing shop atendants:${attendants}`)
      const sanitizedAttendants = attendants.map(({ password, ...rest }) => rest);//! yeni istifade
      // Mağaza tapildi
      res.status(200).json({ data: sanitizedAttendants, error: null });
    } catch (error) {
      res.status(500).json({ error: "Xeta bas verdi.", data: null });
    }
  };
  

//? get Shop by id
const getShopById: RequestHandler = async (req, res) => {
    const { id } = req.params;
  
    try {
      const shop = await db.shop.findUnique({
        where: { id },
      });
  
      if (!shop) {
        return res.status(404).json({ error: "Mağaza tapilmadi.", data: null });
      }
  
      res.status(200).json({ data: shop, error: null });
    } catch (error) {
      res.status(500).json({ error: "Xeta bas verdi.", data: null });
    }
  };

//? create Shop
const createShop: RequestHandler = async (req, res) => {
    const { name, slug, location, adminId, attendantIds } = req.body;
  
    try {

  //? check
  const exisitingShop = await db.shop.findUnique({
    where:{slug}
  })
  if (exisitingShop) {
    res.status(409).json({ data: null, error: `shop ${slug} is already existing` });
    return 
  }
  //? create 
  const newShop = await db.shop.create({
    data: {
      name,
      slug,
      location,
      adminId,
      attendantIds
    },
  });
      res.status(201).json({ data: newShop, error: null });
    } catch (error) {
      res.status(500).json({ error: "Xeta bas verdi.", data: null });
    }
  };


//? update Shop 
const updateShop: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { name, slug, location, adminId, attendantIds } = req.body;
  
    try {
      const shop = await db.shop.findUnique({
        where: { id },
      });
  
      if (!shop) {
        return res.status(404).json({ error: "Mağaza tapilmadi.", data: null });
      }
  
      const updatedShop = await db.shop.update({
        where: { id },
        data: {
          name: name ?? shop.name,
          slug: slug ?? shop.slug,
          location: location ?? shop.location,
          adminId: adminId ?? shop.adminId,
          attendantIds: attendantIds ?? shop.attendantIds,
        },
      });
  
      res.status(200).json({ data: updatedShop, error: null });
    } catch (error) {
      res.status(500).json({ error: "Xeta bas verdi.", data: null });
    }
  };

//? delete Shop
const deleteShop: RequestHandler = async (req, res) => {
    const { id } = req.params;
  
    try {
      const shop = await db.shop.findUnique({
        where: { id },
      });
  
      if (!shop) {
        return res.status(404).json({ error: "Mağaza tapilmadi.", data: null });
      }
  
      await db.shop.delete({
        where: { id },
      });
  
      res.status(200).json({ data: "Mağaza ugurla silindi.", error: null });
    } catch (error) {
      res.status(500).json({ error: "Xeta bas verdi", data: null });
    }
  };


export { createShop, getShops, getShopById, updateShop, deleteShop, getShopAttendants};
