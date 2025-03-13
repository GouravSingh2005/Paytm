const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Gourav:Gourav%40123@cluster0.x5vcj.mongodb.net/paytm")
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.log("Database connection error:", err));




const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    firstName:{type:String},
    lastName:{type:String}
});

const User=mongoose.model("User",userSchema);

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance: {
        type:Number,
        required:true
    }
});
const Account=mongoose.model("Account",accountSchema)
module.exports={
    User,
    Account
}