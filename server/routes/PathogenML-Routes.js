const express = require("express");
const router = express.Router();
const pathogenMLController = require("../controllers/PathogenML-Controller");

/**
 * @desc Route for predicting the delta cq for an experiment
 * @route POST /api/predict
 * @access Public
 */
router.post('/predict', pathogenMLController.predictor)

module.exports = router;