import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const port = process.env.PORT || 3000;
const { DATABASE_URL } = process.env;

//*! Create a MongoClient
const client = new MongoClient(DATABASE_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//*! MIDDLEWARES
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

async function run() {
  try {
    // await client.connect();

    const db = client.db("ssl-commerz-inregate");
    const productCollection = db.collection("orders");

    //*! API ENDPOINT START

    app.post("/create-ssl-payment", async (req, res) => {
      const payment = req.body;
      console.log(payment);
    });

    //*! API ENDPOINT END

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

//*! ROOT Route
app.get("/", (req, res) => {
  res.status(200).send("Running.........");
});

//*! APP Listen
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
