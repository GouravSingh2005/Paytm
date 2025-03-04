import mongoose from"mongoose"
import { type } from "os";
mongoose.connect("mongodb://localhost:27017/paytm");

const Schema=mongoose.schema;

const userSchema=new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    firstName:{type:String},
    lastName:{type:String}
});

const User=mongoose.model("User",userSchema);


module.exports={
    userSchema
}