const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB...");
    const result = await mongoose.connection.db.collection("users").dropIndex("email_1");
    console.log("Dropped index:", result);
    await mongoose.disconnect();
  })
  .catch(err => console.error("Error:", err));
