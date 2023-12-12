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
exports.unLinkBankCard = exports.withdrawFromBankCard = exports.linkBankCard = exports.getUserBankCards = exports.topUpFromBankCard = void 0;
const bankCard_model_1 = __importDefault(require("../models/bankCard.model"));
const stripe_1 = require("../util/stripe");
const validation_1 = require("../util/validation");
const api_response_1 = require("../util/api.response");
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const wallet_model_1 = __importDefault(require("../models/wallet.model"));
const card_1 = require("../util/card");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const topUpFromBankCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { amount, walletId, currency = "ZAR", bankCardId } = req.body;
        if (!bankCardId) {
            return (0, api_response_1.errorResponse)("Invalid bank card", res);
        }
        let bankCard = yield bankCard_model_1.default.findById(bankCardId, { sourceId: 1 });
        if (!bankCard) {
            return (0, api_response_1.errorResponse)("Invalid bank card", res);
        }
        let sourceId = bankCard.sourceId;
        const { error } = validation_1.bankCardTopUpSchema.validate({
            amount,
            sourceId,
            walletId,
        });
        if (error) {
            return (0, api_response_1.errorResponse)(error.details[0].message, res);
        }
        let charge = yield stripe_config_1.default.charges.create({
            amount: amount * 100,
            currency,
            customer: req.user.customerId,
            source: sourceId,
            description: "Transfer from linked card to wallet",
        });
        const balanceTransactionId = charge.balance_transaction;
        const balanceTransaction = yield stripe_config_1.default.balanceTransactions.retrieve(balanceTransactionId);
        const fee = balanceTransaction.fee;
        yield wallet_model_1.default.findByIdAndUpdate(walletId, {
            $inc: { balance: amount, availableBalance: amount },
        });
        let transaction = new transaction_model_1.default({
            description: "Transfer from linked card to wallet",
            amount,
            transactionId: charge.id,
            users: [req.user._id],
            issuer: req.user._id,
            currency,
            fee,
            wallets: [walletId],
            sources: [bankCardId],
            status: "SUCCESSFULL",
        });
        yield transaction.save();
        return (0, api_response_1.successResponse)("You have successfully transferred money from your card to the wallet", null, res);
    }
    catch (error) {
        console.log(error);
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.topUpFromBankCard = topUpFromBankCard;
const getUserBankCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bankcards = yield bankCard_model_1.default.find({
            user: req.user._id,
        }, {
            sourceId: 0,
            user: 0,
        });
        return (0, api_response_1.successResponse)("User's bank cards retrieved successfully", bankcards, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.getUserBankCards = getUserBankCards;
const linkBankCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = validation_1.bankCardSchema.validate(req.body);
        if (error) {
            return (0, api_response_1.errorResponse)(error.details[0].message, res);
        }
        let exp_month = Number(req.body.thru.replace(/[\/]/g, "").padStart(4, "0").slice(0, 2));
        let exp_year = Number(req.body.thru.replace(/[\/]/g, "").slice(2).padStart(4, "20"));
        // check if you've linked the card before
        (0, card_1.checkCard)(req.user.customerId, req.body.cardNumber.replace(/[\s-]/g, ""), exp_month, exp_year, req.body.nickName)
            .then((_) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const token = yield (0, stripe_1.createStripeToken)(req.body.nameOnCard, req.body.cardNumber.replace(/[\s-]/g, ""), exp_month, exp_year, req.body.cvv);
                let params = (0, stripe_1.getParams)(req.user);
                const source = yield stripe_config_1.default.sources.create({
                    type: "card",
                    token,
                    currency: "zar",
                    owner: Object.assign(Object.assign({}, params), { address: {
                            country: "ZA",
                        } }),
                });
                yield stripe_config_1.default.customers.createSource(req.user.customerId, {
                    source: source.id,
                    metadata: {
                        card_name: req.body.nameOnCard,
                        user_given_name: req.body.nickName,
                    },
                });
                yield bankCard_model_1.default.create({
                    user: req.user._id,
                    sourceId: source.id,
                    nickName: req.body.nickName,
                });
                return (0, api_response_1.successResponse)("Your card has been linked", null, res);
            }
            catch (err) {
                return (0, api_response_1.serverErrorResponse)(err, res);
            }
        }))
            .catch((err) => {
            return (0, api_response_1.errorResponse)(err, res);
        });
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.linkBankCard = linkBankCard;
const withdrawFromBankCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sourceId, currency = "zar", amount, walletId } = req.body;
        const wallet = yield wallet_model_1.default.findOne({ walletId }, { balance: 1 });
        if (!wallet) {
            return (0, api_response_1.errorResponse)("Wallet not exist", res);
        }
        if (wallet.balance < amount) {
            return (0, api_response_1.errorResponse)("You can withdraw this amount", res);
        }
        yield stripe_config_1.default.transfers.create({
            amount,
            currency,
            destination: sourceId,
            transfer_group: "group_id_1",
            source_transaction: walletId,
        });
        yield wallet_model_1.default.findOneAndUpdate({ walletId }, {
            $inc: { balance: -amount },
        });
        // you now have this balance remember to add it
        return (0, api_response_1.successResponse)("You have successfully withrawn " + amount + " from your wallet", null, res);
    }
    catch (error) {
        return (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.withdrawFromBankCard = withdrawFromBankCard;
const unLinkBankCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield stripe_config_1.default.customers.deleteSource(req.user.customerId, id);
        yield bankCard_model_1.default.findByIdAndUpdate(id, {
            status: "DEACTIVATED",
        });
        return (0, api_response_1.successResponse)("Your card has been deleted", null, res);
    }
    catch (error) {
        (0, api_response_1.serverErrorResponse)(error, res);
    }
});
exports.unLinkBankCard = unLinkBankCard;
