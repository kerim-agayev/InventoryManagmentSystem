import { db } from "@/db/db";
import { Request, Response, RequestHandler } from "express";
import bcyrpt from 'bcrypt'
//? get all users
const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await db.user.findMany();
    const filteredUsers = users.map(item => {
      const {password:_, ...others} = item
      return others
    })
    res.status(200).json({data:filteredUsers , error:null});
  } catch (error) {
    res.status(500).json({ error: "error bas verdi.", data:null });
  }
};
// get attendants
const getAttendants: RequestHandler = async (req, res) => {
  try {
    const users = await db.user.findMany({
      where:{
        role:'ATTENDANT'
      }
    });
    const filteredUsers = users.map(item => {
      const {password:_, ...others} = item
      return others
    })
    res.status(200).json({data:filteredUsers , error:null});
  } catch (error) {
    res.status(500).json({ error: "error bas verdi.", data:null });
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
    const {password:_, ...others} = user;
    res.status(200).json({data:others, error:null});
  } catch (error) {
    res.status(500).json({ error: "error bas verdi.", data:null });
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
    console.error("istifadeci yaradilarken xeta :", error); // Hatayı loglayın
    res.status(500).json({ error: "istifadeci yaradilarken xeta  bas verdi" , data:null});
  }
};


//? update user 
const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    username,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;

  try {
    // check
    const user = await db.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found.", data: null });
    }

    // update user
    const updatedUser = await db.user.update({
      where: { id: id },
      data: {
        email: email ?? user.email,
        username: username ?? user.username,
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        phone: phone ?? user.phone,
        dob: dob ? new Date(dob) : user.dob,
        gender: gender ?? user.gender,
        image: image ?? user.image,
        role: role ?? user.role,
      },
    });

    // 
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ data: userWithoutPassword, error: null });
  } catch (error) {
    res.status(500).json({ error: "Istifadeci melumatlari yenilenerken xeta bas verdi.", data: null });
  }
};

//? update user password
const updateUserPassword: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    // check
    const user = await db.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found.", data: null });
    }

    // Hashing
    const hashedPassword = await bcyrpt.hash(password, 10);

    // update
    const updatedUser = await db.user.update({
      where: { id: id },
      data: {
        password: hashedPassword,
      },
    });

    // 
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ data: userWithoutPassword, error: null });
  } catch (error) {
    res.status(500).json({ error: "Password yenilenerken xeta bas verdi.", data: null });
  }
};

//? delete user
const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    // check
    const user = await db.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found.", data: null });
    }

    // delete user
    await db.user.delete({
      where: { id: id },
    });

    res.status(200).json({ data: "User deleted successfully.", error: null });
  } catch (error) {
    res.status(500).json({ error: "Istifadeci silinerken xeta bas verdi.", data: null });
  }
};


export { createUser, getUsers, getUserById, updateUser, deleteUser, updateUserPassword, getAttendants };
