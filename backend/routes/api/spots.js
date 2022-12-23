const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleSpotValidationErrors } = require('../../utils/validation');


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
        // .exists({ checkFalsy: true })
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


// GET ALL SPOTS api/spots
router.get("/", validateQuery, async (req, res, next) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    let pagination = { query: [] };

    page = +page;
    size = +size;

    if (!page) page = 1;
    if (!size) size = 20;

    if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    if (minLat) pagination.query.push({ lat: { [Op.gte]: parseFloat(minLat) } });

    if (maxLat) pagination.query.push({ lat: { [Op.lte]: parseFloat(maxLat) } });

    if (minLng) pagination.query.push({ lng: { [Op.gte]: parseFloat(minLng) } });

    if (maxLng) pagination.query.push({ lng: { [Op.lte]: parseFloat(maxLng) } });

    if (minPrice) pagination.query.push({ price: { [Op.gte]: parseFloat(minPrice) } });

    if (maxPrice) pagination.query.push({ price: { [Op.lte]: parseFloat(maxPrice) } });

    // console.log(pagination)
    // {
    //     query: [
    //       { lat: [Object] },
    //       { lat: [Object] },
    //       { lng: [Object] },
    //       { lng: [Object] },
    //       { price: [Object] },
    //       { price: [Object] }
    //     ],
    //     limit: 3,
    //     offset: 0
    //   }

    let spots = await Spot.findAll({
        where: {
            [Op.and]: pagination.query
        },
        include: [
            {
                model: SpotImage,
            }
        ],
        ...pagination
    })

    // console.log(spots)


    let spotArray = [];

    for (let spot of spots) {
        const avgReview = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [
                    sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                ]
            ]
        });

        for (let average of avgReview) {
            spot.dataValues.avgRating = average.dataValues.avgRating
        }
        spotArray.push(spot.toJSON())
    }


    spotArray.forEach(spot => {
        spot.lat = parseFloat(spot.lat)
        spot.lng = parseFloat(spot.lng)
        spot.price = parseFloat(spot.price)
        spot.avgRating = parseFloat(spot.avgRating)
        spot.SpotImages.forEach(image => {
            // console.log(image.url)
            if(image.preview === true) {
                spot.previewImage = image.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = "No image url found"
        }

        if (!spot.avgRating) {
            spot.avgRating = "No ratings"
        }
        delete spot.SpotImages
    })

    return res.json({Spots: spotArray, page: page, size: size})
})

// Get api/spots/current
router.get("/current", requireAuth, async (req, res, next) => {

    let user = req.user;
    // console.log(user)

    let currentUserSpot = await Spot.findAll({
        where: {
            ownerId: user.id
        },
        include: [
            {
                model: Review,
            },
            {
                model: SpotImage,
            }
        ],
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"
                ]
            ],
        },
        group: ["Reviews.id", "Spot.id", "SpotImages.id"]
    });

    let currentArr = [];
    currentUserSpot.forEach(spot => {
        currentArr.push(spot.toJSON());
    })

    currentArr.forEach(spot => {
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);
        spot.avgRating = parseFloat(spot.avgRating);
        spot.SpotImages.forEach(image => {
            // console.log(image.url)
            if(image.preview === true) {

                spot.previewImage = image.url
            };
        })
        if (!spot.previewImage) {
            spot.previewImage = "No image url found"
        };
        if (!spot.avgRating) {
            spot.avgRating = "No ratings"
        };
        delete spot.Reviews
        delete spot.SpotImages
    })

    if (!currentArr.length) {
        res.json("User does not have any spots");
    }

    return res.json({Spots: currentArr});
})


// GET api/spots/:spotId
router.get("/:spotId", async (req, res, next) => {
    const { spotId } = req.params;

    let spots = await Spot.findByPk(spotId, {
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"]
            },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"]
            }
        ],
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgStarRating"
                ],
                [
                    sequelize.fn("COUNT", sequelize.col("Reviews.spotId")), "numReviews"
                ]
            ]
        },
        group: ["Reviews.id", "Spot.id", "SpotImages.id", "Owner.id"]
    })

    if (spots) {
        let spot = spots.toJSON();
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);
        spot.avgStarRating = parseFloat(spot.avgStarRating);
        spot.numReviews = parseFloat(spot.numReviews);
        return res.json(spot);
    } else {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        });
    }
})

// Add an Image to a Spot based on the Spot's ID /:spotId/images
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { url, preview } = req.body;
    const { spotId } = req.params;

    // Find the spotId
    const findSpot = await Spot.findByPk(spotId);

    if(!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        });
    }

    // If spot belongs to the current user
    if (user.id === findSpot.ownerId) {
        const createSpotImage = await SpotImage.create({
            spotId: spotId,
            url,
            preview
        })
        const spotImage = await SpotImage.findAll({
            where: {
                id: createSpotImage.id
            },
            attributes: ["id", "url", "preview"]
        })
        return res.json(spotImage[0]);
    } else {
        return res.status(400).json({
            message: "Only owners can add images for spot",
            statusCode: res.statusCode
        });
    }

})


// Create a Spot /api/spots
router.post("/", requireAuth, validateCreateSpot, async (req, res, next) => {
    let user = req.user;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const createSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    if (createSpot) {
        return res.status(201).json(createSpot);
    }

})

// Edit a Spot /api/spots/:spotId
router.put("/:spotId", requireAuth, validateCreateSpot, async (req, res, next) => {
    let user = req.user;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const findSpot = await Spot.findByPk(spotId);

    if (!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    }

    if (user.id === findSpot.ownerId) {
        findSpot.address = address;
        findSpot.city = city;
        findSpot.state = state;
        findSpot.country = country;
        findSpot.lat = lat;
        findSpot.lng = lng;
        findSpot.name = name;
        findSpot.description = description;
        findSpot.price = price;

        await findSpot.save();

        return res.json(findSpot);
    } else {
        return res.status(400).json({
            message: "Only owner can make changes to the spot",
            statusCode: res.statusCode
        });
    }

})

// Delete a Spot /api/spots/:spotId
router.delete("/:spotId", requireAuth, async (req, res, next) => {
    let user = req.user;
    const { spotId } = req.params;

    const findSpot = await Spot.findByPk(spotId);

    if (!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        });
    }

    if (user.id === findSpot.ownerId) {
        await findSpot.destroy();
        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        });
    } else {
        return res.status(400).json({
            message: "Must be an owner to delete spot",
            statusCode: res.statusCode
        });
    }
})

// Get all Reviews by a Spot's ID /api/spots/:spotId/reviews
router.get("/:spotId/reviews", async (req, res, next) => {
    const { spotId } = req.params;

    const findSpot = await Spot.findByPk(spotId);

    let reviewSpot = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: {exclude: ['reviewId', 'createdAt', 'updatedAt']}
            }
        ]
    })

    if (!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    } else {
        return res.json({Reviews: reviewSpot});
    }
})

// Create a Review for a Spot based on the Spot's id
router.post("/:spotId/reviews", requireAuth, validateReviews, async (req, res, next) => {
    let user = req.user;

    const { spotId } = req.params;

    const { review, stars } = req.body;

    const findSpot = await Spot.findByPk(spotId);

    const reviewExist = await Review.findOne({
        where: {
            spotId: spotId,
            userId: user.id
        }
    })

    if (!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        });
    }

    if(reviewExist) {
        return res.status(403).json({
            message: "User already has a review for this spot",
            statusCode: res.statusCode
        });
    }

    if (findSpot.ownerId === user.id) {
        return res.status(400).json({
            message: "You cannot write reviews for your own spot",
            statusCode: res.statusCode
        });
    }

    const createReview = await Review.create({
        spotId: spotId,
        userId: user.id,
        review,
        stars
    });

    return res.status(201).json(createReview);

})

// Get all bookings for a Spot based on the Spot /api/spots/:spotId/bookings
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { spotId } = req.params;

    const findSpot = await Spot.findByPk(spotId);

    if(!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        });
    }

    if (user.id !== findSpot.ownerId){
        const getBooking = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: ["spotId", "startDate", "endDate"]
        })
        return res.status(200).json({Bookings: getBooking});
    } else {
        const ownerBooking = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"]
                }
            ]
        })
        return res.status(200).json({Bookings: ownerBooking});
    }
})

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, validateBookings, async (req, res, next) => {
    let user = req.user;

    const { spotId } = req.params;

    const findSpot = await Spot.findByPk(spotId);

    const { startDate, endDate } = req.body;

    if (!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    };

    if (user.id === findSpot.ownerId) {
        return res.status(400).json({
            message: "You cannot book your own spot",
            statusCode: res.statusCode
        })
    }

    const getCurrentBookings = await Booking.findAll({
        where: {
            spotId: spotId,
            [Op.and]: [ {startDate: {[Op.lte]: endDate}}, {endDate: {[Op.gte]: startDate}} ],
          },
        });


    if (getCurrentBookings.length) {
    // console.log(getCurrentBookings)
    return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: res.statusCode,
        errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        }
    })
    };

    if (endDate <= startDate) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: res.statusCode,
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }

    if (new Date(startDate) < new Date()) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: res.statusCode,
            errors: {
                startDate: "startDate cannot be set in the past from today"
            }
        })
    }

    if (user.id !== findSpot.ownerId) {
        const newBooking = await Booking.create({
            spotId: spotId,
            userId: user.id,
            startDate,
            endDate
        })

        return res.json(newBooking)
    }

})

module.exports = router;
