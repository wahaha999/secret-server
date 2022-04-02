"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const MasterRouter_1 = __importDefault(require("./routers/MasterRouter"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// load the environment variables from the .env file
dotenv_1.default.config({
    path: ".env",
});
/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.router = MasterRouter_1.default;
    }
}
// initialize server app
const server = new Server();
server.app.use((0, cors_1.default)());
server.app.use(body_parser_1.default.json());
server.app.use("/v1", server.router);
// swagger server
const swagger_path = path_1.default.resolve(__dirname, "./api/swagger/swagger.yaml");
const swaggerDocument = yamljs_1.default.load(swagger_path);
server.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
server.app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: "error",
        statusCode: err.statusCode,
        message: err.message,
    });
});
const port = process.env.APP_PORT || 3000;
const mongodb_url = process.env.MONGODB_URL || "";
mongoose_1.default.connect(mongodb_url, () => {
    console.log("connected to database");
});
// make server listen on some port
(() => {
    server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();
