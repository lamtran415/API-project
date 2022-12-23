const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Booking, sequelize } = require('../../db/models');
const { Op } = require("sequelize");

const { validateBookings } = require('../../utils/validation');

// Get all of the Current User's Bookings ------------------- URL: /api/bookings/current
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

// Edit a Booking ------------------- URL: /api/bookings/:bookingId
router.put("/:bookingId", requireAuth, validateBookings, async (req, res, next) => {
    let user = req.user;

    const { bookingId } = req.params;

    const { startDate, endDate } = req.body;

    const findBooking = await Booking.findByPk(bookingId);

    if (!findBooking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: res.statusCode
        })
    };

    if (user.id !== findBooking.userId) {
        return res.status(403).json({
            message: "Only the owner of this booking can make edits",
            statusCode: res.statusCode
        })
    }

    if(endDate < startDate) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: res.statusCode,
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    };

    if (new Date(findBooking.endDate) < new Date()) {
        return res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: res.statusCode
        })
    }

    const getCurrentBookings = await Booking.findAll({
        where: {
            spotId: findBooking.spotId,
            [Op.and]: [ {startDate: {[Op.lte]: endDate}}, {endDate: {[Op.gte]: startDate}} ],
          },
        });

    if (getCurrentBookings.length) {
        // console.log(getCurrentBookings)
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: res.statusCode,
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        })
    };

    if (user.id === findBooking.userId) {
        findBooking.startDate = startDate;
        findBooking.endDate = endDate;
        findBooking.updatedAt = new Date();

        await findBooking.save();
        return res.status(200).json(findBooking);
    }

})

// Delete a Booking ----------------- URL: /api/bookings/:bookingId
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
    let user = req.user;

    const { bookingId } = req.params;

    const findBooking = await Booking.findByPk(bookingId);

    const findSpotOwner = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })

    if (!findBooking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: res.statusCode
        });
    };

    if (new Date(findBooking.startDate) < new Date()) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted",
            statusCode: res.statusCode
        });
    }

    if (user.id === findBooking.userId || findSpotOwner.ownerId === user.id) {
        await findBooking.destroy();
        return res.status(200).json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        })
    } else {
        return res.status(403).json({
            message: "Must be owner of booking or spot to delete booking",
            statusCode: res.statusCode
        });
    }
})

module.exports = router;
