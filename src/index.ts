import { errorMiddleware } from "./middlewares/errorMiddleware";
import express from "express";
import router from "./routers";
import { translateData } from "./middlewares/translateData";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use(translateData);
app.use(router);
app.use(errorMiddleware);

app.listen(process.env.PORT, () =>
  console.log("API inicializada na porta:" + process.env.PORT)
);
