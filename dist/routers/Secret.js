"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express_1 = require("express");
const Secret_1 = require("../models/Secret");
const crypto = __importStar(require("../helper/crypto"));
class SecretRouter {
    constructor() {
        this._router = (0, express_1.Router)();
        this._configure();
    }
    get router() {
        return this._router;
    }
    /**
     * Connect routes to their matching controller endpoints.
     */
    _configure() {
        // @route   GET v1/get
        // @desc    Get all secrets
        // @access  Public
        this._router.get("/get", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const secrets = yield Secret_1.Secret.find({});
                res.status(200).json(secrets.map((s) => ({
                    hash: s._id,
                    secretText: "********",
                    expireAt: s.expireAt,
                    createdAt: s.createdAt,
                })));
            }
            catch (error) {
                next(error);
            }
        }));
        // @route   GET v1/create
        // @desc    Create a secret
        // @access  Public
        this._router.post("/secret", (req, res, next) => {
            try {
                const { secretText, expireAt } = req.body;
                console.log(crypto.encrypt(secretText), expireAt);
                const secret = new Secret_1.Secret({
                    secretText: crypto.encrypt(secretText),
                    expireAt: expireAt,
                });
                secret.save(function (err, doc) {
                    console.log(doc._id);
                });
                res.send("Secret is created successfully");
            }
            catch (error) {
                next(error);
            }
        });
        // @route   GET v1/get/:hash
        // @desc    Get a secret by hash
        // @access  Public
        this._router.get("/secret/:hash", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.hash;
                const secret = yield Secret_1.Secret.findOne({ _id: id });
                const current = new Date();
                const expireTime = new Date(secret.expireAt);
                if (current.getTime() < expireTime.getTime()) {
                    res.send(crypto.decrypt(secret.secretText));
                }
                else {
                    res.send("The secret is expired. You can not see this secret");
                }
            }
            catch (error) {
                next(error);
            }
        }));
    }
}
module.exports = new SecretRouter().router;
