"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = exports.User = void 0;
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 30,
        trim: true,
    },
    lastName: {
        type: String,
        minlength: 5,
        maxlength: 30,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
        trim: true,
    }
});
exports.User = mongoose.model("User", userSchema);
const accountSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    balance: {
        type: Number,
        required: true,
    }
});
exports.Account = mongoose.model("Account", accountSchema);
