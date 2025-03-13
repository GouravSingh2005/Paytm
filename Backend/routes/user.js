const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config"); 
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();
const saltRounds = 10;


const signupSchema = z.object({
    username: z.string(),
    email:z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
  });
// Signup Route
router.post("/signup", async (req, res) => {
   

    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message }); // Show only first error
    }

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ 
            $or: [{ username: req.body.username }, { email: req.body.email }] 
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create user
        const dbUser = await User.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        // Create account with random balance
        await Account.create({
            userId: dbUser._id,  
            balance: (1 + Math.random() * 10000).toFixed(2) 
        });

        // Generate JWT token
        const token = jwt.sign({ user_id: dbUser._id }, JWT_SECRET, { algorithm: "HS256" });

        return res.json({ message: "User Created Successfully", token });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
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

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET, { algorithm: "HS256" });
    return res.json({ message: "Login successful", token });
});

// Update User Route
const updateBody = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }).optional(),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }).optional()
});

router.put("/update", authMiddleware, async (req, res) => {
    const result = updateBody.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message }); // Show only first error
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

module.exports = router;
