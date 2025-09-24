import Joi from 'joi';

export const registerSchema = Joi.object({
  fullName: Joi.string().pattern(/^[A-Za-z][A-Za-z' -]{1,49}$/).required(),
  saIdNumber: Joi.string().pattern(/^\d{13}$/).required(),
  accountNumber: Joi.string().pattern(/^\d{8,16}$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(10).max(128).required()
}).options({ stripUnknown: true });

export const loginSchema = Joi.object({
  accountNumberOrEmail: Joi.string().min(3).max(128).required(),
  password: Joi.string().min(10).max(128).required()
}).options({ stripUnknown: true });


