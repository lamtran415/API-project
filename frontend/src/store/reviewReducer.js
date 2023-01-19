import { csrfFetch } from './csrf';

const GET_REVIEWS_SPOT = 'reviews/getSpotReviews';
const CREATE_REVIEW_SPOT = 'reviews/createSpotReview';
const DELETE_REVIEW = 'reviews/deleteUserReview';

// Action Creators
const loadReviewsForSpot = (reviews) => ({
    type: GET_REVIEWS_SPOT,
    reviews
});

const createReviewForSpot = (spot) => ({
    type: CREATE_REVIEW_SPOT,
    spot
})

const deleteReviewForSpot = (reviewId) => ({
    type: DELETE_REVIEW,
    review: reviewId
})

// Thunks
// Get All Reviews by Spot's ID ---- /api/spots/:spotId/reviews
export const thunkLoadReviewsForSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const reviews = await res.json();
        dispatch(loadReviewsForSpot(reviews));
        return reviews;
    }
};

// CREATE REVIEW FOR A SPOT ---- /api/spots/:spotId/reviews
export const thunkCreateReviewForSpot = (reviewDetails, spotId, spotById, reviews) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(reviewDetails)
    });

    if (res.ok) {
        const reviewDetails = await res.json();
        const combineReviewObj = {...reviewDetails, ...spotById, ...reviews}
        await dispatch(createReviewForSpot(combineReviewObj));
        return combineReviewObj;
    }
}

// DELETE REVIEW FROM SPOT ---- /api/reviews/:reviewId
export const thunkDeleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: `DELETE`
    })

    if(res.ok) {
        // const reviewSessionObj = {...reviewId, ...copySessionUser}
        await dispatch(deleteReviewForSpot(reviewId))
    }

    return res;
}

let initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS_SPOT: {
            const getSpotReviews = {};
            action.reviews.Reviews.forEach(review => {
                getSpotReviews[review.id] = review
            })
            return getSpotReviews;
        }
        case CREATE_REVIEW_SPOT: {
            const createSpotReview = {...state};
            createSpotReview[action.spot.id] = action.spot;
            return createSpotReview;
        }
        case DELETE_REVIEW: {
            const removeReview = {...state};
            delete removeReview[action.review];
            return removeReview;
        }
        default:
            return state;
    }
}

export default reviewReducer;
