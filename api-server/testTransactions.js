// api-server/testTransactions.js
const mongoose = require('./database');
const Transaction = require('./models/transaction');

async function runTransaction() {
  try {
    // Start a new session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const tx1 = new Transaction({ sender: 'Alice', receiver: 'Bob', amount: 100 });
    const tx2 = new Transaction({ sender: 'Bob', receiver: 'Charlie', amount: 50 });

    await tx1.save({ session });
    await tx2.save({ session });

    await session.commitTransaction();
    console.log(' Transactions committed successfully!');

  } catch (error) {
    console.error(' Transaction failed:', error);
    await mongoose.connection.abortTransaction?.();
  } finally {
    // Always end the session and close the connection
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed.');
    });
  }
}

runTransaction();
