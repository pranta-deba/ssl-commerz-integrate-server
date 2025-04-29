import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/index.js";

let server;
async function main() {
  try {
    await mongoose.connect(config.database_url);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
