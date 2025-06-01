import express,{Request,Response} from "express"
import { authMiddleware } from "../middleware/authmiddleware";
import {Account} from "../db";
import mongoose from "mongoose";


export const router = express.Router()

router.get("/balance",authMiddleware,async(req:Request,res:Response):Promise<any>=>{
    const userId = req.userId;

    try{
        const account = await Account.findOne({userId:userId});
        return res.status(200).json({
            message:"Balance fetched Successfully!",
            balance:account.balance,
        });
    }catch(error){
        return res.status(411).json({
            message:"Unable to fetch balance at this moment.Please try again later!"
        });
    }
});

router.post("/transfer",authMiddleware,async(req:Request,res:Response):Promise<any>=>{
    const session = await mongoose.startSession();

    session.startTransaction();
    try{
        const amount = req.body.amount;
        const to = new mongoose.Types.ObjectId(req.body.to);
        console.log("Transfer to:", to);
        const userId = req.userId;

        const fromAccount = await Account.findOne({userId:userId}).session(session);
        console.log(fromAccount);
        if(!fromAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message:"Sender account not found!"
            })
        }
         if(fromAccount.balance<amount){
            await session.abortTransaction();
            return res.status(400).json({
                message:"Insufficient balance!"
            })
        }

        const toAccount = await Account.findOne({userId:to}).session(session);
        console.log(toAccount);
        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message:"reciever account not found!"
            })
        }
        

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        return res.status(200).json({
            message:"Transfer successful!",
        });
    }catch(error){
        await session.abortTransaction();
        return res.status(500).json({
            message:"Error occured while transaction!"
        });
    }
});