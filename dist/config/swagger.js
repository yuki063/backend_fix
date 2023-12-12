"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUi = exports.swaggerJsdoc = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    openapi: "2.0.0",
    definition: {
        components: {},
        info: {
            title: "Tenete pay",
            description: "Tenete pay Backend",
            version: "1.0.0",
        },
        consumes: [
            "application/x-www-form-urlencoded",
            "application/json",
            "multipart/form-data",
        ],
        produces: ["application/json"],
        basePath: "/",
    },
    apis: ["./routes/*.js"],
};
const swaggerJsdoc = (0, swagger_jsdoc_1.default)(options);
const _swaggerJsdoc = swaggerJsdoc;
exports.swaggerJsdoc = _swaggerJsdoc;
const _swaggerUi = swagger_ui_express_1.default;
exports.swaggerUi = _swaggerUi;
