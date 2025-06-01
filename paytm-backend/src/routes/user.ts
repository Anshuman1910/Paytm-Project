import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { User } from "../db";
import { Account } from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware/authmiddleware";


export const router = express.Router();

const signupBody = z.object({
    firstName: z.string().min(5).max(30),
    lastName: z.string().min(5).max(30),
    username: z.string().min(5).max(30),
    password: z.string().min(8).max(15),
});

type SignupInput = z.infer<typeof signupBody>;

router.post("/signup", async (req: Request<{}, {}, SignupInput>, res: Response):Promise<any> => {
    const body = req.body;
    try{
    const parseResult = signupBody.safeParse(body);

    if (!parseResult.success) {
        return res.status(400).json({
            message: "Incorrect Credentials",
        });
    }

    const existingUser = await User.findOne({ username: body.username });
    if (existingUser) {
        return res.status(400).json({
            message: "Username already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        username: body.username,
        password: hashedPassword,
    });

    return res.status(201).json({
        message: "User created successfully",
        user,
    });
}catch(error){
    return res.status(500).json({
        message:"Error while creating user!"
    });
}  
});

router.post("/login",async(req:Request,res:Response):Promise<any>=>{
    const body = req.body;

    try{
    const user = await User.findOne({
        username:body.username
    });
    console.log(user);

    if(!user){
        return res.status(400).json({
            message:"No User found!"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(body.password,user.password)

    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Incorrect Password!"
        });
    }

    const userId = user._id;
    await Account.create({
        userId:userId,
        balance:1+Math.random()*10000,
    })

    const token = jwt.sign({id:user._id},JWT_SECRET);
    return res.status(200).json({
        message:"Login successful!",
        token
    });
}catch(error){
    return res.status(500).json({
        message:"Error while signing in!"
    });
} 
    
});

const updateBody = z.object({
    firstname:z.string().min(5).max(30).optional(),
    lastname:z.string().min(5).max(30).optional(),
    password:z.string().min(8).max(15).optional(),
});

type updateInput = z.infer<typeof updateBody>;

router.put("/update",authMiddleware,async(req:Request<{},{},updateInput>,res:Response):Promise<any>=>{
    const body = req.body;
    const userId = req.userId;

    try{
        const parsedBody = updateBody.safeParse(body);
        if(!parsedBody.success){
            return res.status(400).json({
                message:"Invalid body!"
            })
        }

        const user = await User.findOne({_id:userId})
        if(!user){
            return res.status(400).json({
                message:"No user found!"
            })
        }

        const updatedUser = await User.findOneAndUpdate({_id:userId},body);
        return res.status(200).json({
            message:"User updated Successfully!",
            updatedUser
        })
    }catch(error){
        return res.status(411).json({
            message:"Error while updating user!"
        });
    }
});

interface userType{
    firstName:String,
    lastName:String,
    username:String,
    password?:String,
    _id:String
}


router.get("/bulk",async(req:Request,res:Response):Promise<any>=>{
    const filter = req.query.filter|| "";

    try{
    const users = await User.find({
        $or:[ { firstName: { "$regex": filter, "$options": "i" } },
            { lastName: { "$regex": filter, "$options": "i" } }]
    })

    return res.json({
        users:users.map((user:userType)=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
  }catch(error){
    return res.status(411).json({
        message:"Error while fetching users!"
    })
  } 
})


/* This specific route `router.get("/me", authMiddleware, async (req: Request, res:
Response):Promise<any> => { ... }` is responsible for fetching the details of the currently
authenticated user. Here's a breakdown of what it does: */
router.get("/me", authMiddleware, async (req: Request, res: Response):Promise<any> => {
  try {
    const user = await User.findById(req.userId).select("firstName lastName balance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ message: "Server error" });
  }
});