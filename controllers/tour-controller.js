const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')

exports.alias = (req, res, next) => {
    req.query.sort = 'price';
    req.query.fields = 'name,price,duration,difficulty';
    next();
}


exports.getAllTours = async (req, res) => {

    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;

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

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsAverage'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            // The fields used in subsequent stages uses the fields defined in the previous stages
            // because we are trying to sort the aggregated results and not the whole table
            {
                $sort: {avgPrice: 1}    // 1 for ascending and -1 for descending
            },
            // We can also repeat the pipeline multiple times as demonstrated below
            // {
            //     $match: {_id: {$ne: 'easy'}}
            // }
        ]);
        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}