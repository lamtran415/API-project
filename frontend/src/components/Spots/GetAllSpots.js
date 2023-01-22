import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { thunkLoadAllSpots } from "../../store/spotReducer";
import './GetAllSpots.css'


const GetAllSpots = () => {
    const dispatch = useDispatch();
    let spots = useSelector(state => state.spots);
    let spotsArr = Object.values(spots);

    useEffect(() => {
        dispatch(thunkLoadAllSpots())
    }, [dispatch])

    if(!spotsArr) return null;

    return (
        <div className="spots-div-wrapper">
            <div className="spotsDiv">
                {spotsArr.map(spot => {
                    return (
                        <NavLink style={{textDecoration: 'none'}} className='spots' key={spot.id} to={`/spots/${spot.id}`}>
                            <img
                                className="spotImages"
                                src={spot.previewImage}
                                alt=""
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
                    )
                })}
            </div>
        </div>
    )
}

export default GetAllSpots
