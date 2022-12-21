const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


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


module.exports = router;
