import { Router } from 'express';
import User from '../models/user.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
export const router = Router();

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { fullName, saIdNumber, accountNumber, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Account already exists' });
    const passwordHash = await hashPassword(password);
    await User.create({ fullName, saIdNumber, accountNumber, email, passwordHash });
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { accountNumberOrEmail, password } = req.body;
    const user = await User.findOne({ $or: [
      { email: accountNumberOrEmail.toLowerCase() },
      { accountNumber: accountNumberOrEmail }
    ]});
    if (!user || !(await verifyPassword(password, user.passwordHash)))
      return res.status(401).json({ error: 'Invalid credentials' });

    req.session.regenerate(err => {
      if (err) return next(err);
      req.session.userId = String(user._id);
      res.json({ ok: true });
    });
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => req.session.destroy(() => res.status(204).end()));
