"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CC = require("currency-converter-lt");
let currencyConverter = new CC();
let ratesCacheOptions = {
    isRatesCaching: true,
    ratesCacheDuration: 3600, // Set this to a positive number to set the number of seconds you want the rates to be cached. Defaults to 3600 seconds (1 hour)
};
currencyConverter = currencyConverter.setupRatesCache(ratesCacheOptions);
exports.default = currencyConverter;
