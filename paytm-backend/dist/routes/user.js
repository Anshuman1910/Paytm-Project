"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const db_1 = require("../db");
const db_2 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authmiddleware_1 = require("../middleware/authmiddleware");
exports.router = express_1.default.Router();
const signupBody = zod_1.z.object({
    firstName: zod_1.z.string().min(5).max(30),
    lastName: zod_1.z.string().min(5).max(30),
    username: zod_1.z.string().min(5).max(30),
    password: zod_1.z.string().min(8).max(15),
});
exports.router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const parseResult = signupBody.safeParse(body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Incorrect Credentials",
            });
        }
        const existingUser = yield db_1.User.findOne({ username: body.username });
        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        const user = yield db_1.User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error while creating user!"
        });
    }
}));
exports.router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield db_1.User.findOne({
            username: body.username
        });
        console.log(user);
        if (!user) {
            return res.status(400).json({
                message: "No User found!"
            });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Incorrect Password!"
            });
        }
        const userId = user._id;
        yield db_2.Account.create({
            userId: userId,
            balance: 1 + Math.random() * 10000,
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET);
        return res.status(200).json({
            message: "Login successful!",
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error while signing in!"
        });
    }
}));
const updateBody = zod_1.z.object({
    firstname: zod_1.z.string().min(5).max(30).optional(),
    lastname: zod_1.z.string().min(5).max(30).optional(),
    password: zod_1.z.string().min(8).max(15).optional(),
});
exports.router.put("/update", authmiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = req.userId;
    try {
        const parsedBody = updateBody.safeParse(body);
        if (!parsedBody.success) {
            return res.status(400).json({
                message: "Invalid body!"
            });
        }
        const user = yield db_1.User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({
                message: "No user found!"
            });
        }
        const updatedUser = yield db_1.User.findOneAndUpdate({ _id: userId }, body);
        return res.status(200).json({
            message: "User updated Successfully!",
            updatedUser
        });
    }
    catch (error) {
        return res.status(411).json({
            message: "Error while updating user!"
        });
    }
}));
exports.router.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    try {
        const users = yield db_1.User.find({
            $or: [{ firstName: { "$regex": filter, "$options": "i" } },
                { lastName: { "$regex": filter, "$options": "i" } }]
        });
        return res.json({
            users: users.map((user) => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    }
    catch (error) {
        return res.status(411).json({
            message: "Error while fetching users!"
        });
    }
}));
/* This specific route `router.get("/me", authMiddleware, async (req: Request, res:
Response):Promise<any> => { ... }` is responsible for fetching the details of the currently
authenticated user. Here's a breakdown of what it does: */
exports.router.get("/me", authmiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.User.findById(req.userId).select("firstName lastName balance");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
    catch (err) {
        console.error("Error in /me route:", err);
        res.status(500).json({ message: "Server error" });
    }
}));
