/* eslint-disable prettier/prettier */
const fs = require('fs');
const { log } = require('console');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      message: 'No data found for the ID',
    });
  }
  next();
};

exports.validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid request body!',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  log(req.requestTime);
  res.status(200).json({
    createdAt: req.requestTime,
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getOneTour = (req, res) => {
  res.status(200).json({
    createdAt: req.requestTime,
    status: 'success',
    data: {
      tours,
    },
  });
};

exports.addTour = (req, res) => {
  const newId = tours[tours.length - 1] + 1;
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    // eslint-disable-next-line no-unused-vars
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );

  console.log(req.body);
};

exports.patchTour = (req, res) => {
  // eslint-disable-next-line no-undef, no-unused-vars
  const tour = tours.find((el) => el.id === id);
  // fs does not support anything similar to PATCH request, that's why it's
  // not implemented here

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: null,
  });
};
