const mongoose = require('./database'); 
const Transaction = require('./models/transaction');

async function runTransaction() {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tx1 = new Transaction({ sender: 'Alice', receiver: 'Bob', amount: 100 });
    const tx2 = new Transaction({ sender: 'Bob', receiver: 'Charlie', amount: 50 });

    await tx1.save({ session });
    await tx2.save({ session });

    await session.commitTransaction();
    console.log('Transactions committed successfully!');
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction failed:', error);
  } finally {
    session.endSession();
    mongoose.connection.close();
  }
}

runTransaction();
