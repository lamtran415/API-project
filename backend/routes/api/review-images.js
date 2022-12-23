const express = require('express');
const router = express.Router();

const {requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');


// Delete a Review Image ---- URL: /api/review-images/:imageId
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { imageId } = req.params;

    const findReviewImage = await ReviewImage.findByPk(imageId);

    if (!findReviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        })
    };

    const findReviewUser = await Review.findOne({
        where: {
            userId: user.id
        },
        include: [
            {
                model: ReviewImage,
                where: {
                    id: imageId
                }
            }
        ]
    });

    if (findReviewUser) {
        await findReviewUser.ReviewImages[0].destroy();
        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        })
    } else {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: res.statusCode
        });
    }
})

module.exports = router;
