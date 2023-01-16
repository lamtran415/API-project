import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';

// Action Creators
const loadAllSpots = (spots) => ({
    type: GET_SPOTS,
    spots
})

// Thunks

// GET ALL SPOTS ---- /api/spots
export const getAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const spots = await res.json();
        // console.log("getAllSpots Thunk", spots)
        dispatch(loadAllSpots(spots))
        return spots;
    }
}


// // Reducer
let initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = {...state};
            action.spots.Spots.forEach(spot => {
                newState[spot.id] = spot;
            })
            console.log("newState-------------------", newState)
            return newState;
        }
        default:
            return state;
    }
}

export default spotReducer;
