const initData = require("./data");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

const initDb = async () => {
  await Listing.deleteMany({});
  let setData = initData.data.map((obj) => ({
    ...obj,
    owner: "68c5c0e794fd7b28a562d101",
  }));
  await Listing.insertMany(setData);
};

initDb();
