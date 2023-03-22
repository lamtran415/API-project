import { csrfFetch } from "./csrf";

const GET_SPOTS_BOOKINGS = 'bookings/GET_SPOTS_BOOKINGS';
const CREATE_SPOT_BOOKING = 'bookings/CREATE_SPOT_BOOKING';

// Action Creators
const loadSpotBookings = (bookings) => ({
    type: GET_SPOTS_BOOKINGS,
    bookings
})

const createSpotBooking = (booking) => ({
    type: CREATE_SPOT_BOOKING,
    booking
})

// Thunks

// GET Spot's Booking ---- /spots/:spotId/bookings
export const thunkLoadSpotBookings = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/bookings`);

    if (res.ok) {
        const spotBookings = await res.json();
        dispatch(loadSpotBookings(spotBookings))
        return spotBookings
    }
}

export const thunkCreateSpotBooking = (spotId, bookingDetails) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        body: JSON.stringify(bookingDetails)
    })

    if (res.ok) {
        const newBooking = await res.json()
        dispatch(createSpotBooking(newBooking))
        return newBooking
    }

    return res;
}

let initialState = {}

const bookingReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS_BOOKINGS: {
            const spotBookingsState = {}
            action.bookings.Bookings.forEach(booking => {
                spotBookingsState[booking.startDate] = booking
            })
            return spotBookingsState
        }
        case CREATE_SPOT_BOOKING: {
            const createBookingState = {...state};
            createBookingState[action.booking.id] = action.booking
            return createBookingState
        }
        default:
            return state
    }
}

export default bookingReducer;
