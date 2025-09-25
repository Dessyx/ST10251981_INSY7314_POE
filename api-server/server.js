const express = require('express');
const app = express();
const transactionsRouter = require('./routes/transactions');
const usersRouter = require('./routes/users');

app.use(express.json());
app.use('/transactions', transactionsRouter);
app.use('/users', usersRouter);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

