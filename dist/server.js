"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const swagger_1 = require("./config/swagger");
const swagger_json_1 = __importDefault(require("./swagger.json"));
const http_1 = __importDefault(require("http"));
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, "../.env") });
require("./config/mongoose.config");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app
    .use(express_1.default.json({ limit: "20mb" }))
    .use(express_1.default.urlencoded({ extended: true }))
    .use((0, cors_1.default)({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }))
    .use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_json_1.default))
    .use(`/${process.env.VERSION}`, routes_1.default);
app.get("/", (_req, res) => {
    res.status(200).send("Backend of Tenete pay");
});
const server = http_1.default.createServer(app);
server.listen(PORT, () => {
    console.log(`Server link: http://localhost:${PORT}`);
});
