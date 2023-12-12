"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCardHolder = exports.createStripeToken = exports.createCustomer = exports.getParams = void 0;
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const createCardHolder = ({ name, email, phone_number, address, }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // address sample
        // address: {
        //   line1: "123 Main Street",
        //   city: "San Francisco",
        //   state: "CA",
        //   postal_code: "94111",
        //   country: "US",
        // }
        try {
            const cardholder = yield stripe_config_1.default.issuing.cardholders.create({
                name,
                email,
                phone_number,
                status: "active",
                type: "individual",
                individual: {
                    first_name: name.split(" ")[0],
                    last_name: name.split(" ").slice(1),
                },
                billing: {
                    address,
                },
            });
            resolve(cardholder);
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.createCardHolder = createCardHolder;
const getParams = (user) => {
    let customerParams = {};
    if (user.email) {
        customerParams.email = user.email;
    }
    if (user.phone) {
        customerParams.phone = user.phone;
    }
    if (user.name) {
        customerParams.name = user.name;
    }
    return customerParams;
};
exports.getParams = getParams;
const createCustomer = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield stripe_config_1.default.customers.create((0, exports.getParams)(user));
    return customer.id;
});
exports.createCustomer = createCustomer;
const createStripeToken = (name, number, exp_month, exp_year, cvc) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield stripe_config_1.default.tokens.create({
        card: {
            name,
            number,
            exp_month,
            exp_year,
            cvc,
        },
    });
    return token.id;
});
exports.createStripeToken = createStripeToken;
