const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Tour must have a value'],
            unique: true,
            trim: true,
            min: [10, 'Name must be greater than 10 charecters'],
            max: [50, 'Name can not be greater than 50 charecters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration!'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A  tour must have a group size!'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty!'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
        },
        price: {
            type: Number,
            required: [true, 'Tour must have a price'],
        },
        priceDiscount: {
            type: Number,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary!'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A Tour must have some sample image!'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date]   // Different dates for the same tour
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    });

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// // DOCUMENT MIDDLEWARE: runs before .save() amd. crete()
// tourSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, {lower: true});
//     next();
// });

// tourSchema.pre('save', function (next) {
//     console.log("Will save ...")
// });

// tourSchema.post('save', function (doc, next) {
//     console.log(doc)
//     next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
