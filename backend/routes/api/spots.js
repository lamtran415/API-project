const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
                ]
            ],
        },
        group: ["Spot.id"]
    })

    let spotArray = [];
    spots.forEach(spot => {
        spotArray.push(spot.toJSON())
    })

    spotArray.forEach(spot => {
        // console.log(spot.SpotImages)
        spot.SpotImages.forEach(image => {
            // console.log(image.url)
            if(image.url) {

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
        group: ["Spot.id"]
    });

    let currentArr = [];
    currentUserSpot.forEach(spot => {
        currentArr.push(spot.toJSON())
    })

    currentArr.forEach(spot => {
        spot.SpotImages.forEach(image => {
            // console.log(image.url)
            if(image.url) {

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

module.exports = router;
