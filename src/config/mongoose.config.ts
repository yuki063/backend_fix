import { connect, set } from "mongoose";
set("strictQuery", false);
connect(
  process.env.NODE_ENV === "DEV"
    ? process.env.DB_DEV_URL!
    : process.env.DB_PROD_URL!
)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));
