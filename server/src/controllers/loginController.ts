import { db } from "@/db/db";
import { Request, Response, RequestHandler } from "express";
import bcyrpt from "bcrypt";
import { generateAccessToken } from "@/utils/generateJWT";
import { generateResetToken } from "@/utils/generateToken";
import { addMinutes } from "date-fns";
import { Resend } from "resend";
import {  generateEmailTemplate } from "@/utils/generateEmailTemplate";
const resend = new Resend(process.env.RESEND_API_KEY );
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

const forgotPassword: RequestHandler = async (req, res) => {
try {
  const {email} = req.body
  const existingEmail = await db.user.findUnique({
    where:{
      email
    }
  })

  if (!existingEmail) {
    return res.status(404).json({
      data:null,
      error:"bu qeydiyyatda olan email yoxdur"
    })
  }

  const resetToken = generateResetToken().toString()
  const resetTokenExpiry = addMinutes(new Date(), 10)
  const currentTime = new Date()



const newUpdatUser = await db.user.update({
  where:{
    email
  },
  data:{
    resetToken,
    resetTokenExpiry,
    
  }
})

//? Send Email - Resend
const emailHtml = generateEmailTemplate(resetToken)
const {data, error} = await resend.emails.send({
  from:"kerim <https://bakudoors.vercel.app/>",//? verigy your domain buraya aiddi
  to:email,
  subject:"",
  html:emailHtml
})

if (error) {
  return res.status(400).json({error})
}
const result = {
  userId:newUpdatUser.id,
  emailId:data?.id,
}
 return res.status(200).json({
  message:`Password reset send to email: ${email}`,
  data:result,
  error:null
})
// Prerequisites
// To get the most out of this guide, you’ll need to:

// Create an API key
// Verify your domain - bunlar mende yoxdu






  // return res.status(200).json({
  //   data:{resetToken, resetTokenExpiry, currentTime},
  //   error:null
  // })
} catch (error) {
  console.log(error)
  return res.status(500).json({
    data:null,
    error:"something went wrong"
  })
}
}

const verifyToken: RequestHandler = async (req, res) => {
  try {
    const{resetToken } = req.params;
    const existingUser = await db.user.findFirst({
      where:{
        resetToken,
        resetTokenExpiry:{gte: new Date()}
      }
    })

    if (!existingUser) {
      return res.status(400).json({
        data:null,
        error:"Invalid or expiry token"
      })
    }

    return res.status(200).json({
      error:null,
      data:"Token is Valid"
    })
  } catch (error) {
    
  }
}






export {
  authorizeUser,
  forgotPassword,
  verifyToken
};
