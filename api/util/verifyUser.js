import { errorHandler } from './errorHandler.js';
import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
  const access_token = req.cookies.access_token;
  if (!access_token) return next(errorHandler(401, 'UnAuthorized'));

  jwt.verify(access_token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    req.user = user;
    next();
  });
};
