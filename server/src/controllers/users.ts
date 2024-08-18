import { db } from "@/db/db";
import { Request, Response, RequestHandler } from "express";
import bcyrpt from 'bcrypt'
//? get all users
const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await db.user.findMany();
    res.status(200).json({data:users, error:null});
  } catch (error) {
    res.status(500).json({ error: "error bas verdi." });
  }
};

//? get user by id
const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return res.status(404).json({ error: "user not found." });
    }
    res.status(200).json({data:user, error:null});
  } catch (error) {
    res.status(500).json({ error: "error bas verdi." });
  }
};

//? create user
const createUser: RequestHandler = async (req, res) => {
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;
  try {
    //?1. check user validation - bunun icin middleware yazmaq olar
    //?2. check user email, phone, username
    const exisitingUserEmail = await db.user.findUnique({
        where:{email}
    })
    const exisitingUserPhone = await db.user.findUnique({
        where:{phone}
    })
    const exisitingUserUsername = await db.user.findUnique({
        where:{username}
    })
    if (exisitingUserEmail || exisitingUserPhone || exisitingUserUsername) {
       res.status(409).json({data:null,message:'email, username ve ya phone databasede qeydiyyatda var...'})
       return ;
    }
    //?3. hash the password
    const hashedPassword = await bcyrpt.hash(password, 10)

    //?4. create user
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password : hashedPassword,
        firstName,
        lastName,
        phone,
        dob: dob ? new Date(dob) : undefined,
        gender,
        image: image? image : 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg',
        role,
      },
    });
    //?5. verification code
    //?6. modify the returned user
 
    const { password: _, ...userWithoutPassword } = newUser;

    // 5. Kullanıcıyı geri döndürme
    res.status(201).json({ data: userWithoutPassword, error: null });
  } catch (error) {
    res.status(500).json({ error: "istifadeci yaradilarken xeta  bas verdi" });
  }
};

export { createUser, getUsers, getUserById };
