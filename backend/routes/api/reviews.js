const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, ReviewImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleSpotValidationErrors } = require('../../utils/validation');

// Get all Reviews of the Current User /api/reviews/current
router.get("/current", requireAuth, async (req, res, next) => {
    let user = req.user;

    let currentReview = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {exclude: ['createdAt', 'updatedAt', 'description']}
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    let currReviewArr = [];
    currentReview.forEach(review => {
        currReviewArr.push(review.toJSON());
    })

    currReviewArr.forEach(review => {
        review.ReviewImages.forEach(image => {
            if (image.url) {
                review.Spot.previewImage = image.url
            }
        })
        if (!review.Spot.previewImage) {
            review.Spot.previewImage = "No image available"
        }
    })

    res.json({Reviews: currReviewArr})
})


module.exports = router;
