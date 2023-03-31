import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { thunkLoadSpotBookings } from "../../../store/bookingReducer";
import { thunkLoadOneSpot } from "../../../store/spotReducer";
import "./SpotBookings.css"

const SpotBookings = ({spotById}) => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const [ isLoaded, setIsLoaded ] = useState(false)
    // const [ shouldReload, setShouldReload ] = useState(false)

    useEffect(() => {
        dispatch(thunkLoadSpotBookings(spotId))
        .then(() => (setIsLoaded(true)))
    }, [dispatch, spotId])

    const bookingsArr = Object.values(useSelector(state => state.bookings))
    const sessionUser = useSelector(state => state.session.user)

    let spotBookings;
    if (bookingsArr.length) {
        spotBookings = (
            <div className="spot-booking-container">
                <div className="booking-title">
                    <div>Bookings</div>
                </div>
                <div className="start-and-end-date-container">
                    <div className="start-date-container">
                        <div className="date-header">Start Date</div>
                        <div>
                        {bookingsArr.map((booking) => (
                            <div className="start-end" key={booking.id}>
                            {booking.startDate}
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className="end-date-container">
                        <div className="date-header">End Date</div>
                        <div>
                        {bookingsArr.map((booking) => (
                            <div className="start-end" key={booking.id}>
                            {booking.endDate}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (!sessionUser) {
        spotBookings = (
            <div className="spot-booking-container booking-title">
                <div className="spot-name-no-bookings">Please Log In To View Bookings</div>
            </div>
        )
    }
    else {
        spotBookings = (
            <div className="spot-booking-container booking-title">
                <div className="spot-name-no-bookings">{spotById.name} has not bookings</div>
            </div>
        )
    }

    return (
        <>
        {isLoaded && spotBookings}
        </>
    )
}

export default SpotBookings
