import express from 'express';

const app = express();

const address = app.listen(5000, () => {
  console.log(`Server running on ${address.address().port}`);
});
