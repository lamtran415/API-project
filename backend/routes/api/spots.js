const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');
const { Op } = require("sequelize");

const { validateCreateSpot, validateReviews, validateBookings, validateQuery } = require('../../utils/validation');

// GET ALL SPOTS ---------------- URL: /api/spots
router.get("/", validateQuery, async (req, res, next) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    let pagination = {};

    page = +page;
    size = +size;

    if (!page) page = 1;
    if (!size) size = 20;
    if (page > 10) page = 10;
    if (size > 20) size = 20;

    if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    let where = {};

    if (minLat) where.lat = {[Op.gte]: parseFloat(minLat)};

    if (maxLat) where.lat = {[Op.lte]: parseFloat(maxLat)};

    if (minLat && maxLat) where.lat = {[Op.between]: [parseFloat(minLat),parseFloat(maxLat)]};

    if (minLng) where.lng = {[Op.gte]: parseFloat(minLng)};

    if (maxLng) where.lng = {[Op.lte]: parseFloat(maxLng)};

    if (minLng && maxLng) where.lng = {[Op.between]: [parseFloat(minLng), parseFloat(maxLng)]};

    if (minPrice) where.price = {[Op.gte]: parseFloat(minPrice)};

    if (maxPrice) where.price = {[Op.lte]: parseFloat(maxPrice)};

    if (minPrice && maxPrice) where.price = {[Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)]};

    let spots = await Spot.findAll({
        where,
        include: [
            {
                model: SpotImage,
            }
        ],
        ...pagination
    })

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

// Get all Spots owned by the Current User ------------- URL: /api/spots/current
router.get("/current", requireAuth, async (req, res, next) => {

    let user = req.user;

    let currentUserSpot = await Spot.findAll({
        where: {
            ownerId: user.id
        },
        include: [
            {
                model: SpotImage,
            }
        ]
    });

    let currentArr = [];

    for (let spot of currentUserSpot) {
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
        currentArr.push(spot.toJSON())
    }

    currentArr.forEach(spot => {
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);
        spot.avgRating = parseFloat(spot.avgRating);
        spot.SpotImages.forEach(image => {
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
        delete spot.SpotImages
    })

    if (!currentArr.length) {
        return res.json("User does not have any spots");
    }

    return res.json({Spots: currentArr});
})


// Get details of a Spot from an id --------------- URL: /api/spots/:spotId
router.get("/:spotId", async (req, res, next) => {
    const { spotId } = req.params;

    let spots = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"]
            },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"]
            }
        ]
    });

    if (!spots) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        });
    }

    const avgReview = await Review.findAll({
            where: {
                spotId: spots.id
            },
            attributes: [
                [
                    sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"
                ],
                [
                    sequelize.fn("COUNT", sequelize.col("spotId")), "numReviews"
                ]
            ]
    });

    for (let average of avgReview) {
            spots.dataValues.avgStarRating = average.dataValues.avgStarRating;
            spots.dataValues.numReviews = average.dataValues.numReviews;
    }

    if (spots) {
        let spot = spots.toJSON();
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);
        spot.avgStarRating = parseFloat(spot.avgStarRating);
        spot.numReviews = parseFloat(spot.numReviews);
        return res.json(spot);
    }
})

// Add an Image to a Spot based on the Spot's ID ----------- URL: /api/spots/:spotId/images
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

    if (!url.length) {
        return res.status(400).json({
            message: "URL is required",
            statusCode: res.statusCode
        })
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
        return res.status(403).json({
            message: "Forbidden",
            statusCode: res.statusCode
        });
    }

})


// Create a Spot ------------------ URL: /api/spots
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

// Edit a Spot --------------- URL: /api/spots/:spotId
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
        return res.status(403).json({
            message: "Forbidden",
            statusCode: res.statusCode
        });
    }

})

// Delete a Spot ------------- URL: /api/spots/:spotId
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
        return res.status(403).json({
            message: "Forbidden",
            statusCode: res.statusCode
        });
    }
})

// Get all Reviews by a Spot's ID -------------------------- URL: /api/spots/:spotId/reviews
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

// Create a Review for a Spot based on the Spot's id --------------- URL: /api/spots/:spotId/reviews
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
        return res.status(403).json({
            message: "Forbidden",
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

// Get all bookings for a Spot based on the spotId --------------------- URL: /api/spots/:spotId/bookings
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

// Create a Booking from a Spot based on the Spot's id -------------- URL: URL: /api/spots/:spotId/bookings
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
        return res.status(403).json({
            message: "Forbidden",
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
