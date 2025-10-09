// api-server/testUserTransaction.js
const mongoose = require('./database');
const User = require('./models/user');
const Transaction = require('./models/transaction');

async function runTest() {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create two new test users with unique emails
    const user1 = new User({ name: 'David', email: 'david@test.com', balance: 500 });
    const user2 = new User({ name: 'Eva', email: 'eva@test.com', balance: 300 });

    await user1.save({ session });
    await user2.save({ session });

    console.log('Users created:', user1.name, user2.name);

    // 2. Perform a transaction from user1 to user2
    const transaction = new Transaction({
      sender: user1.name,
      receiver: user2.name,
      amount: 100,
      status: 'completed'
    });

    await transaction.save({ session });

    // 3. Update user balances
    user1.balance -= 100;
    user2.balance += 100;

    await user1.save({ session });
    await user2.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    console.log('Transaction completed successfully!');
    console.log(`${user1.name} balance: ${user1.balance}, ${user2.name} balance: ${user2.balance}`);
  } catch (err) {
    await session.abortTransaction();
    console.error('Test failed:', err);
  } finally {
    session.endSession();
    await mongoose.connection.close();
  }
}

// Run the test
runTest();
