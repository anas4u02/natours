const express = require('express');
const tourController = require('../controllers/tour-controller');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.alias, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').get(tourController.getAllTours).post(tourController.addTour);

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
