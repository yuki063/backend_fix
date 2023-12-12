import stripeConfig from "../config/stripe.config";

const createCardHolder = async ({
  name,
  email,
  phone_number,
  address,
}: {
  name: string;
  email: string;
  phone_number: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}) => {
  return new Promise(async (resolve, reject) => {
    // address sample
    // address: {
    //   line1: "123 Main Street",
    //   city: "San Francisco",
    //   state: "CA",
    //   postal_code: "94111",
    //   country: "US",
    // }
    try {
      const cardholder = await stripeConfig.issuing.cardholders.create({
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
    } catch (error) {
      reject(error);
    }
  });
};
export const getParams = (user: any) => {
  let customerParams: any = {};

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
const createCustomer = async (user: {
  email?: string;
  phone?: string;
  name?: string;
}) => {
  const customer = await stripeConfig.customers.create(getParams(user));
  return customer.id;
};
const createStripeToken = async (name, number, exp_month, exp_year, cvc) => {
  const token = await stripeConfig.tokens.create({
    card: {
      name,
      number,
      exp_month,
      exp_year,
      cvc,
    },
  });
  return token.id;
};



export { createCustomer, createStripeToken, createCardHolder };
