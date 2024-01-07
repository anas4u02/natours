const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a value'],
    unique: true,
    trim: true,
  },
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
  startDates : [Date]   // Different dates for the same tour
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
