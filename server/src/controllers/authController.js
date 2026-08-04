import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (user) => jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !user.active || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
  res.json({ token: signToken(user), user: user.toJSON() });
});

export const me = asyncHandler(async (req, res) => res.json({ user: req.user }));
