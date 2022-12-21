// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { Spot, User, SpotImage, Review, Booking, sequelize } = require("../db/models");


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (Spot) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

      const err = Error('Validation Error');
      err.errors = errors;
      err.status = 400;
      err.title = 'Validation Error';
      next(err);
  }

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }


  next();
};

module.exports = {
  handleValidationErrors
};
