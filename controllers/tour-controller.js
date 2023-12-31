const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {

    try {
        let queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // Another way of filtering the results
        // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

        // Filtering using > >= < <=
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // SELECTED FIELDS
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ') + ' -__v';
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) {
                throw new Error('This page does not exist!');
            }
        }

        // The query is first built in the first line of try block and then executed here for the pagination, limits and other filters to work
        const tours = await query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err
        });
    }
};

exports.getOneTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {tour}
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err
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
            data: {newTour},
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

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
