import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import axios from "axios";

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
    const paymentsCollection = db.collection("payments");

    //*! API ENDPOINT START

    app.post("/create-ssl-payment", async (req, res) => {
      const payment = req.body;
      console.log("payment info: ", payment);

      const trxId = new ObjectId().toString();
      payment.transitionId = trxId;

      const initiate = {
        store_id: "perso68150050757e8",
        store_passwd: "perso68150050757e8@ssl",
        total_amount: payment.price,
        currency: "BDT",
        tran_id: trxId,
        success_url: "http://localhost:5173/success",
        fail_url: "http://localhost:5173/fail",
        cancel_url: "http://localhost:5173/cancel",
        ipn_url: "http://localhost:5173/ipn-success-payment",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: payment.email,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };

      const iniResponse = await axios({
        url: "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
        method: "post",
        data: initiate,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const savedata = await paymentsCollection.insertOne(payment);
      const gatewayUrl = iniResponse?.data?.GatewayPageURL;

      res.status(200).send({
        success: true,
        gatewayUrl,
        message: "Success.",
      });
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
