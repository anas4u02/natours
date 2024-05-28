const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
require('express');
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );
const DB = process.env.DATABASE_WITH_PASSWORD;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((conn) => {
    console.log(conn.connections);
    console.log('DB Connection Successful!');
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `App running on port ${port} and ENV is ${process.env.NODE_ENV}...`,
  );
});
