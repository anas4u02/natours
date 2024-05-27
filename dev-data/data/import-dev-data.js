const fs = require('fs');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Tour = require('../../models/tourModel');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );
const DB = process.env.DATABASE_WITH_PASSWORD;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then((conn) => {
    console.log(conn.connections);
    console.log('DB Connection Successful!');
  });

const tours = JSON.parse(fs.readFileSync("dev-data/data/tours-simple.json", "utf8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Imported!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deleteExistingData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Existing tours deleted successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteExistingData();
}
