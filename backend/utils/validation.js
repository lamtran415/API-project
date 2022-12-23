// backend/utils/validation.js
const { validationResult, check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

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

const handleSpotValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  // console.log(validationErrors)

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.param}: ${error.msg}`);

    const err = Error("Validation Error");
    err.message = "Validation Error"
    err.errors = errors;
    res.status(400);
    res.json({
      message: err.message,
      statusCode: res.statusCode,
      errors: err.errors
    })
  }

  next();
};

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage("Must provide a first name"),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage("Must provide a last name"),
  handleValidationErrors
];

const validateCreateSpot = [
  check("address")
      .exists({ checkFalsy: true })
      .withMessage("Street address is required")
  ,
  check("city")
      .exists({ checkFalsy: true })
      .withMessage("City is required")
  ,
  check("state")
      .exists({ checkFalsy: true })
      .withMessage("State is required")
  ,
  check("country")
      .exists({ checkFalsy: true })
      .withMessage("Country is required")
  ,
  check("lat")
      // .exists({ checkFalsy: true })
      .isFloat()
      .withMessage("Latitude is not valid")
  ,
  check("lng")
      // .exists({ checkFalsy: true })
      .isFloat()
      .withMessage("Longitude is not valid")
  ,
  check("name")
      .exists({ checkFalsy: true })
      .withMessage("Name is required")
      .isLength({ max: 49 })
      .withMessage("Name must be less than 50 characters")
  ,
  check("description")
      .exists({ checkFalsy: true })
      .withMessage("Description is required")
  ,
  check("price")
      // .exists({ checkFalsy: true })
      .isFloat()
      .withMessage("Price per day is required")
  ,
  handleSpotValidationErrors
]

const validateReviews = [
  check("review")
      .exists({ checkFalsy: true })
      .withMessage("Review text is required")
  ,
  check("stars")
      // .exists({ checkFalsy: true })
      .isFloat({ min: 1, max: 5})
      .withMessage("Stars must be an integer from 1 to 5")
  ,
  handleSpotValidationErrors
]

const validateBookings = [
  check("startDate")
      .isDate()
      .withMessage("startDate is not valid")
  ,
  check("endDate")
      .isDate()
      .withMessage("endDate is not valid")
  ,
  handleSpotValidationErrors
]

const validateQuery = [
  check("page")
      .optional()
      .isInt({min:1})
      .withMessage("Page must be greater than or equal to 1")
  ,
  check("size")
      .optional()
      .isInt({min:1})
      .withMessage("Size must be greater than or equal to 1")
  ,
  check("minLat")
      .optional()
      .isDecimal()
      .withMessage("Minimum latitude is invalid")
  ,
  check("maxLat")
      .optional()
      .isDecimal()
      .withMessage("Maximum latitude is invalid")
  ,
  check("minLng")
      .optional()
      .isDecimal()
      .withMessage("Minimum longitude is invalid")
  ,
  check("maxLng")
      .optional()
      .isDecimal()
      .withMessage("Maximum longitude is invalid")
  ,
  check("minPrice")
      .optional()
      .isFloat({min: 0})
      .withMessage("Minimum price must be greater than or equal to 0")
  ,
  check("maxPrice")
      .optional()
      .isFloat({min: 0})
      .withMessage("Maximum price must be greater than or equal to 0")
  ,
  handleSpotValidationErrors
]


module.exports = {
  handleValidationErrors,
  handleSpotValidationErrors,
  validateSignup,
  validateCreateSpot,
  validateReviews,
  validateBookings,
  validateQuery
};
