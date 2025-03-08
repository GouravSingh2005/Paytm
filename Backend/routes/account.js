const express = require("express");
const { Account } = require("../db"); 
const { authMiddleware } = require("../middleware");
const mongoose = require("mongoose");

const router = express.Router();


router.get("/balance", authMiddleware, async (req, res) => {
    try {
       

        const account = await Account.findOne({ userId: new mongoose.Types.ObjectId(req.user_id) });

      

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        
        res.status(500).json({ message: "Server error", error });
    }
});


router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        if (!amount || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid amount" });
        }


        const account = await Account.findOne({ userId: new mongoose.Types.ObjectId(req.user_id) }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: new mongoose.Types.ObjectId(to) }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        
        await Account.updateOne({ userId: new mongoose.Types.ObjectId(req.user_id) }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: new mongoose.Types.ObjectId(to) }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction error:", error); 
        res.status(500).json({ message: "Transaction failed", error });
    } finally {
        session.endSession();
    }
});

module.exports = router; 
