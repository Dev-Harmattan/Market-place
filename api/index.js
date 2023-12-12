import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRouter from './routes/user.route.js';

dotenv.config();

const app = express();


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Mongo db is running.');
  })
  .catch((err) => console.log(err.message));

app.use('/api/user', userRouter)

const address = app.listen(5000, () => {
  console.log(`Server running on ${address.address().port}`);
});
