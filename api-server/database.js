const knex = require('knex');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');

// Knex configuration
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
    
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, done) => {
      // Set encryption key for SQLCipher
      conn.run("PRAGMA key = 'c9f8a2e7b1d4g6h3j0k2l5m8n7p1q4r3';", (err) => {
        if (err) {
          console.error('Error setting encryption key:', err.message);
        } else {
          console.log('Database encryption key set.');
        }
        done(err, conn);
      });
    },
  },
});

module.exports = db;
