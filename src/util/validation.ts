import Joi from "joi";

const newPasswordSchema = Joi.object().keys({
  password: Joi.string().required(),
});


export const virtualSchema = Joi.object().keys({
  cardholderName: Joi.string().required(),
  cardNumber: Joi.string().required(),
  cardExpiry: Joi.object()
    .keys({
      month: Joi.number().required(),
      year: Joi.number().required(),
    })
    .required(),
  billingAddress: Joi.object()
    .keys({
      country: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      houseNumber: Joi.string().required(),
      line1: Joi.string().required(),
      line2: Joi.string().required(),
    })
    .required(),
  cardholderPhoneNumber: Joi.string().required(),
  cardholderEmail: Joi.string().email().required(),
});

const walletSchema = Joi.object().keys({
  name: Joi.string().required(),
  kind: Joi.string().required(),
});

const bankCardSchema = Joi.object().keys({
  cardNumber: Joi.number().required(),
  nameOnCard: Joi.string().required(),
  thru: Joi.string().required(),
  cvv: Joi.number().required(),
  nickName: Joi.string().required(),
});

const cardHolderSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  address: Joi.object().keys({
    line1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().required(),
  }),
});

const bankCardTopUpSchema = Joi.object().keys({
  sourceId: Joi.string().required(),
  walletId: Joi.string().required(),
  amount: Joi.number().required(),
});
export {
  bankCardTopUpSchema,
  newPasswordSchema,
  cardHolderSchema,
  walletSchema,
  bankCardSchema,
};
