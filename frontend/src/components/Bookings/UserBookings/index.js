import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { thunkLoadUserBookings } from "../../../store/bookingReducer";
import OpenModalButton from "../../OpenModalButton";
import DeleteBooking from "../DeleteBooking";
import EditBooking from "../EditBooking";
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
    const userBookings = Object.values(useSelector(state => state.bookings.userBookings))

    const now = new Date();
    const currentBookings = userBookings
        .filter(booking => new Date(booking.endDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .map((booking) => {
            const formattedStartDate = formatDate(booking.startDate);
            const formattedEndDate = formatDate(booking.endDate);
            return { ...booking, formattedStartDate: formattedStartDate, formattedEndDate: formattedEndDate };
        });


    const pastBookings = userBookings
        .filter(booking => new Date(booking.endDate) < now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).reverse()
        .map((booking) => {
            const formattedStartDate = formatDate(booking.startDate);
            const formattedEndDate = formatDate(booking.endDate);
            return { ...booking, formattedStartDate: formattedStartDate, formattedEndDate: formattedEndDate };
        });

    function formatDate(dateString) {
        const year = dateString.slice(0, 4);
        const month = dateString.slice(5, 7);
        const day = dateString.slice(8, 10);
        return `${month}-${day}-${year}`;
    }

    if (!sessionUser) return <Redirect to="/"/>;

    return (
        <>
            <div className="whole-user-bookings-container">
                <h2 className="user-bookings-header">Current Bookings</h2>
                {currentBookings.length ? currentBookings.map(booking => {
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
                                        {/* <div>Check In: {new Date(booking?.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div> */}
                                        <div>Check In: {booking?.formattedStartDate}</div>
                                        <div>Check Out: {booking?.formattedEndDate}</div>
                                        {/* <div>Check Out: {new Date(booking?.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div> */}
                                    </div>
                                    <div className="booking-edit-delete-btn">
                                        {new Date(booking.startDate) > new Date() ?
                                            <OpenModalButton
                                                className="review-button"
                                                buttonText="Edit Booking"
                                                modalComponent={
                                                  <EditBooking
                                                    booking={booking}
                                                  />
                                                }
                                            />
                                                : null
                                        }
                                        {new Date(booking.startDate) > new Date() ?
                                            <OpenModalButton
                                                className="review-button"
                                                buttonText="Delete"
                                                modalComponent={
                                                  <DeleteBooking
                                                    booking={booking}
                                                  />
                                                }
                                            />
                                                : null
                                        }
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
                {pastBookings.length ? <h2 className="user-bookings-header">Past Bookings</h2> : null}
                {pastBookings.length ? pastBookings.map(booking => {
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
                                        <div>Check In: {booking?.formattedStartDate}</div>
                                        <div>Check Out: {booking?.formattedEndDate}</div>
                                    </div>
                                    <div>
                                        {new Date(booking.startDate) > new Date() ?
                                            <OpenModalButton
                                                className="review-button"
                                                buttonText="Edit Booking"
                                                modalComponent={
                                                  <EditBooking
                                                    booking={booking}
                                                  />
                                                }
                                            />
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) : null
                }
            </div>
        </>
    )
}

export default UserBookings;
