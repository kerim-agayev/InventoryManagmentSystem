import { createShop, deleteShop, getShopById, getShops, updateShop, getShopAttendants } from "@/controllers/shops";
import expres from "express";
const shopRouter = expres.Router();

//? get all shops
shopRouter.get("/shops", getShops );
//? get all shop attendants
shopRouter.get("/shops/attendants/:id", getShopAttendants );

//? get by id
shopRouter.get("/shops/:id", getShopById );

//? create shop
shopRouter.post("/shops/", createShop);

//? update shop
shopRouter.put("/shops/:id", updateShop);

//? delete shop
shopRouter.delete("/shops/:id", deleteShop );


export default shopRouter;
