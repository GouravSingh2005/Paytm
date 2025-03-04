import express from "express";
import z from "zod";
import jwt from"jsonwebtoken";
import JWT_SECRET from "../config";
import {User} from "../db";
import bcrypt from "bcrypt";

const router=express.Router();
const signupSchema = z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(30, "First name must be at most 30 characters long")
      .trim(),
  
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(30, "Last name must be at most 30 characters long")
      .trim(),
  
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
    email: z
      .string()
      .email("Invalid email format")
      .trim(),
  
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be at most 50 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  });
  const saltRounds=10;

router.post("/signup",async (req,res)=>{
    const username=req.body.username;
    const {success}=signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message:"Incorrect email taken/Input creditionals",
        })
    }
    const user=await User.findOne({
        username:req.body.username,
    })

    if(user.user_id){
        return res.json({
            message:"Email already registerd/user registerd already with this email"
        })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const dbuser=await User.create({
        email:req.body.email,
        password:hashedPassword,
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    });
    const token=jwt.sign({
       user_id:dbuser._id
    },JWT_SECRET)
    return res.json({
        message:"User Created Sucessfully",
        token
    })
})
router.post("/signin",async(req,res)=>{
const email=req.body.username;
const password=req.body.password;
const user=await User.findOne({email});
    if(!user){
        return res.json({
            message:"user not registerd "
        })
    }
    const userpassword=await bcrypt.compare(password,user.password);
    if(!userpassword){
        return res.json({
            message:"Password is incorrect"
        })
    }
    const token = jwt.sign({ user_id: user._id }, JWT_SECRET);

    return res.json({ message: "Login successful", token });

})

module.exports=router;