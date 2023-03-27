import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { thunkLoadUserBookings } from "../../../store/bookingReducer";
import './UserBookings.css'

const UserBookings = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [ isLoaded, setIsLoaded ] = useState(false);

    useEffect(() => {
        dispatch(thunkLoadUserBookings())
            .then(() => setIsLoaded(true))
    }, [])

    const sessionUser = useSelector(state => state.session.user)
    const userBookings = Object.values(useSelector(state => state.bookings)).reverse()

    if (!sessionUser) return <Redirect to="/"/>;


    return (
        <>
            <div className="whole-user-bookings-container">
                <h2 className="user-bookings-header">Current Bookings</h2>
                {userBookings.length ? userBookings.map(booking => {
                    return (
                        <div className="bookings-div-container" key={booking.id}>
                            <div className="user-bookings-info">
                                <img
                                    className="booking-image"
                                    src={booking.Spot?.previewImage}
                                    alt=""
                                    onError={e => { e.currentTarget.src = "https://wallpapercave.com/wp/wp1842933.jpg"; }}
                                    onClick={() => history.push(`/spots/${booking.Spot.id}`)}
                                />
                                <div className="booking-spot-info-container">
                                    <div className="user-booking-spot-name"
                                        onClick={() => history.push(`/spots/${booking.Spot.id}`)}>
                                        {booking.Spot?.name}
                                    </div>
                                    <div className="user-booking-city-country">{booking.Spot?.city}, {booking.Spot?.state}</div>
                                    <div className="spot-price">
                                        <span className="pricing">{`$${booking.Spot?.price} `}</span>
                                        <span>night</span>
                                    </div>
                                    <div className="booking-dates-div">
                                        <div>Check In: {new Date(booking?.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        <div>Check Out: {new Date(booking?.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) :
                <div className="not-hosting-div">
                    <h2>You currently have no bookings</h2>
                    <button onClick={() => history.push('/')} className="not-hosting-home-btn">Home</button>
                </div>

                }
            </div>
        </>
    )
}

export default UserBookings;
