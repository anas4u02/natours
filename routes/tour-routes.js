const express = require('express');
const tourController = require('./../controllers/tour-controller');

const router = express.Router();

// This middleware will only be executed for tour routes and that too with only those
// requests containing 'id'.: Param Middleware
router.param('id', tourController.checkId);

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.validateBody, tourController.addTour);

router.route('/:id')
    .get(tourController.getOneTour)
    .patch(tourController.patchTour)
    .delete(tourController.deleteTour);

module.exports = router;