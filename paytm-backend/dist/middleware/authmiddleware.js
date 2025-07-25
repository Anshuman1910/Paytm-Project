"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "No Authorization Header found!" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token found!" });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decodedToken.id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token!" });
    }
}
