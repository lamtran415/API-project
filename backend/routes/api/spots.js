const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, sequelize } = require('../../db/models');

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


// GET ALL SPOTS api/spots
router.get("/", async (req, res) => {

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
    res.json({Spots: spotArray})
})

// Get api/spots/current
router.get("/current", requireAuth, async (req, res) => {

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
        res.json("User does not have any spots")
    }

    res.json({Spots: currentArr})
})


// GET api/spots/:spotId
router.get("/:spotId", async (req, res) => {
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
        res.json(spot)
    } else {
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    }
})

// Add an Image to a Spot based on the Spot's ID /:spotId/images
router.post("/:spotId/images", requireAuth, async (req, res) => {
    let user = req.user;

    const { url, preview } = req.body;
    const { spotId } = req.params;

    // Find current user
    const userSpot = await Spot.findByPk(user.id, {
        include: [
            {
                model: SpotImage
            }
        ]
    })

    // Find the spotId
    const findSpot = await Spot.findByPk(spotId)

    // If current user is owner && spot is found
    if (userSpot && findSpot) {
        const createSpotImage = await SpotImage.create({
            spotId: spotId,
            url,
            preview
        })
        userSpot.SpotImages += createSpotImage;
        const spotImage = await SpotImage.findAll({
            where: {
                id: createSpotImage.id
            },
            attributes: ["id", "url", "preview"]
        })
        res.json(spotImage[0])
    } else {
        res.status(404).json({
            message: "Spot couldn't be found",
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
        res.status(201).json(createSpot)
    }

})

// Edit a Spot /api/spots/:spotId
router.put("/:spotId", requireAuth, validateCreateSpot, async (req, res, next) => {
    let user = req.user;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const findOwner = await Spot.findByPk(user.id);

    const findSpot = await Spot.findByPk(spotId);

    if (findOwner && findSpot) {
        findSpot.address = address;
        findSpot.city = city;
        findSpot.state = state;
        findSpot.country = country;
        findSpot.lat = lat;
        findSpot.lng = lng;
        findSpot.name = name;
        findSpot.description = description;
        findSpot.price = price

        await findSpot.save();

        res.json(findSpot)
    }
    else if (!findSpot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    }
})




module.exports = router;
