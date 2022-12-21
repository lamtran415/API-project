const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// GET ALL SPOTS
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


router.get("/current", requireAuth, async (req, res) => {

    let user = req.user;

    let currentUserSpot = await user.getSpots({
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
        group: ["Reviews.id", "Spot.id", "SpotImages.id", "ownerId"]
    })

    if (spots) {
        res.json(spots)
    } else {
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: res.statusCode
        })
    }


})

module.exports = router;
