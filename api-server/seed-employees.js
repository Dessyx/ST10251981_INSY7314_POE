const knex = require('./database');
const bcrypt = require('bcrypt');

const PEPPER = process.env.PEPPER || '';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

async function seedEmployees() {
  try {
    // Check if employees already exist
    const existingEmployee = await knex('users').where({ role: 'employee' }).first();
    if (existingEmployee) {
      console.log('Employees already exist, skipping seed');
      return;
    }

    // Create employee credentials
    const employeeData = {
      full_name: 'System Administrator',
      id_number: '123456789012',
      account_number: '999999999999',
      username: 'admin',
      password: 'Admin@123!',
      role: 'employee'
    };

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(employeeData.password + PEPPER, salt);

    await knex('users').insert({
      full_name: employeeData.full_name,
      id_number: employeeData.id_number,
      account_number: employeeData.account_number,
      username: employeeData.username,
      password_hash: hash,
      salt: salt,
      role: employeeData.role
    });

    console.log('Employee credentials created:');
    console.log('Username: admin');
    console.log('Account Number: 999999999999');
    console.log('Password: Admin@123!');
    console.log('Role: employee');

  } catch (error) {
    console.error('Error seeding employees:', error);
  } finally {
    await knex.destroy();
  }
}

seedEmployees();
