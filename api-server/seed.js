// api-server/seed.js
const db = require('./database'); 

async function seedTransactions() {
  try {
   const transactions = [
  { user_id: 1, amount: 150.50, currency: 'USD' },
  { user_id: 1, amount: 75.00, currency: 'USD' },
  { user_id: 2, amount: 200.00, currency: 'USD' },
  { user_id: 2, amount: 50.25, currency: 'USD' }
];



    for (const tx of transactions) {
      await db('transactions').insert(tx);
    }

    console.log('Sample transactions added successfully!');
    process.exit(0); // exit after seeding
  } catch (err) {
    console.error('Error inserting transactions:', err);
    process.exit(1);
  }
}

seedTransactions();
