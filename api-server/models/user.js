const knex = require('../database');
const bcrypt = require('bcrypt');

const PEPPER = process.env.PEPPER || '';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

const createUser = async ({ full_name, id_number, account_number, username, password, role = 'customer' }) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password + PEPPER, salt);
  const [id] = await knex('users').insert({ 
    full_name, 
    id_number, 
    account_number, 
    username, 
    password_hash: hash, 
    salt,
    role
  });
  return id;
};

const getUserByUsername = async (username) => {
  return knex('users').where({ username }).first();
};

const getUserByAccountNumber = async (account_number) => {
  return knex('users').where({ account_number }).first();
};

const getUserById = async (id) => {
  return knex('users').where({ id }).first();
};

const getUserByIdNumber = async (id_number) => {
  return knex('users').where({ id_number }).first();
};

const updatePassword = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(newPassword + PEPPER, salt);
  await knex('users').where({ id }).update({ password_hash: hash, salt });
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserByAccountNumber,
  getUserById,
  getUserByIdNumber,
  updatePassword,
};
