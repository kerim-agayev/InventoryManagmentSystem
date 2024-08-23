import { db } from "@/db/db";
import { Request, Response, RequestHandler } from "express";
import bcyrpt from "bcrypt";
import { generateAccessToken } from "@/utils/generateJWT";
//? get login
const authorizeUser: RequestHandler = async (req, res) => {
  try {
    //? receive the data
    const {
        email,
        username,
        password
      } = req.body;
      //? check the email, username
      let existingUser=null;
      console.log(`email:${email}`)
      if (email) {
         existingUser = await db.user.findUnique({
            where:{
                email
            }
          })
      }
      if (username) {
        existingUser = await db.user.findUnique({
            where:{
                username
            }
          })
      }
      
    
      //? if not existing user
      if (!existingUser) {
        return res.status(404).json({
            error:'User not found',
            data:null
        })
      }
      //? check the password - bcrypt
      const passwordMatch = await bcyrpt.compare(password, existingUser.password)
      if (!passwordMatch) {
        return res.status(404).json({
            error:'Wrong Credentials',
            data:null
        }).status(403)
      }
      //? destruct password
      const{password:_, ...others} = existingUser;
    
      //? json web token create
      const AccessToken = generateAccessToken(others)
   
      const result = {
        ...others
      }
    res.status(200).json({ data: result,accessToken:AccessToken, error: null });
  } catch (error) {
    res.status(500).json({ error: "error bas verdi.", data: null });
  }
};




export {
  authorizeUser,
};
