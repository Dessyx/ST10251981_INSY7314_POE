import bcrypt from 'bcrypt';
const ROUNDS = 12;
export async function hashPassword(plain) {
  const pepper = process.env.PEPPER || ''; return bcrypt.hash(String(plain) + pepper, ROUNDS);
}
export async function verifyPassword(plain, hash) {
  const pepper = process.env.PEPPER || ''; return bcrypt.compare(String(plain) + pepper, hash);
}
