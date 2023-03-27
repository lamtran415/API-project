import { csrfFetch } from "./csrf";

const GET_SPOTS_BOOKINGS = 'bookings/GET_SPOTS_BOOKINGS';
const GET_USER_BOOKINGS = 'bookings/GET_USER_BOOKINGS';
const CREATE_SPOT_BOOKING = 'bookings/CREATE_SPOT_BOOKING';
const EDIT_SPOT_BOOKING = 'bookings/EDIT_SPOT_BOOKING';
const DELETE_USER_BOOKING = 'bookings/DELETE_USER_BOOKING';

// Action Creators
const loadSpotBookings = (bookings) => ({
    type: GET_SPOTS_BOOKINGS,
    bookings
})

const loadUserBookings = (bookings) => ({
    type: GET_USER_BOOKINGS,
    bookings
})

const createSpotBooking = (booking) => ({
    type: CREATE_SPOT_BOOKING,
    booking
})

const editSpotBooking = (booking) => ({
    type: EDIT_SPOT_BOOKING,
    booking
})

const deleteUserBooking = (bookingId) => ({
    type: DELETE_USER_BOOKING,
    bookingId
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

// GET User's Bookings ---- /bookings/current
export const thunkLoadUserBookings = () => async (dispatch) => {
    const res = await fetch(`/api/bookings/current`);

    if (res.ok) {
        const userBookings = await res.json();
        dispatch(loadUserBookings(userBookings))
        return userBookings
    }
}

// CREATE Spot's Booking ---- /spots/:spotId/bookings
export const thunkCreateSpotBooking = (spotId, bookingDetails) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        body: JSON.stringify(bookingDetails)
    })

    if (res.ok) {
        const newBooking = await res.json()
        dispatch(createSpotBooking(newBooking))
        return newBooking
    }  else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ['An error occurred. Please try again.'];
    }

    return res;
}

// EDIT Spot's Booking ---- /spots/:spotId/bookings
export const thunkEditSpotBooking = (bookingId, bookingDetails) => async (dispatch) => {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        body: JSON.stringify(bookingDetails)
    })

    if (res.ok) {
        const editBooking = await res.json()
        dispatch(editSpotBooking(editBooking))
        return editBooking
    }  else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) {
            return data.errors;
        }
    } else {
        return ['An error occurred. Please try again.'];
    }

    return res;
}

// DELETE User Booking ---- /api/bookings/:bookingId
export const thunkDeleteUserBooking = (bookingId) => async (dispatch) => {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
    })

    if(res.ok) {
        dispatch(deleteUserBooking(bookingId));
    }
}

let initialState = { spotBookings: {}, userBookings: {}}

const bookingReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS_BOOKINGS: {
            const spotBookings = {};
            action.bookings.Bookings.forEach((booking) => {
                spotBookings[booking.startDate] = booking;
            });
            return { ...state, spotBookings };
        }
        case GET_USER_BOOKINGS: {
            const userBookingsState = {...state, userBookings: {}}
            action.bookings.Bookings.forEach(booking => {
                userBookingsState.userBookings[booking.id] = booking
            })
            return userBookingsState
        }
        case CREATE_SPOT_BOOKING: {
            const createBookingState = {...state};
            createBookingState.userBookings[action.booking.id] = action.booking
            return createBookingState
        }
        case EDIT_SPOT_BOOKING: {
            const editBookingState = {...state};
            editBookingState.userBookings[action.booking.id] = action.booking
            return editBookingState
        }
        case DELETE_USER_BOOKING: {
            const removeUserBookingState = {...state};
            delete removeUserBookingState.userBookings[action.bookingId]
            return removeUserBookingState
        }
        default:
            return state
    }
}

export default bookingReducer;
