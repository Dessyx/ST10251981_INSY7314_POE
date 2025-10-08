const mongoose = require('mongoose');

const uri = "mongodb+srv://soyamapango15_db_user:lJZGLadcp08eK1Lu@paynowdb.vmyr5pc.mongodb.net/paynow?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log(' MongoDB connected successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(' MongoDB connection error:', err);
  });
