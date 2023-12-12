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
exports.checkCard = exports.getCards = void 0;
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
function getCards(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield stripe_config_1.default.customers.listSources(customerId);
                const cards = customer.data;
                resolve(cards);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
exports.getCards = getCards;
function checkCard(customerId, cardNumber, expMonth, expYear, nickName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cards = (yield getCards(customerId));
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i].status !== "consumed") {
                        if (cards[i].card.last4 === cardNumber.substr(-4) &&
                            cards[i].card.exp_month === expMonth &&
                            cards[i].card.exp_year === expYear) {
                            return reject("You have already linked this card");
                        }
                        if (cards[i].metadata.user_given_name === nickName) {
                            return reject(`You already have a card with the name ${nickName} linked`);
                        }
                    }
                }
                return resolve("You can link this card");
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
exports.checkCard = checkCard;
