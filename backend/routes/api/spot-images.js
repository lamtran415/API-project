const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage} = require('../../db/models');

// Delete a Spot Image ------ URL: /api/spot-images/:imageId
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { imageId } = req.params;

    const findSpotImage = await SpotImage.findByPk(imageId);

    if (!findSpotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: res.statusCode
        })
    }

    const findSpotOwner = await Spot.findOne({
        where: {
            ownerId: user.id
        },
        include: [
            {
                model: SpotImage,
                where: {
                    id: imageId
                }
            }
        ]
    })

    if (findSpotOwner) {
        await findSpotOwner.SpotImages[0].destroy();
        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        })
    } else {
        return res.status(400).json({
            message: "Only owner can delete this spot image",
            statusCode: res.statusCode
        })
    }
})


module.exports = router;
