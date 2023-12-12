"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stripe = require("stripe");
const stripeConfig = stripe(process.env.STRIPE_SCRET_KEY);
exports.default = stripeConfig;
