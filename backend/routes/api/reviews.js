const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');

const { validateReviews } = require('../../utils/validation');

// Get all Reviews of the Current User ---------------------------- URL: /api/reviews/current
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
                attributes: {exclude: ['createdAt', 'updatedAt', 'description']},
                include: [
                    {
                        model: SpotImage
                    }
                ]

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
        review.Spot.lat = parseFloat(review.Spot.lat);
        review.Spot.lng = parseFloat(review.Spot.lng);
        review.Spot.price = parseFloat(review.Spot.price);
        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                review.Spot.previewImage = image.url;
            };
        });
        if (!review.Spot.previewImage) {
            review.Spot.previewImage = "No image available";
        };

        delete review.Spot.SpotImages;
    });

    return res.json({Reviews: currReviewArr});
})

// Add an Image to a Review based on the Review's id ----------------- URL: /api/reviews/:reviewId/images
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { url } = req.body;

    const { reviewId } = req.params;

    let findReview = await Review.findOne({
        where: {
            id: reviewId,
            // userId: user.id
        },
        include: [
            {
                model: ReviewImage
            }
        ]
    });

    if (!findReview) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: res.statusCode
        });
    };

    if (findReview.userId !== user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: res.statusCode
        })
    }

    if (findReview.ReviewImages.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: res.statusCode
        });
    };

    if (findReview) {
        if (!url.length) {
            return res.status(400).json({
                message: "A url is required to add an image",
                statusCode: res.statusCode
        })
    }
        const createReviewImage = await ReviewImage.create({
            reviewId: reviewId,
            url
        });

        return res.status(200).json({
            id: createReviewImage.id,
            url: createReviewImage.url
        });
    }
})


// Edit a Review ----------------------------- URL: /api/reviews/:reviewId
router.put("/:reviewId", requireAuth, validateReviews, async (req, res, next) => {
    let user = req.user;

    const { reviewId } = req.params;

    const { review, stars } = req.body;

    let userReview = await Review.findOne({
        where: {
            id: reviewId,
            // userId: user.id
        }
    });

    if (!userReview) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: res.statusCode
        });
    }

    if (userReview.userId !== user.id) {
        return res.status(400).json({
            message: "Forbidden",
            statusCode: res.statusCode
        })
    }

    userReview.review = review;
    userReview.stars = stars;

    await userReview.save();

    return res.status(200).json(userReview);

})

// Delete a Review -------------------------------------- URL: /api/reviews/:reviewId
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
    let user = req.user;
    const { reviewId } = req.params;

    let userReview = await Review.findOne({
        where: {
            id: reviewId,
            // userId: user.id
        }
    })

    if (!userReview) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: res.statusCode
        });
    }

    if (userReview.userId !== user.id) {
        return res.status(400).json({
            message: "Forbidden",
            statusCode: res.statusCode
        })
    } else {
        await userReview.destroy();
        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        });
    }

})


module.exports = router;
