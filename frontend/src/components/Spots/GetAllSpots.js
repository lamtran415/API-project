import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { thunkLoadAllSpots } from "../../store/spotReducer";
import './GetAllSpots.css'


const GetAllSpots = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkLoadAllSpots())
    }, [dispatch])

    let spots = useSelector(state => state.spots);

    let spotsArr = Object.values(spots);

    if(!spotsArr) return null;

    return (
        <div className="spots-div-wrapper">
            <ul className="spotsUl">
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
                                        <span className="average-rating">{spot.avgRating}</span>
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
            </ul>
        </div>
    )
}

export default GetAllSpots
