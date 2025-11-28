import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// proteção contra DoS
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: "Muitas requisições, tente novamente mais tarde.",
  })
);

app.use("/api", router);

export default app;
