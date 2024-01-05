const express = require('express');
const tourController = require('./../controllers/tour-controller');

const router = express.Router();

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.addTour);

router.route('/:id')
    .get(tourController.getOneTour)
    .patch(tourController.patchTour)
    .delete(tourController.deleteTour);

module.exports = router;