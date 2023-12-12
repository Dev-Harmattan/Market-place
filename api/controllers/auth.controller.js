import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const auth = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashPassword });
    await user.save();
    res.json({ message: 'User saved successfully' });
  } catch (error) {
    next(error)
  }
};
