import express from"express";
import {Account} from"../db"
import { authMiddleware } from "../middleware";
import mongoose from "mongoose";
const router=express.Router();

// to check the account balance 
router.get("/balance",async(req,res)=>{
    const account=await Account.findOne({
        user_id:req.user_id
    });
    res.json({
        balance:account.balance
    })
})

// to perform the transcations 
router.post("/transfer",authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    const{amount,to}=req.body;
    //fetch the account from transcation initates
    const account=await Account.findOne({user_id:req.user_id}).session(session);

    if(!Account|| Account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insufficient Balance"
        });
    }
    const toAccount=await Account.findOne({user_id:to}).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        });
    }

    //perform the transcation
    await Account.updateone({user_id:req.user_id},{$inc:{balance:-amount}}).session(session);
    await Account.updateone({user_id:to},{$inc:{balance:amount}}).session(session);

    await session.commitTransaction();
})



export default router;