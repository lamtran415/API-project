import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import { thunkLoadUserSpots } from "../../../store/spotReducer";
import OpenModalButton from "../../OpenModalButton";
import UpdateSpot from "../../SpotForm/UpdateSpot";
import DeleteSpot from "../DeleteSpot";
import "./GetCurrentUserSpots.css"

const GetCurrentUserSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [ isLoaded, setIsLoaded ] = useState(false)

    useEffect(() => {
        dispatch(thunkLoadUserSpots())
        .then(() => (setIsLoaded(true)))
    }, [dispatch])

    const sessionUser = useSelector(state => state.session.user)
    const userSpots = Object.values(useSelector(state => state.spots)).filter(spot => spot.ownerId === sessionUser?.id)

    if (!sessionUser) return <Redirect to="/"/>;


    return (
        <>
        {isLoaded && (
            <div>
                <div className="spots-div-wrapper">
                    <h2 className="your-spots-title">Current Spots</h2>
                    <div className="spotsDiv">
                        {userSpots.length ? userSpots.map(spot => {
                            return (
                                <div key={spot.id}>
                                    <NavLink style={{textDecoration: 'none'}} className='spots' to={`/spots/${spot.id}`}>
                                        <img
                                            className="userImages"
                                            src={spot.previewImage}
                                            alt=""
                                            onError={e => { e.currentTarget.src = "https://wallpapercave.com/wp/wp1842933.jpg"; }}

                                        />
                                        <div className="spot-description-wrapper">
                                            <div className="spot-description">
                                                <div className="city-state">
                                                {`${spot.city}, ${spot.state}`}
                                                </div>
                                                <div className="avg-rating-wrapper">
                                                    <i className="fa fa-star fa-xs"></i>
                                                    <span className="average-rating">{parseFloat(spot.avgRating).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                            <div className="spot-price">
                                                <span className="pricing">{`$${spot.price} `}</span>
                                                <span>night</span>
                                            </div>
                                    </NavLink>
                                    <div className="user-edit-delete-buttons">
                                        <OpenModalButton
                                            className="user-edit-button"
                                            buttonText="Edit Spot"
                                            modalComponent={<UpdateSpot spotById={spot}/>}
                                        />
                                        <OpenModalButton
                                            className="user-edit-button"
                                            buttonText="Delete"
                                            modalComponent={<DeleteSpot spotId={spot.id}/>}
                                        />
                                    </div>
                                </div>
                            )
                        }):
                            <div className="not-hosting-div">
                                <h2>You currently are not hosting a spot</h2>
                                <button onClick={() => history.push('/')} className="not-hosting-home-btn">Home</button>
                            </div>
                        }
                    </div>
                </div>
            </div>)
        }
        </>
    )
}

export default GetCurrentUserSpots;
