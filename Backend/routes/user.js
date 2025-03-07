const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config"); 
const { User, Account } = require("../db");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupSchema = z.object({
    firstName: z.string().min(2).max(30).trim(),
    lastName: z.string().min(2).max(30).trim(),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email().trim(),
    password: z.string().min(8).max(50)
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a digit")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

const saltRounds = 10;

// Signup Route
router.post("/signup", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Invalid input credentials" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const dbUser = await User.create({
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    await Account.create({
        user_id: dbUser._id, // Fixed user_id reference
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ user_id: dbUser._id }, JWT_SECRET);
    return res.json({ message: "User Created Successfully", token });
});

// Signin Route
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET);
    return res.json({ message: "Login successful", token });
});

// Update User Route
const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
});

router.put("/update", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: "Error while updating information" });
    }

    await User.updateOne({ _id: req.user_id }, req.body);
    return res.json({ message: "Updated successfully" });
});

// Bulk User Fetch Route
router.get("/bulk", async (req, res) => {
    try {
        const filter = req.query.filter || "";
        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } }
            ]
        });

        res.json({
            users: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router; // ✅ Export in CommonJS format
