const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models');

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
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage("Latitude is not valid")
    ,
    check("lng")
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage("Longitude is not valid")
    ,
    check("name")
        .exists({ checkFalsy: true })
        .isLength({ max: 49 })
        .withMessage("Name must be less than 50 characters")
    ,
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required")
    ,
    check("price")
        .exists({ checkFalsy: true })
        .isNumeric()
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
        .exists({ checkFalsy: true })
        .isFloat({ min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5")
    ,
    handleSpotValidationErrors
]


// GET ALL SPOTS api/spots
router.get("/", async (req, res, next) => {

    let spots = await Spot.findAll({
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
                ],
            ],
        },
        group: ["Reviews.id", "Spot.id", "SpotImages.id"]
    })

    let spotArray = [];
    spots.forEach(spot => {
        spotArray.push(spot.toJSON())
    })

    spotArray.forEach(spot => {
        // console.log(spot.SpotImages)
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
        delete spot.Reviews
        delete spot.SpotImages
    })

    // console.log(spotArray)
    return res.json({Spots: spotArray})
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
        currentArr.push(spot.toJSON())
    })

    currentArr.forEach(spot => {
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
        spot.lat = parseFloat(spot.lat)
        spot.lng = parseFloat(spot.lng)
        spot.price = parseFloat(spot.price)
        spot.avgStarRating = parseFloat(spot.avgStarRating)
        spot.numReviews = parseFloat(spot.numReviews)
        return res.json(spot)
    } else {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    }
})

// Add an Image to a Spot based on the Spot's ID /:spotId/images
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { url, preview } = req.body;
    const { spotId } = req.params;

    // Find the spotId
    const findSpot = await Spot.findByPk(spotId)

    if(!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
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
        return res.json(spotImage[0])
    } else {
        return res.status(400).json({
            message: "Only owners can add images for spot",
            statusCode: res.statusCode
        })
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
        return res.status(201).json(createSpot)
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

        return res.json(findSpot)
    } else {
        return res.status(400).json({
            message: "Only owner can make changes to the spot",
            statusCode: res.statusCode
        })
    }

})

// Delete a Spot /api/spots/:spotId
router.delete("/:spotId", requireAuth, async (req, res, next) => {
    let user = req.user
    const { spotId } = req.params;

    const findSpot = await Spot.findByPk(spotId);

    if (!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    }

    if (user.id === findSpot.ownerId) {
        await findSpot.destroy()
        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        })
    } else {
        return res.status(400).json({
            message: "Must be an owner to delete spot",
            statusCode: res.statusCode
        })
    }
})

// Get all Reviews by a Spot's ID /api/spots/:spotId/reviews
router.get("/:spotId/reviews", async (req, res, next) => {
    const { spotId } = req.params;

    const findSpot = await Spot.findByPk(spotId)

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
        return res.json({Reviews: reviewSpot})
    }
})

// Create a Review for a Spot based on the Spot's id
router.post("/:spotId/reviews", requireAuth, validateReviews, async (req, res, next) => {
    let user = req.user;

    const { spotId } = req.params;

    const { review, stars } = req.body;

    const findSpot = await Spot.findByPk(spotId)

    const reviewExist = await Review.findOne({
        where: {
            spotId: spotId,
            userId: user.id
        }
    })
    // console.log(findSpot)

    if (!findSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    }

    if(reviewExist) {
        return res.status(403).json({
            message: "User already has a review for this spot",
            statusCode: res.statusCode
        })
    }

    if (findSpot.ownerId === user.id) {
        return res.status(400).json({
            message: "You cannot write reviews for your own spot",
            statusCode: res.statusCode
        })
    }

    const createReview = await Review.create({
        spotId: spotId,
        userId: user.id,
        review,
        stars
    })

    res.status(201).json(createReview)

})

module.exports = router;
