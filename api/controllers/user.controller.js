import User from '../models/user.model.js';
import { errorHandler } from '../util/errorHandler.js';
import bcrypt from 'bcryptjs';

export const test = (req, res) => {
  res.json({
    message: 'User ready',
  });
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only update your account'));
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
