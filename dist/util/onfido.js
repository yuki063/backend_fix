"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@onfido/api");
const onfido = new api_1.Onfido({
    apiToken: process.env.ONFIDO_API_TOKEN,
    // Supports Region.EU, Region.US and Region.CA
    region: api_1.Region.EU,
});
exports.default = onfido;
