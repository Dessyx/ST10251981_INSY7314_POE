const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://soyamapango15_db_user:lJZGLadcp08eK1Lu@paynowdb.vmyr5pc.mongodb.net/paynow?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB...");
    const result = await mongoose.connection.db.collection("users").dropIndex("email_1");
    console.log("Dropped index:", result);
    await mongoose.disconnect();
  })
  .catch(err => console.error("Error:", err));
