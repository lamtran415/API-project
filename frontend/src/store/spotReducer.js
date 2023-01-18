import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';
const GET_SPOT_ID = 'spots/getSpotsById';
const CREATE_SPOT = 'spots/createSpot';
const UPDATE_SPOT = 'spots/updateSpot'

// Action Creators
const loadAllSpots = (spots) => ({
    type: GET_SPOTS,
    spots
})

const loadSpotById = (spot) => ({
    type: GET_SPOT_ID,
    spot
})

const createNewSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
})

const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})


// Thunks
// GET ALL SPOTS ---- /api/spots
export const thunkLoadAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const spots = await res.json();
        // console.log("getAllSpots Thunk", spots)
        dispatch(loadAllSpots(spots))
        return spots;
    }
}

// GET SPOT BY ID ---- /api/spots/:spotId
export const thunkLoadOneSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const spotById = await res.json();
        // console.log(spotById)
        dispatch(loadSpotById(spotById));
        return spotById;
    }
}

// CREATE A SPOT ---- /api/spots
export const thunkCreateSpot = (spot) => async (dispatch) => {
    const {address, city, state, country, lat, lng, name, description, price, url} = spot
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    })

    if (res.ok) {
        const newSpot = await res.json();
        const imageRes = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                url,
                preview: true
            })
        })

        if (imageRes.ok) {
            newSpot.previewImage = url
            dispatch(createNewSpot(newSpot))
            return newSpot
        }
    }
    return res;
}

// EDIT A SPOT ---- /api/spots/:spotId
export const thunkUpdateSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(spot)
    });

    if(res.ok) {
        const updatedSpot = await res.json();
        dispatch(updateSpot(updatedSpot))
        console.log("2) UPDATE SPOT THUNKER =============", updatedSpot)
        return updatedSpot;
    }
}

// // Reducer
let initialState = {};

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const loadAllSpots = {...state};
            action.spots.Spots.forEach(spot => {
                loadAllSpots[spot.id] = spot;
            })
            return loadAllSpots;
        }
        case GET_SPOT_ID: {
            const loadSpotById = {...state};
            loadSpotById[action.spot.id] = action.spot;
            return loadSpotById;
        }
        case CREATE_SPOT: {
            const newSpot = {...state};
            newSpot[action.spot.id] = action.spot;
            return newSpot;
        }
        case UPDATE_SPOT: {
            const updateSpot = {...state};
            updateSpot[action.spot.id] = action.spot;
            return updateSpot;
        }
        default:
            return state;
    }
}

export default spotReducer;
