// Seed script for sample transactions
const db = require('./database');
const Transaction = require('./models/transaction');

const sampleTransactions = [
  {
    user_id: 1,
    amount: 100.00,
    currency: 'ZAR',
    recipient_name: 'John Doe',
    provider: 'Standard Bank',
    swift_code: 'SBZAZAJJ',
    description: 'Payment for services',
    status: 'completed'
  },
  {
    user_id: 1,
    amount: 250.50,
    currency: 'ZAR',
    recipient_name: 'Jane Smith',
    provider: 'FNB',
    swift_code: 'FIRNZAJJ',
    description: 'Monthly rent payment',
    status: 'completed'
  },
  {
    user_id: 1,
    amount: 75.25,
    currency: 'USD',
    recipient_name: 'Bob Johnson',
    provider: 'Chase Bank',
    swift_code: 'CHASUS33',
    description: 'Online purchase',
    status: 'completed'
  },
  {
    user_id: 1,
    amount: 500.00,
    currency: 'ZAR',
    recipient_name: 'Alice Brown',
    provider: 'Absa Bank',
    swift_code: 'ABSAZAJJ',
    description: 'Loan repayment',
    status: 'completed'
  },
  {
    user_id: 1,
    amount: 150.75,
    currency: 'EUR',
    recipient_name: 'Charlie Wilson',
    provider: 'Deutsche Bank',
    swift_code: 'DEUTDEFF',
    description: 'International transfer',
    status: 'completed'
  },
  {
    user_id: 1,
    amount: 300.00,
    currency: 'ZAR',
    recipient_name: 'David Miller',
    provider: 'Nedbank',
    swift_code: 'NEDSZAJJ',
    description: 'Utility bill payment',
    status: 'pending'
  },
  {
    user_id: 1,
    amount: 89.99,
    currency: 'USD',
    recipient_name: 'Emma Davis',
    provider: 'Bank of America',
    swift_code: 'BOFAUS3N',
    description: 'Subscription payment',
    status: 'completed'
  },
  {
    user_id: 1,
    amount: 450.00,
    currency: 'ZAR',
    recipient_name: 'Frank Garcia',
    provider: 'Capitec Bank',
    swift_code: 'CABLZAJJ',
    description: 'Insurance premium',
    status: 'failed'
  }
];

async function seedTransactions() {
  try {
    console.log('Starting transaction seeding...');
    
    // Clear existing transactions (optional - remove if you want to keep existing data)
    // await db('transactions').del();
    
    // Insert sample transactions
    for (const transaction of sampleTransactions) {
      await Transaction.create({
        ...transaction,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
      console.log(`Created transaction for ${transaction.recipient_name}: ${transaction.currency} ${transaction.amount}`);
    }
    
    console.log('Transaction seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding transactions:', error);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedTransactions();
}

module.exports = { seedTransactions, sampleTransactions };
