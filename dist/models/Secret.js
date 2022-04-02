"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secret = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const secretSchema = new mongoose_1.default.Schema({
    secretText: {
        type: { iv: String, content: String },
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
const Secret = mongoose_1.default.model("Secret", secretSchema);
exports.Secret = Secret;
