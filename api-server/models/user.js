const knex = require('../database');
const bcrypt = require('bcrypt');

const PEPPER = process.env.PEPPER || '';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

const createUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password + PEPPER, salt);
  const [id] = await knex('users').insert({ name, email, password_hash: hash, salt });
  return id;
};

const getUserByEmail = async (email) => {
  return knex('users').where({ email }).first();
};

const getUserById = async (id) => {
  return knex('users').where({ id }).first();
};

const updatePassword = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(newPassword + PEPPER, salt);
  await knex('users').where({ id }).update({ password_hash: hash, salt });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updatePassword,
};
