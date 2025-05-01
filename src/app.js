import express from "express";
import cors from "cors";
import { UserRoute } from "./app/modules/user/user.route.js";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
const app = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use("/api/v1/user", UserRoute);

app.get("/", async (req, res) => {
  res.send("SSL COMMERZ APP RUNNING...............");
});

app.use(globalErrorHandler);

export default app;
