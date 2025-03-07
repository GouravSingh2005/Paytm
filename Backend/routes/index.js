const express = require("express");

const userRouter = require("./user.js"); 
const AccountRouter = require("./account.js"); 

const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/account", AccountRouter);

module.exports = mainRouter; 
