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
const authmiddleware_1 = require("../middleware/authmiddleware");
const db_1 = require("../db");
const mongoose_1 = __importDefault(require("mongoose"));
exports.router = express_1.default.Router();
exports.router.get("/balance", authmiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const account = yield db_1.Account.findOne({ userId: userId });
        return res.status(200).json({
            message: "Balance fetched Successfully!",
            balance: account.balance,
        });
    }
    catch (error) {
        return res.status(411).json({
            message: "Unable to fetch balance at this moment.Please try again later!"
        });
    }
}));
exports.router.post("/transfer", authmiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const amount = req.body.amount;
        const to = new mongoose_1.default.Types.ObjectId(req.body.to);
        console.log("Transfer to:", to);
        const userId = req.userId;
        const fromAccount = yield db_1.Account.findOne({ userId: userId }).session(session);
        console.log(fromAccount);
        if (!fromAccount) {
            yield session.abortTransaction();
            return res.status(400).json({
                message: "Sender account not found!"
            });
        }
        if (fromAccount.balance < amount) {
            yield session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance!"
            });
        }
        const toAccount = yield db_1.Account.findOne({ userId: to }).session(session);
        console.log(toAccount);
        if (!toAccount) {
            yield session.abortTransaction();
            return res.status(400).json({
                message: "reciever account not found!"
            });
        }
        yield db_1.Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        yield db_1.Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        yield session.commitTransaction();
        return res.status(200).json({
            message: "Transfer successful!",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        return res.status(500).json({
            message: "Error occured while transaction!"
        });
    }
}));
