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

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { url } = req.body;

    const { reviewId } = req.params;

    let findReview = await Review.findOne({
        where: {
            id: reviewId,
            userId: user.id
        },
        include: [
            {
                model: ReviewImage
            }
        ]
    })

    if (!findReview) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: res.statusCode
        })
    }

    if (findReview.ReviewImages.length > 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: res.statusCode
        })
    }

    if (findReview && url.length) {
        const createReviewImage = await ReviewImage.create({
            reviewId: reviewId,
            url
        })

        return res.status(200).json({
            id: createReviewImage.id,
            url: createReviewImage.url
        })
    } else {
        return res.status(400).json({
            message: "A url is required to add an image",
            statusCode: res.statusCode
        })
    }
})


module.exports = router;
