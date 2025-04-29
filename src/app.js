import express from "express";
const app = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.get("/", async (req, res) => {
  res.send("SSL COMMERZ APP RUNNING...............");
});

export default app;
