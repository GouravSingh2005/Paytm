const express = require("express");
const { Account } = require("../db");  // Removed .js extension for CommonJS
const { authMiddleware } = require("../middleware");
const mongoose = require("mongoose");

const router = express.Router();

// ✅ Check account balance
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ user_id: req.user_id });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Perform transaction
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Fetch sender's account
        const account = await Account.findOne({ user_id: req.user_id }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Fetch recipient's account
        const toAccount = await Account.findOne({ user_id: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        // Perform the transaction
        await Account.updateOne({ user_id: req.user_id }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ user_id: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transaction failed", error });
    } finally {
        session.endSession();
    }
});

module.exports = router; // ✅ CommonJS export
