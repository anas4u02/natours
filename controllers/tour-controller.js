const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  const queryObj = {...req.query};
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  try {
    const query = await Tour.find(queryObj);

    // Another way of filtering the results
    // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    // The query is first built in the above code and then executed here for the pagination, limits and other filters to work
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.getOneTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err,
    });
  }
  // res.status(200).json({
  //   createdAt: req.requestTime,
  //   status: 'success',
  //   // data: {
  //   //   tours,
  //   // },
  // });
};

exports.addTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { newTour },
      message: 'New Tour created Successfully!'
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err
    });
  }
};

exports.patchTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });

  } catch (err) {
    res.status(404).json({
      status: 'failure',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null
    });

  } catch( err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
