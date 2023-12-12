import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Mongo db is running.');
  })
  .catch((err) => console.log(err.message));

const address = app.listen(5000, () => {
  console.log(`Server running on ${address.address().port}`);
});
