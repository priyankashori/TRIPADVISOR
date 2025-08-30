
const dotenv = require("dotenv"); // Declare and initialize dotenv first
dotenv.config({ path: "../.env" }); // Now you can call config()


const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

console.log("MONGO_URL:", process.env.MONGO_URL);
const initData = require("./data.js");
const Listing = require("../models/listing.js");




main().then(() => {
    console.log("connected to DB");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
  }
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68b0391cfcb252075fc3fbf6"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};



initDB();


