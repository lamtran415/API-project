const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, ReviewImage, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleSpotValidationErrors } = require('../../utils/validation');

// Get all of the Current User's Bookings /api/bookings/current
router.get("/current", requireAuth, async (req, res, next) => {
    let user = req.user;

    let currentBooking = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: {exclude: ["createdAt", "updatedAt", "description"]},
                include: [
                    {
                        model: SpotImage
                    }
                ]
            }
        ]
    })

    let currBookingArr = [];
    currentBooking.forEach(booking => {
        currBookingArr.push(booking.toJSON());
    })

    currBookingArr.forEach(booking => {
        booking.Spot.lat = parseFloat(booking.Spot.lat);
        booking.Spot.lng = parseFloat(booking.Spot.lng);
        booking.Spot.price = parseFloat(booking.Spot.price);
        booking.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                booking.Spot.previewImage = image.url;
            }
        })
        if (!booking.Spot.previewImage){
            booking.Spot.previewImage = "No image available";
        }

        delete booking.Spot.SpotImages;
    })

    return res.json({Bookings: currBookingArr});
})



module.exports = router;
