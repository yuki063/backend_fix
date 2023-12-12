const stripe = require("stripe");
const stripeConfig = stripe(process.env.STRIPE_SCRET_KEY!);

export default stripeConfig;
