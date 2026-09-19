const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use public DNS servers
dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    console.log(
      "DNS servers:",
      dns.getServers()
    );

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error);
  }
};

module.exports = connectDB;