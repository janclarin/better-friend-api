const express = require('express');
const router = express.Router();
const controller = require('../controllers/queryController');

router.route('/:user_id')
  .get(controller.getUserInfo);

router.route('/:user_id/birthday')
  .get(controller.getBirthdaySettings)
  .put(controller.updateBirthdaySettings);

router.route('/:user_id/events')
  .get(controller.getEventSettings)
  .put(controller.updateEventSettings);

module.exports = router;