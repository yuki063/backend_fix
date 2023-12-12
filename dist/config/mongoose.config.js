"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
(0, mongoose_1.set)("strictQuery", false);
(0, mongoose_1.connect)(process.env.NODE_ENV === "DEV"
    ? process.env.DB_DEV_URL
    : process.env.DB_PROD_URL)
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.log(err));
