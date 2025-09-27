const express = require('express');
const cors = require('cors');
const app = express();
const transactionsRouter = require('./routes/transactions');
const usersRouter = require('./routes/users');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/transactions', transactionsRouter);
app.use('/users', usersRouter);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

