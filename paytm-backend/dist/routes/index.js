"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("./user");
const account_1 = require("./account");
exports.router = express_1.default.Router();
exports.router.use("/user", user_1.router);
exports.router.use("/account", account_1.router);
