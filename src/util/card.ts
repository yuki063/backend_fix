import { truncate } from "lodash";
import stripeConfig from "../config/stripe.config";

export async function getCards(customerId) {
  return new Promise(async (resolve, reject) => {
    try {
      const customer = await stripeConfig.customers.listSources(customerId);
      const cards = customer.data;
      resolve(cards);
    } catch (error) {
      reject(error);
    }
  });
}

export async function checkCard(
  customerId,
  cardNumber,
  expMonth,
  expYear,
  nickName
) {
  return new Promise(async (resolve, reject) => {
    try {
      const cards: any[] = (await getCards(customerId)) as unknown as any[];
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].status !== "consumed") {
          if (
            cards[i].card.last4 === cardNumber.substr(-4) &&
            cards[i].card.exp_month === expMonth &&
            cards[i].card.exp_year === expYear
          ) {
            return reject("You have already linked this card");
          }
          if (cards[i].metadata.user_given_name === nickName) {
            return reject(
              `You already have a card with the name ${nickName} linked`
            );
          }
        }
      } 
      return resolve("You can link this card");
    } catch (error) {
      reject(error);
    }
  });
}
