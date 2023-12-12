import axios from "axios";

export const PAYMENT_API = axios.create({
  baseURL: process.env.PAYMENT_API_URL,
  headers: {
    Accept: "application/json",
    apikey: process.env.PAYMENT_API_KEY,
    Authorization: `Basic ${process.env.PAYMENT_AUTHORIZATION}`
  }
});
