const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.alias = (req, res, next) => {
    req.query.sort = 'price';
    req.query.fields = 'name,price,duration,difficulty';
    next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getOneTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError('Tour not found with the requested ID!', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

exports.addTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { newTour },
        message: 'New Tour created Successfully!'
    });
});

exports.patchTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!tour) {
        return next(new AppError('Tour not found with the requested ID!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: 'success',
        data: null
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$difficulty',
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsAverage' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        // The fields used in subsequent stages uses the fields defined in the previous stages
        // because we are trying to sort the aggregated results and not the whole table
        {
            $sort: { avgPrice: 1 }    // 1 for ascending and -1 for descending
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const monthlyPlan = await Tour.aggregate([
        // the startDates field is an array so we have to first segregate them using unwind
        {
            $unwind: '$startDates'
        },
        // Then we apply our filtering criteria for finding the tours of a year
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        // Then we group the results by month and include the count of fields as well their names
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        // after that we added the field month in the result
        {
            $addFields: { month: '$_id' }
        },
        // And then we made the _id field hidden as we no longer need it in response
        {
            $project: {
                _id: 0
            }
        },
        // Finally we sort the results by months
        {
            $sort: { month: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            monthlyPlan
        },
        message: 'success'
    });
});