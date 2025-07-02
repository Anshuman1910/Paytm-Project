
import mongoose from "mongoose";
const {Schema,model} = mongoose;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:5,
        maxLength:30,
        trim:true,
    },
    lastName:{
        type:String,
        minlength:5,
        maxlength:30,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        minlength:5,
        maxlength:30,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:100,
        trim:true,
    }
});

export const User = mongoose.model("User",userSchema);

const accountSchema = new Schema({
    userId:{
        type:ObjectId,
        required:true,
        ref:"User"
    },

    balance:{
        type:Number,
        required:true,
    }
});

export const Account = mongoose.model("Account",accountSchema);