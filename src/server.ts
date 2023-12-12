import express, { Request, Response } from "express";
import { config } from "dotenv";
import path from "path";
import { swaggerUi } from "./config/swagger";
import swaggerJson from "./swagger.json";
import http from "http";
config({ path: path.resolve(__dirname, "../.env") });
import "./config/mongoose.config";
import api from "./routes";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();
app
  .use(express.json({ limit: "20mb" }))
  .use(express.urlencoded({ extended: true }))
  .use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }))
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson))
  .use(`/${process.env.VERSION!}`, api);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Backend of Tenete pay");
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server link: http://localhost:${PORT}`);
});
