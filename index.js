import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;
const { DATABASE_URL, STORE_PASS, STORE_ID } = process.env;

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
  origin: [
    "http://localhost:5173",
    "https://ssl-commerz-integrate-client.vercel.app",
    "https://ssl-commerz-integrate-client-dd1rtq2ez.vercel.app",
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

async function run() {
  try {
    // await client.connect();

    const db = client.db("ssl-commerz-inregate");
    const paymentsCollection = db.collection("payments");

    //*! API ENDPOINT START

    app.post("/create-ssl-payment", async (req, res) => {
      const payment = req.body;

      const trxId = new ObjectId().toString();
      payment.transitionId = trxId;

      //* Step 1 :
      const initiate = {
        store_id: STORE_ID,
        store_passwd: STORE_PASS,
        total_amount: payment.price,
        currency: "BDT",
        tran_id: trxId,
        success_url: "http://localhost:3000/success-payment",
        fail_url: "http://localhost:3000/payment-failed",
        cancel_url: "http://localhost:3000/payment-cancelled",
        ipn_url: "http://localhost:3000/ipn-success-payment",
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

      //* Step 2 :
      const iniResponse = await axios({
        url: "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
        method: "post",
        data: initiate,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const savedata = await paymentsCollection.insertOne(payment);

      //* Step 3 :
      const gatewayUrl = iniResponse?.data?.GatewayPageURL;

      //* Step 4 :
      res.status(200).send({
        success: true,
        gatewayUrl,
        message: "Success.",
      });
    });

    app.post("/success-payment", async (req, res) => {
      //* Step 5 :
      const paymentSuccess = req.body;

      //* Step 6 :
      const { data } = await axios.get(
        `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${paymentSuccess.val_id}&store_id=${STORE_ID}&store_passwd=${STORE_PASS}&format=json`
      );
      console.log("isValidPayment", data);

      if (data.status !== "VALID") {
        res.send({
          success: false,
          message: "Not Valid payment!",
        });
      }
      //* Step 7 :
      const deletePayment = await paymentsCollection.deleteMany({
        transitionId: data.tran_id,
      });

      //* Step 8 :
      res.redirect("http://localhost:5173/success");
    });

    // Handle payment failure
    app.post("/payment-failed", (req, res) => {
      console.log("Payment failed: ", req.body);
      res.redirect("http://localhost:5173/fail");
    });

    // Handle payment cancellation
    app.post("/payment-cancelled", (req, res) => {
      console.log("Payment cancelled: ", req.body);
      res.redirect("http://localhost:5173/cancel");
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
