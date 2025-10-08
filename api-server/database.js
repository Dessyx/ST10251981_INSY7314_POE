// api-server/database.js
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected from database.js!'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose; 