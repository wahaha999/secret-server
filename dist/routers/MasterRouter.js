"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const Secret_1 = __importDefault(require("./Secret"));
class MasterRouter {
    constructor() {
        this._router = (0, express_1.Router)();
        this._secrtrouter = Secret_1.default;
        this._configure();
    }
    get router() {
        return this._router;
    }
    /**
     * Connect routes to their matching routers.
     */
    _configure() {
        this._router.use("/", this._secrtrouter);
    }
}
module.exports = new MasterRouter().router;
